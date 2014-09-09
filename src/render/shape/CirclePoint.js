/**
 * @file CirclePoint.js
 * @author mengke01
 * @date 
 * @description
 * 绘制控制圆
 */


define(
    function(require) {

        var POINT_SIZE = 6;

        var proto = {
            
            type: 'cpoint',

            // 调整大小
            adjust: function(shape, camera) {
                return shape;
            },

            /**
             * 获取shape的矩形区域
             * 
             * @param {Object} shape shape数据
             * @param {Object} 矩形区域
             */
            getRect: function(shape) {
                return {
                    x: shape.x - POINT_SIZE,
                    y: shape.y - POINT_SIZE,
                    width: 2 * POINT_SIZE,
                    height: 2 * POINT_SIZE
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
                return Math.pow(shape.x - x, 2) + Math.pow(shape.y - y, 2) <= Math.pow(POINT_SIZE, 2);
            },

            /**
             * 绘制一个shape对象
             * 
             * @param {CanvasContext} ctx canvas的context
             * @param {Object} shape shape数据
             */
            draw: function(ctx, shape) {
                ctx.moveTo(shape.x + POINT_SIZE, shape.y);
                ctx.arc(shape.x, shape.y, POINT_SIZE, 0, Math.PI * 2, true);
            }
        };



        return require('./Shape').derive(proto);
    }
);
