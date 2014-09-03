/**
 * @file render.js
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

            this.camera = this.painter.camera;

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

        return Render;
    }
);
