/**
 * @file 同步组件
 * @author mengke01(kekee000@gmail.com)
 */
/* globals Int8Array, ArrayBuffer */

import i18n from '../i18n/i18n';
import string from 'common/string';
import project from './project';
import program from './program';
import resolvettf from './util/resolvettf';
import font from 'fonteditor-core/ttf/font';
import ttf2woff from 'fonteditor-core/ttf/ttf2woff';
import ttf2eot from 'fonteditor-core/ttf/ttf2eot';
import base642bytes from 'fonteditor-core/ttf/util/base642bytes';
import loader from './loader';
import SyncForm from './SyncForm';
import syncStatus from './sync-status';
const curSyncStatus = {};
const DEFAULT_FONTTYPE = 'ttf'; // 同步默认的字体类型

/**
 * 设置资源的同步能力
 *
 * @param {string} url 当前的同步资源
 * @param {number} status 状态
 */
function setSyncStatus(url, status) {
    curSyncStatus[url] = (curSyncStatus[url] || 0xffff) & status;
    if (!status) {
        delete curSyncStatus[url];
    }
}

/**
 * 获取资源同步能力
 *
 * @param  {string} url 当前的同步资源
 * @return {number} 状态
 */
function getSyncStatus(url) {
    return curSyncStatus[url] || 0;
}

/**
 * 检查同步状态，是否有新的记录
 *
 * @param {Object} syncConfig sync config
 * @return {Promise}
 */
function checkSync(syncConfig) {
    let data = {
        action: 'pull',
        encode: 'base64',
        fontName: syncConfig.name,
        fontType: DEFAULT_FONTTYPE, // 暂时只接收ttf类型的字体
        timestamp: syncConfig.timestamp || 0
    };

    return new Promise((resolve, reject) => {
        $.ajax({
            url: syncConfig.url,
            dataType: 'jsonp',
            data
        }).then(function (data) {
            if (data && data.status === 0) {
                resolve(data.data);
            }
            // 有些服务器不支持拉取，这里也处理为有响应
            else {
                setSyncStatus(syncConfig.url, syncStatus.pullNoResponse);
                resolve({
                    status: syncStatus.parseDataError
                });
            }
        }, function (reason) {
            setSyncStatus(syncConfig.url, syncStatus.pullNoResponse);
            // 不支持拉取，但有可能支持推送，这里也处理为成功
            if (reason.status === 200) {
                resolve({
                    status: syncStatus.pullNoResponse
                });
            }
            else {
                setSyncStatus(syncConfig.url, syncStatus.serviceNotAvailable);
                reject({
                    status: syncStatus.serviceNotAvailable,
                    reason: 'sync no response'
                });
                alert(i18n.lang.msg_error_sync_font_address);
            }
        });
    });
}

/**
 * 检查是否带有更新的字体，有更新则解析
 *
 * @param  {Object} data 解析的数据
 * @return {Promise}
 */
function confirmSync(data) {
    return new Promise((resolve, reject) => {
        if (data.hasNew && (data.fontType === DEFAULT_FONTTYPE && data[data.fontType])) {
            if (window.confirm(string.format(i18n.lang.msg_has_new_font_version, data.fontName))) {
                // 解析后台传送过来的ttf字形
                let ttfBuffer = new Int8Array(base642bytes(data[data.fontType])).buffer;
                loader.load(ttfBuffer, {
                    type: data.fontType,
                    success(ttfObject) {
                        resolve({
                            status: 0,
                            hasNew: 1,
                            newData: ttfObject,
                            timestamp: data.timestamp
                        });
                    },
                    error() {
                        data.status = syncStatus.parseFontError;
                        reject(data);
                        alert(i18n.lang.msg_error_sync_font_version);
                    }
                });
            }
            else {
                data.status = syncStatus.cancelSync;
                reject(data);
            }
        }
        else {
            data.status = syncStatus.noHasNew;
            reject(data);
        }
    });
}

/**
 * 根据配置获取需要同步的数据
 *
 * @param  {Object} syncConfig 同步配置
 * @param  {Object} ttf        ttf对象
 * @return {Object}            同步的数据字段
 */
function getSyncData(syncConfig, ttf) {
    let fontType = [];
    let syncData = {};
    let buffer = null;
    if (syncConfig.woff || syncConfig.ttf || syncConfig.eot) {
        ttf = resolvettf(ttf);
        try {
            buffer = font.create(ttf).write({
                type: 'ttf'
            });
        }
        catch (e) {
            program.fire('font-error', e);
            alert(e.message);
            throw e;
        }

        if (syncConfig.ttf) {
            fontType.push('ttf');
            syncData.ttf = font.toBase64(buffer);
        }

        if (syncConfig.woff) {
            fontType.push('woff');
            syncData.woff = font.toBase64(ttf2woff(buffer));
        }

        if (syncConfig.eot) {
            fontType.push('eot');
            syncData.eot = font.toBase64(ttf2eot(buffer));
        }

        buffer = null;
    }

    if (syncConfig.svg) {
        fontType.push('svg');
        let svg = font.create(ttf).write({
            type: 'svg'
        });
        syncData.svg = font.toBase64(svg);
    }

    syncData.encode = 'base64';
    syncData.fontName = syncConfig.name;
    syncData.fontType = fontType.join(',');
    return syncData;
}

