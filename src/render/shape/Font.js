/**
 * @file Font.js
 * @author mengke01
 * @date
 * @description
 * font字体绘制
 */


define(
    function (require) {

        var ShapeConstructor = require('./Shape');
        var isInsidePath = require('../../graphics/isInsidePath');
        var pathAdjust = require('graphics/pathAdjust');
        var drawPath = require('../util/drawPath');
        var computeBoundingBox = require('graphics/computeBoundingBox');

        var proto = {

            type: 'font',

            adjust: function (shape, camera) {
                var ratio = camera.ratio;
                var x = camera.center.x;
                var y = camera.center.y;
                var contours = shape.contours;
                for (var i = 0, l = contours.length; i < l; i++) {
                    pathAdjust(contours[i], ratio, ratio, -x, -y);
                    pathAdjust(contours[i], 1, 1, x, y);
                }

                return shape;

            },

            move: function (shape, mx, my) {
                var contours = shape.contours;
                for (var i = 0, l = contours.length; i < l; i++) {
                    pathAdjust(contours[i], 1, 1, mx, my);
                }
                return shape;
            },

            getRect: function (shape) {
                return computeBoundingBox.computePath.apply(null, shape.contours);
            },

            isIn: function (shape, x, y) {
                var bound = computeBoundingBox.computePath.apply(null, shape.contours);
                if (
                    x <= bound.x + bound.width
                    && x >= bound.x
                    && y <= bound.y + bound.height
                    && y >= bound.y
                ) {
                    var contours = shape.contours;
                    for (var i = 0, l = contours.length; i < l; i++) {
                        if (isInsidePath(contours[i], {
                            x: x,
                            y: y
                        })) {
                            return true;
                        }
                    }
                }
                return false;
            },

            draw: function (ctx, shape) {
                var contours = shape.contours;
                for (var i = 0, l = contours.length; i < l; i++) {
                    drawPath(ctx, contours[i]);
                }
            }
        };



        return ShapeConstructor.derive(proto);
    }
);
