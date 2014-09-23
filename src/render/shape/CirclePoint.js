/**
 * @file CirclePoint.js
 * @author mengke01
 * @date 
 * @description
 * 绘制控制圆
 */


define(
    function(require) {

        var POINT_SIZE = 2;

        var proto = {
            
            type: 'cpoint',

            /**
             * 获取shape的矩形区域
             * 
             * @param {Object} shape shape数据
             * @param {Object} 矩形区域
             */
            getRect: function(shape) {
                var size = shape.size || POINT_SIZE;
                return {
                    x: shape.x - size,
                    y: shape.y - size,
                    width: 2 * size,
                    height: 2 * size
                };
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
                var size = shape.size || POINT_SIZE;
                return Math.pow(shape.x - x, 2) + Math.pow(shape.y - y, 2) <= Math.pow(size * 2, 2);
            },

            /**
             * 绘制一个shape对象
             * 
             * @param {CanvasContext} ctx canvas的context
             * @param {Object} shape shape数据
             */
            draw: function(ctx, shape) {
                var size = shape.size || POINT_SIZE;
                var x = Math.round(shape.x);
                var y = Math.round(shape.y);

                ctx.moveTo(x + size, y);
                ctx.arc(x, y, size, 0, Math.PI * 2, true);

            }
        };



        return require('./Shape').derive(proto);
    }
);
