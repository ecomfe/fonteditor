/**
 * @file 简单字形绘制
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        var ShapeConstructor = require('./Shape');
        var drawPath = require('../util/drawPath');

        var proto = {

            type: 'glyf',

            adjust: function (shape, camera) {
                var center = camera.center;
                var ratio = camera.ratio;

                shape.x = ratio * (shape.x - center.x) + center.x;
                shape.y = ratio * (shape.y - center.y) + center.y;

                return shape;

            },

            move: function (shape, mx, my) {
                shape.x += mx;
                shape.y += my;

                return shape;
            },

            getRect: function (shape) {
                return false;
            },

            isIn: function (shape, x, y) {
                return false;
            },

            draw: function (ctx, shape, camera) {

                ctx.save();
                ctx.translate(shape.x, shape.y);
                ctx.scale(camera.scale, -camera.scale);

                var transform = shape.transform;
                ctx.transform(
                    transform.a,
                    transform.b,
                    transform.c,
                    transform.d,
                    transform.e,
                    transform.f
                );

                var contours = shape.glyf.contours;
                for (var i = 0, l = contours.length; i < l; i++) {
                    drawPath(ctx, contours[i]);
                }

                ctx.restore();
            }
        };



        return ShapeConstructor.derive(proto);
    }
);
