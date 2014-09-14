/**
 * @file Mouse.js
 * @author mengke01
 * @date 
 * @description
 * 鼠标动作捕获器
 */


define(

    function(require) {

        var lang = require('common/lang');
        var observable = require('common/observable');
        
        /**
         * 获取X坐标
         * @param {MouseEvent} e 事件
         * 
         * @return {number} 坐标值
         */
        function getX(e) {
            return e.offsetX || e.layerX || e.clientX;
        }

        /**
         * 获取Y坐标
         * @param {MouseEvent} e 事件
         * 
         * @return {number} 坐标值
         */
        function getY(e) {
            return e.offsetY || e.layerY || e.clientY;
        }

        /**
         * 键盘按键
         * @param {MouseEvent} e 事件
         * 
         * @return {Object} 按键列表
         */
        function getKey(e) {
            return {
                ctrlKey: e.ctrlKey,
                metaKey: e.metaKey,
                altKey: e.altKey,
                shiftKey: e.shiftKey
            };
        }

        /**
         * 获取事件参数
         * @param {MouseEvent} e 事件
         * 
         * @return {Object} 参数列表
         */
        function getEvent(e) {
            return {
                x: getX(e),
                y: getY(e),
                which: e.which,
                ctrlKey: e.ctrlKey,
                metaKey: e.metaKey,
                altKey: e.altKey,
                shiftKey: e.shiftKey
            };
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
         * 初始化函数
         * 
         * @private
         */
        function init() {
            var target = this.main;

            this.handlers = {
                mousewheel: lang.bind(mousewheel, this),
                mousemove: lang.bind(mousemove, this),
                mousedown: lang.bind(mousedown, this),
                dblclick: lang.bind(dblclick, this),
                mouseover: lang.bind(mouseover, this),
                mouseout: lang.bind(mouseout, this),
                mouseup: lang.bind(mouseup, this)
            };

            target.addEventListener('DOMMouseScroll', this.handlers.mousewheel, false);
            target.addEventListener('mousewheel', this.handlers.mousewheel, false);
            target.addEventListener('mousemove', this.handlers.mousemove, false);
            target.addEventListener('mousedown', this.handlers.mousedown, false);
            target.addEventListener('dblclick', this.handlers.dblclick, false);
            target.addEventListener('mouseover', this.handlers.mouseover, false);
            target.addEventListener('mouseout', this.handlers.mouseout, false);
            document.addEventListener('mouseup', this.handlers.mouseup, false);
        }

        /**
         * 按下处理事件
         * 
         * @param {Object} e 事件参数
         */
        function mousedown(e) {

            prevent(e);

            if(false === this.events.mousedown) {
                return;
            }

            var event = getEvent(e);

            this.startX = event.x;
            this.startY = event.y;
            this.startTime = Date.now();
            this.isDown = true;

            // 左键
            
            this.fire('down', event);

            if (3 == e.which) {
                this.fire('rightdown', event);
            }
        }

        /**
         * 双击事件
         * 
         * @param {Object} e 事件参数
         */
        function dblclick(e) {

            prevent(e);

            if(false === this.events.dblclick) {
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
            prevent(e);

            if(false === this.events.mousemove) {
                return;
            }

            var event = getEvent(e);

            this.fire('move', event);

            if (this.isDown && false !== this.events.drag) {

                event.startX = this.startX;
                event.startY = this.startY;
                event.deltaX = event.x - this.startX;
                event.deltaY = event.y - this.startY;

                if (Math.abs(event.deltaX) >= this.dragDelta || Math.abs(event.deltaY) >= this.dragDelta) {
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

            prevent(e);

            if(false === this.events.mouseup) {
                return;
            }

            var event = getEvent(e);
            event.time = Date.now() - this.startTime;

            // 左键

            this.fire('up', event);

            if (3 == e.which) {
                this.fire('rightup', event);
            }

            if (this.isDown && this.isDragging && false !== this.events.drag) {
                event.deltaX = event.x - this.startX;
                event.deltaY = event.y - this.startY;
                this.isDragging = false;
                this.fire('dragend', event);
            }
            else if(this.isDown && !this.isDragging && false !== this.events.click) {
                this.isDragging = false;
                this.fire('click', event);
            }

            this.isDown = false;
        }

        /**
         * 滚轮事件
         * 
         * @param {Object} e 事件参数
         */
        function mousewheel(e) {

            prevent(e);

            if(false === this.events.mousewheel) {
                return;
            }

            var delta = 0;
            if (e.wheelDelta) {
                delta = e.wheelDelta / 120;
            }
            else if (e.detail) {
                delta = e.detail / 3;
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
            prevent(e);
            if(false === this.events.mouseover) {
                return;
            }
            this.fire('over');
        }

        /**
         * 离开处理事件
         * 
         * @param {Object} e 事件参数
         */
        function mouseout(e) {
            prevent(e);
            if(false === this.events.mouseout) {
                return;
            }
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
            init.call(this, options);
        }


        lang.extend(MouseCapture.prototype, {

            /**
             * 注销
             */
            dispose: function() {
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
                this.un();
                this.main = this.events = null;
            }
        });


        observable.mixin(MouseCapture.prototype);
        return MouseCapture;
    }
);
