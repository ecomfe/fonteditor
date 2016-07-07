/**
 * @file 鼠标捕获器
 * @author mengke01(kekee000@gmail.com)
 */

define(

    function (require) {

        var lang = require('common/lang');
        var observable = require('common/observable');

        /**
         * 获取X坐标
         *
         * @param {MouseEvent} e 事件
         * @return {number} 坐标值
         */
        function getX(e) {
            return e.offsetX || e.layerX || e.clientX;
        }

        /**
         * 获取Y坐标
         *
         * @param {MouseEvent} e 事件
         * @return {number} 坐标值
         */
        function getY(e) {
            return e.offsetY || e.layerY || e.clientY;
        }

        /**
         * 获取事件参数
         *
         * @param {MouseEvent} e 事件
         * @return {Object} 事件参数
         */
        function getEvent(e) {
            return {
                x: getX(e),
                y: getY(e),
                which: e.which,
                ctrlKey: e.ctrlKey || e.metaKey,
                metaKey: e.metaKey,
                altKey: e.altKey,
                shiftKey: e.shiftKey,
                originEvent: e
            };
        }

        /**
         * 阻止事件传递
         *
         * @param {MouseEvent} e 事件
         */
        function prevent(e) {
            e.stopPropagation();
            if (e.preventDefault) {
                e.preventDefault();
            }
            else {
                e.returnValue = false;
            }
        }

        /**
         * 按下处理事件
         *
         * @param {Object} e 事件参数
         */
        function mousedown(e) {

            if (false === this.events.mousedown) {
                return;
            }

            prevent(e);

            var event = getEvent(e);

            this.startX = event.x;
            this.startY = event.y;
            this.startTime = Date.now();
            this.isDown = true;

            // 左键

            this.fire('down', event);

            if (3 === e.which) {
                this.fire('rightdown', event);
            }

            document.addEventListener('mouseup', this.handlers.mouseup, false);
        }

        /**
         * 双击事件
         *
         * @param {Object} e 事件参数
         */
        function dblclick(e) {

            prevent(e);

            if (false === this.events.dblclick) {
                return;
            }

            this.fire('dblclick', getEvent(e));
        }

        /**
         * 鼠标移动事件
         *
         * @param {Object} e 事件参数
         */
        function mousemove(e) {

            if (false === this.events.mousemove) {
                return;
            }

            prevent(e);

            var event = getEvent(e);

            this.fire('move', event);

            if (this.isDown && false !== this.events.drag) {

                event.startX = this.startX;
                event.startY = this.startY;
                event.deltaX = event.x - this.startX;
                event.deltaY = event.y - this.startY;

                if (
                    Math.abs(event.deltaX) >= this.dragDelta
                    || Math.abs(event.deltaY) >= this.dragDelta
                ) {
                    if (!this.isDragging) {
                        this.isDragging = true;
                        this.fire('dragstart', event);
                    }
                }

                if (this.isDragging) {
                    this.fire('drag', event);
                }
            }
        }


        /**
         * 鼠标弹起事件
         *
         * @param {Object} e 事件参数
         */
        function mouseup(e) {



            if (false === this.events.mouseup) {
                return;
            }

            prevent(e);

            var event = getEvent(e);
            event.time = Date.now() - this.startTime;

            // 左键

            this.fire('up', event);

            if (3 === e.which) {
                this.fire('rightup', event);
            }

            if (this.isDown && this.isDragging && false !== this.events.drag) {
                event.deltaX = event.x - this.startX;
                event.deltaY = event.y - this.startY;
                this.isDragging = false;
                this.fire('dragend', event);
            }
            else if (this.isDown && !this.isDragging && false !== this.events.click) {
                this.isDragging = false;
                this.fire('click', event);
            }

            this.isDown = false;

            document.removeEventListener('mouseup', this.handlers.mouseup);
        }

        /**
         * 滚轮事件
         *
         * @param {Object} e 事件参数
         */
        function mousewheel(e) {

            if (false === this.events.mousewheel) {
                return;
            }

            prevent(e);

            // tracepad触发滚动事件比滚轮触发速度快很多，这里需要截流一下
            // 15毫秒可以去掉一半的trancepad滚动事件, 但是对滚轮滚动影响很小
            // http://stackoverflow.com/questions/5527601/normalizing-mousewheel-speed-across-browsers
            var now = Date.now();
            if (this.lastWheel && now - this.lastWheel < 15) {
                return;
            }
            this.lastWheel = now;


            var delta = 0;
            if (e.wheelDelta) {
                delta = e.wheelDelta % 120 === 0 ? e.wheelDelta / 120 : e.wheelDelta / 3;
            }
            else if (e.detail) {
                delta = -e.detail / 3;
            }

            var event = getEvent(e);
            event.delta = delta;
            this.fire('wheel', event);
        }


        /**
         * 进入处理事件
         *
         * @param {Object} e 事件参数
         */
        function mouseover(e) {

            if (false === this.events.mouseover) {
                return;
            }

            prevent(e);

            this.fire('over');
        }

        /**
         * 离开处理事件
         *
         * @param {Object} e 事件参数
         */
        function mouseout(e) {

            if (false === this.events.mouseout) {
                return;
            }

            prevent(e);

            this.fire('out');
        }

        /**
         * 鼠标动作捕获器
         *
         * @param {HTMLElement} main 控制元素
         * @param {Object} options 参数选项
         * @param {HTMLElement} options.main 监控对象
         *
         * @constructor
         */
        function MouseCapture(main, options) {

            this.main = main;
            options = options || {};
            this.events = options.events || {};
            this.dragDelta = 2;

            this.handlers = {
                mousewheel: lang.bind(mousewheel, this),
                mousemove: lang.bind(mousemove, this),
                mousedown: lang.bind(mousedown, this),
                dblclick: lang.bind(dblclick, this),
                mouseover: lang.bind(mouseover, this),
                mouseout: lang.bind(mouseout, this),
                mouseup: lang.bind(mouseup, this)
            };

            this.start();
        }


        MouseCapture.prototype = {

            constructor: MouseCapture,

            /**
             * 开始监听
             *
             * @return {this}
             */
            start: function () {

                if (!this.listening) {
                    this.listening = true;

                    var target = this.main;
                    target.addEventListener('DOMMouseScroll', this.handlers.mousewheel, false);
                    target.addEventListener('mousewheel', this.handlers.mousewheel, false);
                    target.addEventListener('mousemove', this.handlers.mousemove, false);
                    target.addEventListener('mousedown', this.handlers.mousedown, false);
                    target.addEventListener('dblclick', this.handlers.dblclick, false);
                    target.addEventListener('mouseover', this.handlers.mouseover, false);
                    target.addEventListener('mouseout', this.handlers.mouseout, false);
                }

                return this;
            },

            /**
             * 停止监听
             *
             * @return {this}
             */
            stop: function () {

                if (this.listening) {
                    this.listening = false;

                    var target = this.main;
                    target.removeEventListener('DOMMouseScroll', this.handlers.mousewheel);
                    target.removeEventListener('mousewheel', this.handlers.mousewheel);
                    target.removeEventListener('mousemove', this.handlers.mousemove);
                    target.removeEventListener('mousedown', this.handlers.mousedown);
                    target.removeEventListener('click', this.handlers.click);
                    target.removeEventListener('dblclick', this.handlers.dblclick);
                    target.removeEventListener('mouseover', this.handlers.mouseover);
                    target.removeEventListener('mouseout', this.handlers.mouseout);
                    document.removeEventListener('mouseup', this.handlers.mouseup);
                }

                return this;
            },

            /**
             * 是否监听中
             *
             * @return {boolean} 是否
             */
            isListening: function () {
                return !!this.listening;
            },

            /**
             * 注销
             */
            dispose: function () {
                this.stop();
                this.un();
                this.main = this.events = null;
            }
        };


        observable.mixin(MouseCapture.prototype);
        return MouseCapture;
    }
);
