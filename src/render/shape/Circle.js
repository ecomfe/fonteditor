/**
 * @file Circle.js
 * @author mengke01
 * @date 
 * @description
 * 圆绘制
 */


define(
    function(require) {

        var proto = {
            
            type: 'circle',

            /**
             * 获取shape的矩形区域
             * 
             * @param {Object} shape shape数据
             * @param {Object} 矩形区域
             */
            getRect: function(shape) {
                return {
                    x: shape.x - shape.r,
                    y: shape.y - shape.r,
                    width: 2 * shape.r,
                    height: 2 * shape.r
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
                return Math.pow(shape.x - x, 2) + Math.pow(shape.y - y, 2) <= Math.pow(shape.r, 2);
            },

            /**
             * 绘制一个shape对象
             * 
             * @param {CanvasContext} ctx canvas的context
             * @param {Object} shape shape数据
             */
            draw: function(ctx, shape) {
                ctx.moveTo(shape.x + shape.r, shape.y);
                ctx.arc(shape.x, shape.y, shape.r, 0, Math.PI * 2, true);
            }
        };



        return require('./Shape').derive(proto);
    }
);
