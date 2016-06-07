/**
 * @file bezier曲线绘制
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {

        var isInsidePath = require('graphics/isInsidePath');
        var pathAdjust = require('graphics/pathAdjust');
        var computeBoundingBox = require('graphics/computeBoundingBox');

        var proto = {

            type: 'beziercurve',

            adjust: function (shape, camera) {
                var ratio = camera.ratio;
                var x = camera.center.x;
                var y = camera.center.y;
                pathAdjust(shape.points, ratio, ratio, -x, -y);
                pathAdjust(shape.points, 1, 1, x, y);
            },

            move: function (shape, mx, my) {
                pathAdjust(shape.points, 1, 1, mx, my);
                return shape;
            },

            getRect: function (shape) {
                return computeBoundingBox.computePath(shape.points);
            },

            isIn: function (shape, x, y) {
                var bound = computeBoundingBox.computePath(shape.points);
                if (
                    x <= bound.x + bound.width
                    && x >= bound.x
                    && y <= bound.y + bound.height
                    && y >= bound.y
                ) {

                    return isInsidePath(shape.points, {
                        x: x,
                        y: y
                    });
                }
                return false;
            },

            draw: function (ctx, shape) {
                var points = shape.points;
                // 二次bezier曲线
                if (points.length === 3) {
                    ctx.moveTo(points[0].x, points[0].y);
                    ctx.quadraticCurveTo(points[1].x, points[1].y, points[2].x, points[2].y);
                }
                // 三次bezier曲线
                else if (points.length === 4) {
                    ctx.moveTo(points[0].x, points[0].y);
                    ctx.bezierCurveTo(
                        points[1].x, points[1].y,
                        points[2].x, points[2].y,
                        points[3].x, points[3].y
                    );
                }
            }
        };


        return require('./Shape').derive(proto);
    }
);
