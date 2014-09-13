/**
 * @file Rect.js
 * @author mengke01
 * @date 
 * @description
 * 绘制矩形
 */


define(
    function(require) {

        var dashedLineTo = require('../util/dashedLineTo');

        var proto = {
            
            type: 'rect',

            /**
             * 获取shape的矩形区域
             * 
             * @param {Object} shape shape数据
             * @param {Object} 矩形区域
             */
            getRect: function(shape) {
                return shape;
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
                var w = shape.width;
                var h = shape.height;
                return x <= shape.x + w
                    && x >= shape.x
                    && y <= shape.y + h
                    && y >= shape.y;
            },

            /**
             * 绘制一个shape对象
             * 
             * @param {CanvasContext} ctx canvas的context
             * @param {Object} shape shape数据
             */
            draw: function(ctx, shape) {

                ctx.translate(0.5, 0.5);
                var x = Math.round(shape.x);
                var y = Math.round(shape.y);
                var w = Math.round(shape.width);
                var h = Math.round(shape.height);

                if(shape.dashed) {
                    dashedLineTo(ctx, x, y, x + w, y);
                    dashedLineTo(ctx, x + w, y, x + w, y + h);
                    dashedLineTo(ctx, x + w, y + h, x, y + h);
                    dashedLineTo(ctx, x, y + h, x, y);
                }
                else {
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + w, y);
                    ctx.lineTo(x + w, y + h);
                    ctx.lineTo(x, y + h);
                    ctx.lineTo(x, y);
                }
                ctx.translate(-0.5, -0.5);
            }
        };



        return require('./Shape').derive(proto);
    }
);
