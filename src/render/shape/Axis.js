/**
 * @file 坐标轴绘制
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        var drawAxis = require('../util/drawAxis');

        var proto = {

            type: 'axis',

            adjust: function (shape, camera) {
                var center = camera.center;
                var ratio = camera.ratio;

                shape.unitsPerEm *= ratio;

                var metrics = shape.metrics;
                Object.keys(metrics).forEach(function (line) {
                    metrics[line] *= ratio;
                });

                shape.x = ratio * (shape.x - center.x) + center.x;
                shape.y = ratio * (shape.y - center.y) + center.y;

                return shape;
            },

            isIn: function (shape, x, y) {
                return false;
            },

            getBound: function (shape) {
                return {
                    x: shape.x,
                    y: shape.y,
                    width: 0,
                    height: 0
                };
            },

            draw: function (ctx, shape, camera) {

                shape.gap = (shape.graduation.gap || 100) * camera.scale;

                ctx.save();

                drawAxis(ctx, shape);

                ctx.restore();
                ctx.beginPath();
            }
        };



        return require('./Shape').derive(proto);
    }
);
