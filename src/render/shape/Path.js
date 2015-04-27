/**
 * @file 路径绘制
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {

        var isInsidePath = require('../../graphics/isInsidePath');
        var pathAdjust = require('graphics/pathAdjust');
        var drawPath = require('../util/drawPath');
        var computeBoundingBox = require('graphics/computeBoundingBox');

        var proto = {

            type: 'path',

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
                drawPath(ctx, shape.points);
            }
        };



        return require('./Shape').derive(proto);
    }
);
