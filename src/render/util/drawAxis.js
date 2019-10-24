/**
 * @file 绘制辅助线
 * @author mengke01(kekee000@gmail.com)
 */

import dashedLineTo from './dashedLineTo';

/**
 * 绘制辅助线
 *
 * @param {CanvasRenderingContext2D} ctx context对象
 * @param {Object} config 配置信息
 */
export default function drawAxis(ctx, config) {

    let gap = Math.round(config.graduation.gap * config.scale);
    let xMax = Math.round(ctx.canvas.width + gap);
    let yMax = Math.round(ctx.canvas.height + gap);
    let x = Math.round(config.x);
    let y = Math.round(config.y);
    let i;

    // 显示网格线
    if (false !== config.showGrid) {
        ctx.beginPath();
        ctx.strokeStyle = config.gapColor || '#A6A6FF';

        // 横轴线
        for (i = y; i < yMax; i += gap) {
            ctx.moveTo(0, i);
            ctx.lineTo(xMax, i);
        }

        for (i = y; i > 0; i -= gap) {
            ctx.moveTo(0, i);
            ctx.lineTo(xMax, i);
        }


        // 纵轴线
        for (i = x; i < xMax; i += gap) {
            ctx.moveTo(i, 0);
            ctx.lineTo(i, yMax);
        }

        for (i = x; i > 0; i -= gap) {
            ctx.moveTo(i, 0);
            ctx.lineTo(i, yMax);
        }

        ctx.stroke();
    }

    // metrics
    ctx.beginPath();
    ctx.strokeStyle = config.metricsColor || '#FF6E67';
    // 绘制辅助线
    let metrics = config.metrics;
    let thickness = config.graduation.thickness || 22;
    let metricsLines = Object.keys(metrics);

    metricsLines.forEach(function (line) {
        let lineY = y - Math.round(metrics[line]);
        dashedLineTo(ctx, 0, lineY, xMax, lineY, 4);
    });
    ctx.stroke();

    // axis
    ctx.beginPath();
    ctx.strokeStyle = config.axisColor || 'red';
    ctx.moveTo(0, y);
    ctx.lineTo(xMax, y);
    ctx.moveTo(x, 0);
    ctx.lineTo(x, yMax);
    ctx.stroke();

    // text
    ctx.save();
    ctx.scale(0.8, 0.8);
    metricsLines.forEach(function (line) {
        ctx.fillText(line, thickness * 1.25, (y - metrics[line]) * 1.25 - 2);
    });
    ctx.fillText('Baseline', thickness * 1.25, y * 1.25 - 2);
    ctx.restore();
}
