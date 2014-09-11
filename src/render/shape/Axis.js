/**
 * @file Circle.js
 * @author mengke01
 * @date 
 * @description
 * 圆绘制
 */


define(
    function(require) {

        var dashedLineTo = require('../util/dashedLineTo');

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

                shape.width *= ratio;
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
                var gap = Math.round(shape.width || 100);
                var xMax = Math.round(ctx.canvas.width + gap);
                var yMax = Math.round(ctx.canvas.height + gap);
                var x = Math.round(shape.x);
                var y = Math.round(shape.y);

                ctx.translate(0.5, 0.5);

                // 横轴线
                for(var i = y; i < yMax; i += gap) {
                    ctx.moveTo(0, i);
                    ctx.lineTo(xMax, i);
                }

                for(var i = y; i > 0; i -= gap) {
                    ctx.moveTo(0, i);
                    ctx.lineTo(xMax, i);
                }


                // 纵轴线
                for(var i = x; i < xMax; i += gap) {
                    ctx.moveTo(i, 0);
                    ctx.lineTo(i, yMax);
                }

                for(var i = x; i > 0; i -= gap) {
                    ctx.moveTo(i, 0);
                    ctx.lineTo(i, yMax);
                }

                ctx.stroke();
                ctx.save();

                // 绘制网格
                ctx.beginPath();

                ctx.strokeStyle = shape.gridColor || 'red';

                ctx.moveTo(0, y);
                ctx.lineTo(xMax, y);
                ctx.fillText('Baseline', 2, y - 2);

                ctx.moveTo(x, 0);
                ctx.lineTo(x, yMax);

                // 绘制辅助线
                var metrics = shape.metrics;

                for (var line in metrics) {
                    var lineY = y - Math.round(metrics[line]);
                    dashedLineTo(ctx, 0, lineY, xMax, lineY, 4);
                    ctx.fillText(line, 2, lineY - 2);
                }
                ctx.stroke();

                // em 框
                ctx.beginPath();
                ctx.strokeStyle = shape.emColor || 'red';
                var mx = Math.round(x + shape.unitsPerEm);
                dashedLineTo(ctx, mx, 0, mx, yMax , 4);

                ctx.stroke();

                ctx.restore();
                ctx.beginPath();

                ctx.translate(-0.5, -0.5);
            }
        };



        return require('./Shape').derive(proto);
    }
);
