/**
 * @file drawAxis.js
 * @author mengke01
 * @date 
 * @description
 * 绘制辅助线
 */


define(
    function(require) {

        var dashedLineTo = require('./dashedLineTo');

        /**
         * 绘制辅助线
         * 
         * @param {Canvas2DContext} ctx context对象
         * @param {Object} config 配置信息
         */
        function drawAxis(ctx, config) {

                var gap = Math.round(config.gap);
                var xMax = Math.round(ctx.canvas.width + gap);
                var yMax = Math.round(ctx.canvas.height + gap);
                var x = Math.round(config.x);
                var y = Math.round(config.y);

                // 显示网格线
                if (false !== config.showGrid) {
                    ctx.beginPath();
                    ctx.strokeStyle = config.gapColor || '#A6A6FF';

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
                }

                ctx.beginPath();
                ctx.strokeStyle = config.metricsColor || 'red';

                ctx.moveTo(0, y);
                ctx.lineTo(xMax, y);
                ctx.moveTo(x, 0);
                ctx.lineTo(x, yMax);

                // 绘制辅助线
                var metrics = config.metrics;
                var thickness = config.graduation.thickness || 22;
                for (var line in metrics) {
                    var lineY = y - Math.round(metrics[line]);
                    dashedLineTo(ctx, 0, lineY, xMax, lineY, 4);
                }

                ctx.save();
                ctx.scale(0.8, 0.8);
                for (var line in metrics) {
                    ctx.fillText(line, thickness * 1.25, (y - metrics[line]) * 1.25 - 2);
                }
                ctx.fillText('Baseline', thickness * 1.25, y * 1.25 - 2);
                ctx.restore();

                ctx.stroke();

                // em 框
                // ctx.beginPath();
                // ctx.strokeStyle = config.emColor || 'red';
                // var mx = Math.round(x + config.unitsPerEm);
                // dashedLineTo(ctx, mx, 0, mx, yMax , 4);

                ctx.stroke();

        }

        return drawAxis;
    }
);
