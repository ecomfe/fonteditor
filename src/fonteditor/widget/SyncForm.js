/**
 * @file 用于同步的form表单对象
 * @author mengke01(kekee000@gmail.com)
 */


define(function (require) {
    var lang = require('common/lang');
    var Resolver = require('common/promise');
    var program = require('./program');

    var PUSH_TIME_OUT = 10000; // 同步超时时间;
    var formSubmitId = 0;


    function createSubmitForm(data) {
        var form = document.createElement('form');
        form.id = 'form_sync_' + (formSubmitId++);
        form.target = 'sync-frame';
        form.method = 'post';
        // 默认为push操作
        form.action = this.url + (~this.url.indexOf('?') ? '&' : '?') + 'action=push';
        // 设置成功回调地址
        data.callbackUrl = program.proxyUrl + '?callback=' + this.callback;

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

    function onSubmitCallback(data) {
        this.resolver && this.resolver.resolve(data);
        this.dispose();
    }

    function onSubmitTimeout() {
        this.resolver && this.resolver.reject({
            status: 0x4,
            reason: 'sync time out!'
        });
        this.dispose();
    }

    /**
     * 用于同步的form表单对象
     *
     * @param {string} url  同步地址
     * @param {Object} options 同步参数
     * @param {number} options.serviceStatus 当前服务器的同步状态
     */
    function SyncForm(url, options) {
        options = options || {};
        this.url = url;
        this.serviceStatus = options.serviceStatus || 0;
    }

    /**
     * 提交同步表单
     *
     * @param {Object} data 用于同步的数据
     * @return {promise}
     */
    SyncForm.prototype.submit = function (data) {
        this.callback = 'script_sync_' + (formSubmitId++);
        window[this.callback] = $.proxy(onSubmitCallback, this);
        var form = createSubmitForm.call(this, data);
        form.submit();
        document.body.removeChild(form);
        // 如果推送服务无响应，则直接返回成功
        if (this.serviceStatus & 0x4) {
            return Resolver.resolved({
                status: 0
            });
        }
        this.timer = setTimeout($.proxy(onSubmitTimeout, this), PUSH_TIME_OUT);
        this.resolver = new Resolver();
        return this.resolver.promise();
    };

    /**
     * 重置表单，用于下次提交
     *
     * @return {SyncForm}
     */
    SyncForm.prototype.reset = function () {
        clearTimeout(this.timer);
        if (this.callback) {
            delete window[this.callback];
            delete this.callback;
        }
        delete this.resolver;
        return this;
    };

    /**
     * 注销
     */
    SyncForm.prototype.dispose = function () {
        this.reset();
    };

    return SyncForm;
});
