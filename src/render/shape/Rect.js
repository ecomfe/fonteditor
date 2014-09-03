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
                    x: shape.x - shape.width / 2 ,
                    y: shape.y - shape.height / 2,
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
                var w = shape.width / 2;
                var h = shape.height / 2;
                return x <= shape.x + w
                    && x >= shape.x - w
                    && y <= shape.y + h
                    && y >= shape.y - h;
            },

            /**
             * 绘制一个shape对象
             * 
             * @param {CanvasContext} ctx canvas的context
             * @param {Object} shape shape数据
             */
            draw: function(ctx, shape) {
                var w = shape.width / 2;
                var h = shape.height / 2;
                ctx.moveTo(shape.x - w, shape.y - h);
                ctx.lineTo(shape.x + w, shape.y - h);
                ctx.lineTo(shape.x + w, shape.y + h);
                ctx.lineTo(shape.x - w, shape.y + h);
                ctx.lineTo(shape.x - w, shape.y - h);
            }
        };



        return require('./Shape').derive(proto);
    }
);
