/**
 * @file 绘制虚线段
 * @author mengke01(kekee000@gmail.com)
 *
 * modify from:
 * zrender/src/shape/util
 */

/**
 * 绘制虚线段
 *
 * @param {CanvasRenderingContext2D} ctx canvascontext
 * @param {number} x1 x1坐标
 * @param {number} y1 y1坐标
 * @param {number} x2 x2坐标
 * @param {number} y2 y2坐标
 * @param {?number} dashLength 虚线长度
 */
export default function dashedLineTo(ctx, x1, y1, x2, y2, dashLength) {

    dashLength = typeof dashLength !== 'number'
                    ? 2
                    : dashLength;

    let dx = x2 - x1;
    let dy = y2 - y1;

    let numDashes = Math.floor(
        Math.sqrt(dx * dx + dy * dy) / dashLength
    );

    dx = dx / numDashes;
    dy = dy / numDashes;

    let flag = true;

    for (let i = 0; i < numDashes; ++i) {
        if (flag) {
            ctx.moveTo(x1, y1);
        }
        else {
            ctx.lineTo(x1, y1);
        }

        flag = !flag;
        x1 += dx;
        y1 += dy;
    }
    ctx.lineTo(x2, y2);
}
