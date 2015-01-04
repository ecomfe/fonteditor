/**
 * @file Rect.js
 * @author mengke01
 * @date
 * @description
 * 绘制多边形
 */


define(
    function (require) {

        var dashedLineTo = require('../util/dashedLineTo');
        var pathAdjust = require('graphics/pathAdjust');
        var computeBoundingBox = require('graphics/computeBoundingBox');
        var isInsidePolygon = require('graphics/isInsidePolygon');

        var proto = {

            type: 'polygon',

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
                return computeBoundingBox.computeBounding(shape.points);
            },

            isIn: function (shape, x, y) {
                var bound = computeBoundingBox.computeBounding(shape.points);
                if (
                    x <= bound.x + bound.width
                    && x >= bound.x
                    && y <= bound.y + bound.height
                    && y >= bound.y
                ) {

                    return isInsidePolygon(shape.points, {
                        x: x,
                        y: y
                    });
                }
                return false;
            },

            draw: function (ctx, shape) {

                var points = shape.points;
                if (!points || points.length < 2) {
                    return;
                }

                var i = 0;
                var l = points.length;
                if (shape.dashed) {
                    for (; i < l - 1; i++) {
                        dashedLineTo(ctx,
                            Math.round(points[i].x), Math.round(points[i].y),
                            Math.round(points[i + 1].x), Math.round(points[i + 1].y)
                        );
                    }
                    dashedLineTo(ctx,
                        Math.round(points[l - 1].x), Math.round(points[l - 1].y),
                        Math.round(points[0].x), Math.round(points[0].y)
                    );
                }
                else {

                    ctx.moveTo(Math.round(points[0].x), Math.round(points[0].y));
                    for (i = 1; i < l; i++) {
                        ctx.lineTo(
                            Math.round(points[i].x), Math.round(points[i].y)
                        );
                    }
                    ctx.lineTo(
                        Math.round(points[0].x), Math.round(points[0].y)
                    );
                }

            }
        };


        return require('./Shape').derive(proto);
    }
);
