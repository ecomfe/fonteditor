/**
 * @file Rect.js
 * @author mengke01
 * @date
 * @description
 * 绘制矩形
 */


define(
    function (require) {

        var dashedLineTo = require('../util/dashedLineTo');

        var proto = {

            type: 'rect',

            getRect: function (shape) {
                return shape;
            },

            isIn: function (shape, x, y) {
                var w = shape.width;
                var h = shape.height;
                return x <= shape.x + w
                    && x >= shape.x
                    && y <= shape.y + h
                    && y >= shape.y;
            },

            draw: function (ctx, shape) {

                var x = Math.round(shape.x);
                var y = Math.round(shape.y);
                var w = Math.round(shape.width);
                var h = Math.round(shape.height);

                if (shape.dashed) {
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

            }
        };


        return require('./Shape').derive(proto);
    }
);
