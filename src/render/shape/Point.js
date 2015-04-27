/**
 * @file 点绘制
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {

        var POINT_SIZE = 6; // 控制点的大小

        var proto = {

            type: 'point',

            getRect: function (shape) {
                var size = shape.size || POINT_SIZE;
                return {
                    x: shape.x - size / 2,
                    y: shape.y - size / 2,
                    width: size,
                    height: size
                };
            },

            isIn: function (shape, x, y) {
                var size = shape.size || POINT_SIZE;
                var w = size;
                var h = size;
                return x <= shape.x + w
                    && x >= shape.x - w
                    && y <= shape.y + h
                    && y >= shape.y - h;
            },

            draw: function (ctx, shape) {

                var x = Math.round(shape.x);
                var y = Math.round(shape.y);
                var size = shape.size || POINT_SIZE;
                var w = size / 2;
                var h = size / 2;
                ctx.moveTo(x - w, y - h);
                ctx.lineTo(x + w, y - h);
                ctx.lineTo(x + w, y + h);
                ctx.lineTo(x - w, y + h);
                ctx.lineTo(x - w, y - h);
            }
        };


        return require('./Shape').derive(proto);
    }
);
