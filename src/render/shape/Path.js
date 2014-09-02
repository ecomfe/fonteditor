/**
 * @file path.js
 * @author mengke01
 * @date 
 * @description
 * 绘制一段路径
 */


define(
    function(require) {
        var proto = {
            
            type: 'path',

            /**
             * 获取shape的矩形区域
             * 
             * @param {Object} shape shape数据
             * @param {Object} 矩形区域
             */
            getRect: function(shape) {
                return {
                    x: shape.x,
                    y: shape.y,
                    width: shape.width,
                    height:shape.height,
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
                
            }
        };



        return require('./Shape').derive(proto);
    }
);
