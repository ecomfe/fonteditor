/**
 * @file Graduation.js
 * @author mengke01
 * @date
 * @description
 * 刻度线
 */


define(
    function (require) {

        var drawGraduation = require('../util/drawGraduation');

        var proto = {

            type: 'graduation',

            adjust: function (shape, camera) {
                return shape;
            },

            isIn: function (shape, x, y) {
                return false;
            },

            draw: function (ctx, shape) {

                ctx.save();

                // 绘制刻度线
                drawGraduation(ctx, shape.config);

                ctx.restore();
                ctx.beginPath();

            }
        };

        return require('./Shape').derive(proto);
    }
);