/**
 * 进行远程同步
 *
 * @param  {Object} syncConfig 同步配置
 * @param  {Object} ttf        ttf对象
 * @param  {Function} resolve   resolve
 * @param  {Function} reject   reject
 */
function doSync(syncConfig, ttf, resolve, reject) {
    let form = new SyncForm(syncConfig.url, {
        serviceStatus: getSyncStatus(syncConfig.url)
    });
    let syncData = getSyncData(syncConfig, ttf);
    form.submit(syncData).then(function (data) {
        if (data.status === 0) {
            resolve(data.data);
        }
        else {
            data.status = syncStatus.parseDataError;
            reject(data);
        }
    }, function (data) {
        // 推送无响应
        if (data.status === syncStatus.pushNoResponse) {
            setSyncStatus(syncConfig.url, syncStatus.pushNoResponse);
        }
        reject(data);
    });
}


/**
 * 进行远程推送服务
 *
 * @param  {Object} syncConfig 同步配置
 * @param  {Object} ttf        ttf对象
 * @param  {Function} resolve   resolve
 * @param  {Function} reject   reject
 */
function doPush(syncConfig, ttf, resolve, reject) {
    if (!syncConfig.pushUrl) {
        resolve({});
        return;
    }

    let form = new SyncForm(syncConfig.pushUrl, {
        serviceStatus: syncStatus.pushNoResponse // 推送服务不检查是否有返回
    });
    let syncData = getSyncData(syncConfig, ttf);
    form.submit(syncData).then(function (data) {
        resolve(data);
    }, function (data) {
        reject(data);
    });
}

/**
 * 更新推送时间戳，在下一次推送的时候发送时间戳
 *
 * @param  {string} projectId  项目编号
 * @param  {number} timestamp  当前记录时间戳
 * @param  {Object} syncConfig 同步配置
 */
function updateSyncTimestamp(projectId, timestamp, syncConfig) {
    if (!syncConfig) {
        syncConfig = project.getConfig(projectId).sync;
    }
    syncConfig.timestamp = timestamp || 0;
    project.updateConfig(projectId, {
        sync: syncConfig
    });
}

export default {

    /**
     * 添加一个任务
     *
     * @param {Object} options 任务参数
     * @param {string} options.type 同步类型，push or pull
     * @param {string} options.projectId 项目编号或者同步选项
     * @param {?Object} options.ttf 字体对象
     * @param {?Object} options.config 同步选项
     *
     * @return {Object} Promise对象
     */
    addTask(options = {}) {
        let syncType = options.type || 'push';
        let projectId = options.projectId;
        let ttf = options.ttf;
        let syncConfig = options.config;
        options = null;

        if (!syncConfig) {
            syncConfig = project.getConfig(projectId).sync;
        }

        if (!syncConfig || (!syncConfig.url && !syncConfig.pushUrl)) {
            return Promise.reject({
                status: 2,
                statusInfo: i18n.lang.msg_not_set_sync_info
            });
        }

        let promise = new Promise((resolve, reject) => {
            // 仅设置推送地址，不设置同步地址则只进行推送
            if (syncType === 'push' && !syncConfig.url && syncConfig.pushUrl) {
                doPush(syncConfig, ttf, resolve, reject);
                return;
            }

            if (syncType === 'pull') {
                // 同步之后，如果有新纪录，则更新记录
                checkSync(syncConfig).then(confirmSync).then(function (data) {
                    resolve(data);
                }, function (data) {
                    reject(data);
                });
            }
            else {
                // 同步之后，如果有新纪录，则更新记录，不更新记录则进行推送
                checkSync(syncConfig).then(confirmSync).then(function (data) {
                    resolve(data);
                }, function (data) {
                    if (data.status === syncStatus.serviceNotAvailable) {
                        reject(data);
                        return;
                    }

                    // 获取当前推送的ttf，如果没有，则从本地存储中获取
                    if (!ttf) {
                        reject({
                            status: 2,
                            statusInfo: i18n.lang.msg_no_sync_font
                        });
                    }
                    else {
                        // 推送数据到同步服务器
                        doSync(syncConfig, ttf, resolve, reject);
                        // 推送数据到推送地址
                        if (syncConfig.pushUrl && syncConfig.pushUrl !== syncConfig.url) {
                            setTimeout(() => {
                                doPush(syncConfig, ttf, resolve, reject);
                            }, 200);
                        }
                    }
                });
            }

        });

        // 更新当前的时间戳，这里包含两个来源，拉取新纪录的时间戳和推送成功后的时间戳
        promise.then(function (data) {
            if (data && data.timestamp) {
                updateSyncTimestamp(projectId, data.timestamp, syncConfig);
            }
        });
        return promise;
    }
};
