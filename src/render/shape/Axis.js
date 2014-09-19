/**
 * @file Circle.js
 * @author mengke01
 * @date 
 * @description
 * 圆绘制
 */


define(
    function(require) {

        var drawAxis = require('../util/drawAxis');

        var proto = {
            
            type: 'axis',

            /**
             * 对形状进行缩放平移调整
             * 
             * @return {Object} shape对象
             */
            adjust: function(shape, camera) {
                var center = camera.center;
                var ratio = camera.ratio;

                shape.gap *= ratio;
                shape.unitsPerEm *= ratio;
                var metrics = shape.metrics;
                for (var line in metrics) {
                    metrics[line] *= ratio;
                }

                shape.x = ratio * (shape.x - center.x) + center.x;
                shape.y = ratio * (shape.y - center.y) + center.y;

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
                return false;
            },

            /**
             * 绘制一个shape对象
             * 
             * @param {CanvasContext} ctx canvas的context
             * @param {Object} shape shape数据
             */
            draw: function(ctx, shape) {

                if (undefined === shape.gap) {
                    shape.gap = 100;
                }
                
                ctx.save();

                drawAxis(ctx, shape);

                ctx.restore();
                ctx.beginPath();
                
            }
        };



        return require('./Shape').derive(proto);
    }
);
