/**
 * @file Shape 基础对象，用来绘制shape数据
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {
        var lang = require('common/lang');

        /**
         * Shape 基础对象
         *
         * @constructor
         * @param {Object} options 参数选项
         */
        function Shape(options) {
            options = options || {};
        }

        Shape.prototype = {

            constructor: Shape,

            /**
             * 对形状进行缩放平移调整
             *
             * @param {Object} shape shape对象
             * @param {Camera} camera Camera对象
             *
             * @return {Object} shape对象
             */
            adjust: function (shape, camera) {
                var center = camera.center;
                var ratio = camera.ratio;

                if (typeof shape.x === 'number') {
                    shape.x = ratio * (shape.x - center.x) + center.x;
                }

                if (typeof shape.y === 'number') {
                    shape.y = ratio * (shape.y - center.y) + center.y;
                }

                if (typeof shape.width === 'number') {
                    shape.width = ratio * shape.width;
                }

                if (typeof shape.width === 'number') {
                    shape.height = ratio * shape.height;
                }

                if (typeof shape.r === 'number') {
                    shape.r = ratio * shape.r;
                }

                return shape;
            },

            /**
             * 移动指定位置
             * @param {Object} shape shape对象
             * @param {number} mx x偏移
             * @param {number} my y偏移
             * @return {Object} shape对象
             */
            move: function (shape, mx, my) {

                if (typeof shape.x === 'number') {
                    shape.x += mx;
                }

                if (typeof shape.y === 'number') {
                    shape.y += my;
                }

                return shape;
            },

            /**
             * 获取shape的矩形区域
             *
             * @param {Object} shape shape数据
             * @return {Object} 矩形区域
             */
            getRect: function (shape) {
                // TODO
                return false;
            },

            /**
             * 判断点是否在shape内部
             *
             * @param {Object} shape shape数据
             * @param {number} x x偏移
             * @param {number} y y偏移
             * @return {boolean} 是否
             */
            isIn: function (shape, x, y) {
                // TODO
                return false;
            },

            /**
             * 绘制一个shape对象
             *
             * @param {CanvasRenderingContext2D} ctx canvas的context
             * @param {Object} shape shape数据
             * @param {Object} camera 当前的视角对象
             */
            draw: function (ctx, shape, camera) {
                // TODO
            },

            /**
             * 注销本对象
             */
            dispose: function () {
                // TODO
            }
        };

        /**
         * 派生出一个shape对象
         *
         * @param {Object} prototype 参数
         * @return {Shape} Shape类
         */
        Shape.derive = function (prototype) {

            function SubShape() {
                Shape.apply(this, arguments);
            }

            SubShape.prototype = prototype;
            lang.inherits(SubShape, Shape);
            return SubShape;
        };

        /**
         * 克隆一个shape对象
         *
         * @param {Object} shape shape对象
         * @return {Object} shape对象
         */
        function cloneShape(shape) {
            return lang.clone(shape);
        }

        Shape.clone = cloneShape;

        return Shape;
    }
);
