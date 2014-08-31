/**
 * @file Render.js
 * @author mengke01
 * @date 
 * @description
 * 图形渲染组件
 */

define(
    function(require) {

        var lang = require('common/lang');
        var guid = require('./util/guid');
        var Painter = require('./Painter');
        var MouseCapture = require('./capture/Mouse');
        var KeyboardCapture = require('./capture/Keyboard');
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


            var me = this;

            this.capture.on('dragstart', function(e) {
                var shape = me.painter.getShapeIn(e);
                if(shape) {
                    shape['_x'] = shape.x;
                    shape['_y'] = shape.y;
                }
                me.selectedShape = shape;
            });

            this.capture.on('drag', function(e) {
                var shape = me.selectedShape;
                if(shape) {
                    shape.x = shape['_x'] + e.deltaX;
                    shape.y = shape['_y'] + e.deltaY;
                    me.painter.getLayer(shape.layerId).refresh();
                }
            });

            this.capture.on('dragend', function(e) {
                var shape = me.selectedShape;
                if(shape) {
                    me.painter.getLayer(shape.layerId).refresh();
                    me.selectedShape = null;
                }
            });


        }


        /**
         * Render 构造函数
         * 
         * @constructor
         * @param {Object} options 参数选项
         */
        function Render(main, options) {

            this.main = main;
            this.options = options || {};
            this.id = guid();

            if(!this.main) {
                throw 'require a main dom element';
            }

            init.call(this);
        }

        /**
         * 刷新render
         * 
         */
        Render.prototype.refresh = function() {
            this.painter.refresh();
        };

        /**
         * 注销对象
         * 
         */
        Render.prototype.dispose = function() {
            this.painter.dispose();
            this.capture.dispose();
            this.keyCapture.dispose();
            this.un();
            this.main = this.options = null;
            this.painter = this.capture = this.keyCapture = null;
        };

        /**
         * 添加layer
         * 
         * @return {Layer} Layer对象
         */
        Render.prototype.addLayer = function() {
            return this.painter.addLayer.apply(this.painter, arguments);
        };

        /**
         * 移除layer
         * 
         * @return {boolean} 是否移除
         */
        Render.prototype.removeLayer = function() {
            return this.painter.removeLayer.apply(this.painter, arguments);
        };

        observable.mixin(Render.prototype);

        /**
         * 创建一个render
         * @param {HTMLElement} main 主控区域
         * @param {Object} options 创建参数
         * @return {Render} render对象
         */
        Render.create = function(main, options) {
            return new Render(main, options);
        };

        return Render;
    }
);
