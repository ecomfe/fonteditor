/**
 * @file 同步组件
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {
        var i18n = require('../i18n/i18n');
        var Resolver = require('common/promise');
        var project = require('./project');
        var writettf = require('./util/writettf');
        var ttf2woff = require('fonteditor-core/ttf/ttf2woff');
        var ttf2eot = require('fonteditor-core/ttf/ttf2eot');
        var ttf2svg = require('fonteditor-core/ttf/ttf2svg');
        var loader = require('./loader');
        var bytes2base64 = require('fonteditor-core/ttf/util/bytes2base64');
        var base642bytes = require('fonteditor-core/ttf/util/base642bytes');

        var SyncForm = require('./SyncForm');

        var DEFAULT_FONTTYPE = 'ttf'; // 同步默认的字体类型
        var exports = {};

        // 用来记录当前同步的状态，如是否支持拉取更新，是否支持推送
        // 0x1 服务不可用
        // 0x2 拉取不响应
        // 0x4 推送不响应
        var syncStatus = {};

        /**
         * 设置资源的同步能力
         *
         * @param {string} url 当前的同步资源
         * @param {number} status 状态
         */
        function setSyncStatus(url, status) {
            syncStatus[url] = (syncStatus[url] || 0xffff) & status;
            if (!status) {
                delete syncStatus[url];
            }
        }

        /**
         * 获取资源同步能力
         * @param  {string} url 当前的同步资源
         * @return {number} 状态
         */
        function getSyncStatus(url) {
            return syncStatus[url] || 0;
        }

        /**
         * 检查同步状态，是否有新的记录
         *
         * @return {promise}
         */
        function checkSync(syncConfig) {
            var data = {
                action: 'pull',
                fontName: syncConfig.name,
                fontType: DEFAULT_FONTTYPE, // 暂时只接收ttf类型的字体
                timestamp: syncConfig.timestamp || '',
            };

            var resolver = new Resolver();
            $.ajax({
                url: syncConfig.url,
                dataType: 'jsonp',
                data: data
            }).then(function (data) {
                if (data && data.status === 0) {
                    resolver.resolve(data.data);
                }
                // 有些服务器不支持拉取，这里也处理为有响应
                else {
                    setSyncStatus(syncConfig.url, 0x2);
                    resolver.resolve({});
                }
            }, function (reason) {
                setSyncStatus(syncConfig.url, 0x2);
                // 不支持拉取，但有可能支持推送，这里也处理为成功
                if (reason.status === 200) {
                    resolver.resolve({});
                }
                else {
                    alert('同步地址不可用!');
                    setSyncStatus(syncConfig.url, 0x1);
                    resolver.reject({
                        status: 404,
                        reason: 'sync no response'
                    });
                }
            });
            return resolver.promise();
        }

        /**
         * 根据配置获取需要同步的数据
         * @param  {Object} syncConfig 同步配置
         * @param  {Object} ttf        ttf对象
         * @return {Object}            同步的数据字段
         */
        function getSyncData(syncConfig, ttf) {
            var fontType = [];
            var syncData = {};
            if (syncConfig.woff || syncConfig.ttf || syncConfig.eot) {
                var buffer = writettf(ttf);

                if (syncConfig.ttf) {
                    fontType.push('ttf');
                    syncData.ttf = bytes2base64(buffer);
                }

                if (syncConfig.woff) {
                    fontType.push('woff');
                    syncData.woff = bytes2base64(ttf2woff(buffer));
                }

                if (syncConfig.eot) {
                    fontType.push('eot');
                    syncData.eot = bytes2base64(ttf2eot(buffer));
                }

                buffer = null;
            }

            if (syncConfig.svg) {
                fontType.push('svg');
                syncData.svg = btoa(ttf2svg(ttf));
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
         * @param  {Object} resolver   resolver对象
         */
        function doSync(syncConfig, ttf, resolver) {
            var form = new SyncForm(syncConfig.url, {
                serviceStatus: getSyncStatus(syncConfig.url)
            });
            var syncData = getSyncData(syncConfig, ttf);
            form.submit(syncData).then(function (data) {
                if (data.status === 0) {
                    resolver.resolve(data.data);
                }
                else {
                    resolver.reject(data);
                }
            }, function (data) {
                // 推送无响应
                if (data.status === 0x4) {
                    setSyncStatus(syncConfig.url, 0x4);
                }
                resolver.reject(data);
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

        /**
         * 添加一个任务
         * @param {Object} projectId 项目编号或者同步选项
         * @param {?Object} ttf 字体对象
         * @param {?Object} syncConfig 同步选项
         *
         * @return {Object} Promise对象
         */
        exports.addTask = function (projectId, ttf, syncConfig) {
            if (!syncConfig) {
                syncConfig = project.getConfig(projectId).sync;
            }
            if (!syncConfig || !syncConfig.url) {
                return Resolver.rejected({
                    status: 2,
                    statusInfo: i18n.lang.msg_not_set_sync_info
                });
            }

            var resolver = new Resolver();
            checkSync(syncConfig).then(function (data) {
                if (data.hasNew && window.confirm('字体`' + data.fontName + '`有新版本，是否同步新版本？')) {
                    if (data.fontType === DEFAULT_FONTTYPE && data[data.fontType]) {
                        // 解析后台传送过来的ttf字形
                        var ttfBuffer = new Int8Array(base642bytes(data[data.fontType])).buffer;
                        loader.load(ttfBuffer, {
                            type: 'ttf',
                            success: function (ttfObject) {
                                resolver.resolve({
                                    timestamp: data.timestamp,
                                    newData: ttfObject
                                });
                            },
                            error: function () {
                                alert('同步新版本出错!');
                            }
                        });
                    }
                    else {
                        alert('同步新版本出错!');
                    }
                    return;
                }
                // 获取当前推送的ttf，如果没有，则从本地存储中获取
                if (!ttf) {
                    project.get(projectId).then(function (data) {
                        doSync(syncConfig, data, resolver);
                    }, function () {
                        resolver.reject({
                            status: 2,
                            statusInfo: i18n.lang.msg_no_sync_font
                        });
                    });
                }
                else {
                    doSync(syncConfig, ttf, resolver);
                }
            }, function (data) {
                resolver.reject(data);
            });

            var promise = resolver.promise();
            // 更新当前的时间戳，这里包含两个来源，拉取新纪录的时间戳和推送成功后的时间戳
            promise.then(function (data) {
                if (data.timestamp) {
                    updateSyncTimestamp(projectId, data.timestamp, syncConfig);
                }
            });

            return promise;
        };

        return exports;
    }
);
