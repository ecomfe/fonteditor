/**
 * @file Render.js
 * @author mengke01
 * @date 
 * @description
 * 渲染器对象
 */


define(
    function(require) {

        var lang = require('common/lang');
        var guid = require('./util/guid');
        var Painter = require('./Painter');
        var MouseCapture = require('./capture/Mouse');
        var KeyboardCapture = require('./capture/Keyboard');
        var ResizeCapture = require('./capture/Resize');
        var observable = require('common/observable');

        /**
         * Render初始化
         * 
         */
        function init() {

            // 注册画布
            this.painter = new Painter(
                this.main,
                this.options.painter
            );

            // 注册鼠标
            this.capture = new MouseCapture(
                this.main,
                this.options.mouse
            );

            // 注册键盘
            this.keyCapture = new KeyboardCapture(
                this.main,
                this.options.keyboard
            );

            this.camera = this.painter.camera;

            var me = this;

            // 是否允许缩放
            if(this.options.enableScale) {
                this.capture.on('wheel', function(e) {
                    if (e.altKey || e.ctrlKey) {

                        e.originEvent.preventDefault();
                        e.originEvent.stopPropagation();

                        var defaultRatio = me.options.defaultRatio || 1.2;
                        var ratio = e.delta > 0 ?  defaultRatio : 1 / defaultRatio;
                        var toScale = me.camera.scale * ratio;
                        if (
                            toScale < me.options.minScale 
                            || toScale > me.options.maxScale
                        ) {
                            return;
                        }
                        
                        me.scale(ratio, e);
                    }
                    else {
                        var moval = e.delta > 0 ? 30 : -30;
                        me.move(e.shiftKey ? moval : 0, e.shiftKey ? 0 : moval);
                        me.refresh();
                    }
                });
            }

            // 窗口改变
            if(this.options.enableResize) {
                this.resizeCapture = new ResizeCapture(this.main);
                this.resizeCapture.on('resize', function(e) {
                    var prevSize = me.painter.getSize();
                    me.painter.resetSize();
                    var size = me.painter.getSize();
                    if(size.width != prevSize.width || size.height != prevSize.height) {
                        me.fire('resize', {
                            size: size,
                            prevSize: prevSize
                        });
                    }
                });
            }
        }

        /**
         * Render 构造函数
         * 
         * @constructor
         * @param {Object} options 参数选项
         */
        function Render(main, options) {

            this.main = main;

            this.options = lang.extend(
                {
                    defaultRatio: 1.2, // 默认的缩放比例
                    minScale: 0.2, // 最小缩放
                    maxScale: 200, //最大缩放
                    enableScale: true, // 是否允许缩放
                    enableResize: true // 是否允许大小改变
                }, 
                options
            );

            this.id = guid();

            if(!this.main) {
                throw 'require a main dom element';
            }

            init.call(this);
        }

        /**
         * 设置鼠标样式
         * 
         * @param {string} name 名字
         * @return {this}
         */
        Render.prototype.setCursor = function(name) {
            this.main.style.cursor = name || 'default';
            return this;
        };

        /**
         * 刷新render
         * 
         * @return {this}
         */
        Render.prototype.refresh = function() {
            this.painter.refresh();
            return this;
        };

        /**
         * 重置渲染器
         */
        Render.prototype.reset = function() {
            this.painter.reset();

        };

        /**
         * 缩放指定的比例
         * 
         * @param {number} ratio 比例
         * @param {Object} p 参考点坐标
         * @param {boolean} noRefresh 无刷新缩放
         * 
         * @return {this}
         */
        Render.prototype.scale = function(ratio, p, noRefresh) {

            var toScale = this.camera.scale * ratio;
            if (
                toScale < this.options.minScale 
                || toScale > this.options.maxScale
            ) {
                return;
            }

            this.camera.ratio = ratio;
            this.camera.center.x = p.x;
            this.camera.center.y = p.y;
            this.camera.scale = toScale;

            if(true !== noRefresh) {
                this.painter.refresh();
            }
            else {
                this.painter.adjust();
            }

            this.camera.ratio = 1;
        };

        /**
         * 缩放到指定的比例
         * 
         * @param {number} scale 比例
         * @param {Object} p 中心点坐标
         * @param {boolean} noRefresh 无刷新缩放
         * 
         * @return {this}
         */
        Render.prototype.scaleTo = function(scale, p, noRefresh) {

            // 缩放
            this.scale(scale / this.camera.scale, this.camera.center, true);

            // 平移
            this.painter.moveTo(p.x, p.y);
            this.camera.reset(p, scale);

            if(true !== noRefresh) {
                this.painter.refresh();
            }
        };

        /**
         * 获取焦点
         * 
         */
        Render.prototype.focus = function() {
            //this.capture.start();
            this.keyCapture.start();
        };

        /**
         * 离开焦点
         * 
         */
        Render.prototype.blur = function() {
            //this.capture.stop();
            this.keyCapture.stop();
        };

        /**
         * 注销对象
         * 
         */
        Render.prototype.dispose = function() {

            this.un();

            // 改变大小
            window.removeEventListener('resize', this._resizeObserver, false);
            this._resizeObserver = null;

            this.painter.dispose();
            this.capture.dispose();
            this.keyCapture.dispose();
            this.resizeCapture && this.resizeCapture.dispose();

            this.main = this.options = this.camera = null;
            this.painter = this.capture = this.keyCapture = null;
        };

        // 注册painter中的函数
        [   
            'addSupport', 'move', 'getSize',
            'getLayer', 'addLayer', 'removeLayer',
            'getShapeIn', 'clearShapes'
        ].forEach(function(fnName) {
            Render.prototype[fnName] = function() {
                return this.painter[fnName].apply(this.painter, arguments);
            };
        });

        observable.mixin(Render.prototype);

        return Render;
    }
);
