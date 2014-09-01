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
             * 对形状进行缩放平移调整
             * 
             * @return {Object} shape对象
             */
            adjust: function(shape, camera) {
                var center = camera.center;
                var ratio = camera.ratio;
                var scale = camera.scale;
                var _shape = shape['_shape'];

                if(typeof shape.x === 'number') {
                    _shape.x = ratio * (_shape.x - center.x) + center.x;
                }

                if(typeof shape.y === 'number') {
                    _shape.y = ratio * (_shape.y - center.y) + center.y;
                }

                if(typeof shape.width === 'number') {
                    _shape.width = scale * shape.width;
                }

                if(typeof shape.width === 'number') {
                    _shape.height = scale * shape.height;
                }

                if(typeof shape.r === 'number') {
                    _shape.r = scale * shape.r;
                }

                return shape;
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
            lang.extend(Constructor.prototype, Shape.prototype, prototype);
            return Constructor;
        }

        /**
         * 克隆一个shape对象
         * 
         * @param {Object} shape shape对象
         * @return {Object} shape对象
         */
        function cloneShape(shape) {
            var _shape = null;
            // 移出克隆的元素
            if(shape['_shape']) {
                _shape = shape['_shape'];
                delete shape['_shape'];
            }

            var cloned = lang.clone(shape);

            if(_shape) {
                shape['_shape'] = _shape;
            }
            return cloned;
        }

        Shape.clone = cloneShape;

        return Shape;
    }
);
