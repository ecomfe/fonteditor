/**
 * @file 用于同步的form表单对象
 * @author mengke01(kekee000@gmail.com)
 */

import program from './program';
import syncStatus from './sync-status';

const PUSH_TIME_OUT = 10000; // 同步超时时间;
let formSubmitId = 0;


function createSubmitForm(data) {
    var form = document.createElement('form');
    form.id = 'form_sync_' + (formSubmitId++);
    form.target = 'sync-frame';
    form.method = 'post';
    // 默认为push操作
    form.action = this.url + (~this.url.indexOf('?') ? '&' : '?') + 'action=push';
    // 设置成功回调地址
    data.callbackUrl = program.config.proxyUrl + '?callback=' + this.callback;

    Object.keys(data).forEach(function (key) {
        var element = document.createElement('input');
        element.type = 'hidden';
        element.name = key;
        element.value = data[key];
        form.appendChild(element);
    });
    document.body.appendChild(form);
    return form;
}

export default class SyncForm {

    /**
     * 用于同步的form表单对象
     *
     * @param {string} url  同步地址
     * @param {Object} options 同步参数
     * @param {number} options.serviceStatus 当前服务器的同步状态
     */
    constructor(url, options = {}) {
        this.url = url;
        this.serviceStatus = options.serviceStatus || 0;
    }

    /**
     * 提交同步表单
     *
     * @param {Object} data 用于同步的数据
     * @return {Promise}
     */
    submit(data) {
        this.callback = 'script_sync_' + (formSubmitId++);

        const form = createSubmitForm.call(this, data);
        form.submit();
        document.body.removeChild(form);

        return new Promise((resolve, reject) => {
            window[this.callback] = data => {
                resolve(data);
                this.dispose();
            };

            // 如果推送服务无响应，则直接返回成功
            if (this.serviceStatus & syncStatus.pushNoResponse) {
                delete window[this.callback];
                resolve({
                    status: 0
                });
                return;
            }

            this.timer = setTimeout(() => {
                reject({
                    status: syncStatus.pushNoResponse,
                    reason: 'sync time out!'
                });
                this.dispose();
            }, PUSH_TIME_OUT);
        });
    }

    /**
     * 重置表单，用于下次提交
     *
     * @return {SyncForm}
     */
    reset() {
        clearTimeout(this.timer);
        if (this.callback) {
            delete window[this.callback];
            delete this.callback;
        }
        return this;
    }

    /**
     * 注销
     */
    dispose() {
        this.reset();
    }
}
