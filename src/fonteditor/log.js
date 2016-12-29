/**
 * @file 运营活动类非结果页日志组件
 * @author sunwei11@baidu.com,
 *         mengke01(kekee000@gmail.com)
 */

/* eslint-disable fecs-camelcase */


define(function (require) {

    /**
     * 默认的参数配置
     *
     * @type {Object}
     */
    var defaultOptions = {
        url: 'http://fonteditor.duapp.com/?url=',
        data: {
            from: 'fonteditor' // 标记统计类型
        }
    };

    /**
     * log 的fm类型
     * @type {Object}
     */
    var logFMType = {
        BTN: 'beha',
        TAB: 'beha',
        LINK: 'click'
    };

    /**
     * 发送日志请求
     *
     * @memberof module:log
     * @method module:log~send
     * @param {string} url 日志完整地址
     * @inner
     */

    function send(data) {
        if (!defaultOptions.url) {
            return;
        }

        var url = defaultOptions.url + JSON.stringify($.extend({}, defaultOptions.data, data));
        var img = document.createElement('img');
        img.src = url;
    }


    var onClick = function (e) {
        var target = e.target;
        var logReg = /\bWA_LOG_(BTN|TAB|LINK)\b/;
        while (target && target !== document) {
            var match = target.className.match(logReg);
            if (match) {
                var data = {
                    fm: logFMType[match[1]] || '-',
                    extra: target.getAttribute('data-click')
                        || $(target).closest('[data-click]').attr('data-click')
                        || '-'
                };

                send(data);
                break;
            }
            target = target.parentNode;
        }
    };

    return {

        /**
         * 配置项
         *
         * @see module:log~options
         * @param {Object} ops 可配置项
         * @return {module:log} log
         */
        config: function (ops) {
            $.extend(true, defaultOptions, ops);
            return this;
        },

        /**
         * 开始监听页面点击日志
         *
         * @return {module:log} log
         * @fires module:log#start
         */
        start: function () {
            document.addEventListener('click', onClick, true);
            return this;
        },

        /**
         * 停止监听页面点击日志
         *
         * @return {module:log} log
         */
        stop: function () {
            document.removeEventListener('click', onClick, true);
            return this;
        },

        /**
         * 手动发送统计请求
         *
         * @param {Object} data 要替换的日志参数
         * @return {Object} this 当前发送的日志参数
         */
        send: function (data) {
            send(data);
            return this;
        },

        init: function () {
            this.start();

            // 首屏pv
            this.send({
                fm: 'pv'
            });
        }
    };

});
