/**
 * @file 带箭头的竖直或者水平线
 * @author mengke01(kekee000@gmail.com)
 */

import shape from './Shape';
const ARROW_HEIGHT = 6; // 箭头高度
const ARROW_WIDTH = 3; // 箭头宽度

export default shape.derive({
    type: 'gridarrow',

    adjus(shape, camera) {
        let center = camera.center;
        let ratio = camera.ratio;

        if (undefined !== shape.p0.x) {
            shape.p0.x = ratio * (shape.p0.x - center.x) + center.x;
        }
        else {
            shape.p0.y = ratio * (shape.p0.y - center.y) + center.y;
        }

        return shape;
    },

    move(shape, mx, my) {

        if (undefined !== shape.p0.x) {
            shape.p0.x += mx;
        }
        else {
            shape.p0.y += my;
        }
        return shape;
    },

    getRec(shape) {
        return false;
    },

    isIn(shape, x, y) {
        // 单点模式
        return undefined !== shape.p0.x && Math.abs(shape.p0.x - x) < 4
            || undefined !== shape.p0.y && Math.abs(shape.p0.y - y) < 4;
    },

    /**
     * 绘制一个shape对象
     *
     * @param {CanvasContext} ctx canvas的context
     * @param {Object} shape shape数据
     * @param {number} shape.p0.x x坐标位置
     * @param {number} shape.p0.y y坐标位置
     * @param {number} shape.p0.y y坐标位置
     * @param {Object} shape.arrow 箭头配置数据
     */
    draw(ctx, shape, camera) {
        if (undefined !== shape.p0.x) {
            let x0 = Math.round(shape.p0.x);
            ctx.moveTo(x0, 0);
            ctx.lineTo(x0, ctx.canvas.height);
            if (shape.arrow) {
                ctx.moveTo(x0, shape.arrow.y);
                ctx.lineTo(x0 - ARROW_WIDTH, shape.arrow.y + ARROW_HEIGHT);
                ctx.lineTo(x0 + ARROW_WIDTH, shape.arrow.y + ARROW_HEIGHT);
                ctx.lineTo(x0, shape.arrow.y);
            }
        }
        else {
            let y0 = Math.round(shape.p0.y);
            ctx.moveTo(0, y0);
            ctx.lineTo(ctx.canvas.width, y0);
            if (shape.arrow) {
                ctx.moveTo(shape.arrow.x, y0);
                ctx.lineTo(shape.arrow.x + ARROW_HEIGHT, y0 - ARROW_WIDTH);
                ctx.lineTo(shape.arrow.x + ARROW_HEIGHT, y0 + ARROW_WIDTH);
                ctx.lineTo(shape.arrow.x, y0);
            }
        }

        // 绘制axis的坐标
        if (shape.axis && shape.drawAxisText) {
            ctx.save();
            ctx.scale(0.8, 0.8);
            let axis = shape.axis;
            let thickness = (axis.graduation.thickness || 22) + 18;
            if (undefined !== shape.p0.x) {
                let px = Math.round((shape.p0.x - shape.axis.x) / camera.scale);
                ctx.fillText(px, (shape.p0.x + 2) * 1.25, thickness * 1.25);
            }
            else {
                let py = Math.round((shape.axis.y - shape.p0.y) / camera.scale);
                ctx.fillText(py, thickness * 1.25, (shape.p0.y - 2) * 1.25);
            }
            ctx.restore();
        }
    }
});
