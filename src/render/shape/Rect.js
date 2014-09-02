/**
 * @file Circle.js
 * @author mengke01
 * @date 
 * @description
 * 绘制矩形
 */


define(
    function(require) {

        var proto = {
            
            type: 'rect',

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
                    height: shape.height
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
                return x <= shape.x + shape.width 
                    && x >= shape.x
                    && y <= shape.y + shape.height
                    && y >= shape.y;
            },

            /**
             * 绘制一个shape对象
             * 
             * @param {CanvasContext} ctx canvas的context
             * @param {Object} shape shape数据
             */
            draw: function(ctx, shape) {
                var w = shape.width;
                var h = shape.height;
                ctx.moveTo(shape.x, shape.y);
                ctx.lineTo(shape.x + w, shape.y);
                ctx.lineTo(shape.x + w, shape.y + h);
                ctx.lineTo(shape.x, shape.y + h);
                ctx.lineTo(shape.x, shape.y);
            }
        };



        return require('./Shape').derive(proto);
    }
);
