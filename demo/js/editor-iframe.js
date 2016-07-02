/**
 * @file iframe 调用编辑器
 * @author mengke01(kekee000@gmail.com)
 */


define(function (require) {

    /**
     * 用于远程 editor 编辑器接口，由于使用postMessage进行跨域调用，
     * 这里接口都采用异步化
     *
     * @param {Object} options 参数
     * @param {jQuery|HTMLElement} options.main 主元素，iframe对象或者jquery对象
     * @param {string=} options.url editor接口
     */
    function Editor(options) {
        this.main = $(options.main);
        this.url = options.url || '../editor.html';
        this.key = 'editor-' + Math.random();
        // 给 editor页面传递 key id，以便于通信的时候根据key来进行通信
        this.onMessage = $.proxy(this.onMessage, this);
        this.readyList = [];

        // 注册默认监听的事件
        this.events = {
            load: function () {
                var me = this;
                this.readyList.forEach(function (promise) {
                    promise.resolve(me);
                });
                this.readyList = null;
                this.loaded = true;
            }
        };

        var url = this.url + (this.url.indexOf('?') >= 0 ? '&' : '?') + 'key=' + this.key;
        var frame = this.main[0];
        frame.src = url;
        window.addEventListener('message', this.onMessage);
    }

    /**
     * 编辑器准备就绪时的事件
     *
     * @return {Promise}
     */
    Editor.prototype.ready = function () {
        var promise = $.Deferred();
        if (this.loaded) {
            promise.resolve(this);
        }
        else {
            this.readyList.push(promise);
        }
        return promise;
    };

    /**
     * 设置字体格式
     *
     * @param {Object} font 字体格式
     * @return {Promise}
     */
    Editor.prototype.setFont = function (font) {
        return this.postMessage('setFont', [font]);
    };

    /**
     * 获取字体格式
     *
     * @return {Promise}
     */
    Editor.prototype.getFont = function () {
        return this.postMessage('getFont');
    };

    /**
     * 执行命令
     *
     * @param {string} name 命令
     * @param {Array?} args 命令参数列表
     * @return {Promise}
     */
    Editor.prototype.execCommand = function () {
        return this.postMessage('execCommand', [].slice.call(arguments));
    };

    /**
     * 获取editor对象，用来进行同域时候的精细化调用
     *
     * @return {Editor}
     */
    Editor.prototype.getEditor = function () {
        return this.main[0].contentWindow.editor;
    };

    Editor.prototype.postMessage = function (name, args) {
        var stamp = Date.now();
        if (this.events[stamp]) {
            throw new Error('call proxy function to quickly:' + name);
        }

        this.events[stamp] = $.Deferred();
        this.main[0].contentWindow.postMessage({
            key: this.key,
            name: name,
            stamp: stamp,
            data: args || null
        }, '*');
        return this.events[stamp];
    };

    Editor.prototype.onMessage = function (e) {
        if (e.data.key === this.key) {
            var name = e.data.name;
            var data = e.data.data;
            var stamp = e.data.stamp;
            if (stamp && this.events[stamp]) {
                this.events[stamp].resolve(data);
                delete this.events[stamp];
            }
            else if (this.events[name]) {
                this.events[name].call(this, data)
            }
        }
    };

    Editor.prototype.dispose = function () {
        this.main.remove();
        this.events = this.main = null;
    };



    var shape_baidu = require('demo/../data/contours-5');
    var editor = new Editor({
        main: '.editor-frame'
    })


    editor.ready().then(function (editor) {
        editor.setFont(shape_baidu).then(function () {
            editor.execCommand('rescale', 0.5)
        })
    })

    $('#get-font').on('click', function () {
        editor.getFont().then(function (data) {
            console.log(data)
        })
    })

    return {};
});
