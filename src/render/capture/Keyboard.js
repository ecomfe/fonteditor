/**
 * @file Mouse.js
 * @author mengke01
 * @date 
 * @description
 * 键盘动作捕获器
 */


define(
    function(require) {

        var lang = require('common/lang');
        var observable = require('common/observable');

        // 键盘名称映射表
        var keyCodeMap = {
            37: 'left',
            38: 'up' ,
            39: 'right',
            40: 'down',
            13: 'enter',
            27: 'esc',
            8: 'backspace',
            45: 'insert',
            46: 'delete',
            16: 'shift',
            17: 'ctrl',
            18: 'alt',
            36: 'home',
            47: 'help',
            20: 'caps',
            9: 'tab'
        }

        /**
         * 阻止事件传递
         * @param {MouseEvent} e 事件
         */
        function prevent(e) {
            e.stopPropagation();
            if (e.preventDefault) {
                e.preventDefault()
            }
            else {
                e.returnValue = false;
            }
        }

        /**
         * 键盘按键
         * @param {MouseEvent} e 事件
         * 
         * @return {Object} 按键列表
         */
        function getKey(e) {
            return {
                keyCode: e.keyCode,
                key: keyCodeMap[e.keyCode],
                ctrlKey: e.ctrlKey,
                metaKey: e.metaKey,
                altKey: e.altKey,
                shiftKey: e.shiftKey
            };
        }

        /**
         * 初始化函数
         * 
         * @private
         */
        function init() {

            var target = this.main;

            this.handlers = {
                keydown: lang.bind(keydetect, this, 'down'),
                keyup: lang.bind(keydetect, this, 'up'),
                keypress: lang.bind(keydetect, this, 'press'),
            };

            target.addEventListener('keydown', this.handlers.keydown, false);
            target.addEventListener('keyup', this.handlers.keyup, false);
            target.addEventListener('keypress', this.handlers.keypress, false);
        }


        /**
         * 按下处理事件
         * 
         * @param {Object} e 事件参数
         */
        function keydetect(keyEvent, e) {

            prevent(e);

            if(false === this.events['key' + Event]) {
                return;
            }

            var event = getEvent(e);
            this.fire('key' + keyEvent, event);

            var keyName = keyCodeMap[event.keyCode];
            if (keyName) {
                this.fire(keyName + ':' + keyEvent, event);
            }
        }


        /**
         * 鼠标动作捕获器
         * 
         * @constructor
         * @param {HTMLElement} main 控制元素
         * @param {Object} options 参数选项
         * @param {HTMLElement} options.main 监控对象
         */
        function KeyboardCapture(main, options) {
            this.main = main;
            options = options || {};
            this.events = options.events || {};
            init.call(this, options);
        }


        lang.extend(KeyboardCapture.prototype, {
            /**
             * 注销
             */
            dispose: function() {
                var target = this.main;
                target.removeEventListener('keydown', this.handlers.keydown);
                target.removeEventListener('keyup', this.handlers.keyup);
                target.removeEventListener('keypress', this.handlers.keypress);
                this.main = this.events = null;
                this.un();
            }
        });

        observable.mixin(KeyboardCapture.prototype);

        return KeyboardCapture;
    }
);
