/**
 * @file Shape.js
 * @author mengke01
 * @date 
 * @description
 * Shape 基础对象
 */


define(
    function(require) {
        var lang = require('common/lang');

        /**
         * Shape 基础对象
         * 
         * @constructor
         * @param {Object} options 参数选项
         */
        function Shape(type, options) {
            lang.extend(this, options);
        }

        lang.extend(Shape.prototype, {
            

            /**
             * 对形状进行缩放
             * 
             * @return {Object} shape对象
             */
            scale: function(shape, camera) {
                // TODO
            },

            /**
             * 获取shape的矩形区域
             * 
             * @param {Object} shape shape数据
             * @param {Object} 矩形区域
             */
            getRect: function(shape) {
                // TODO
            },

            /**
             * 判断点是否在shape内部
             * 
             * @param {Object} shape shape数据
             * @param {number} x x偏移
             * @param {number} y y偏移
             * @param {boolean} 是否
             */
            isIn: function(shape, x, y) {
                // TODO
            },

            /**
             * 绘制一个shape对象
             * 
             * @param {CanvasContext} ctx canvas的context
             * @param {Object} shape shape数据
             * @param {Object} camera 当前的视角对象
             */
            draw: function(ctx, shape, camera) {
                // TODO
            },

            /**
             * 注销本对象
             */
            dispose: function() {
                // TODO
            }
        });
    
        /**
         * 派生出一个shape对象
         * 
         * @param {string} type shape类型
         * @param {Object} prototype 参数
         * @return {Shape} Shape类
         */
        Shape.derive = function(prototype) {

            function Constructor() {
                Shape.apply(this, arguments);
            }

            Constructor.constructor = Shape;
            lang.extend(Constructor.prototype, prototype);
            return Constructor;
        }

        return Shape;
    }
);
