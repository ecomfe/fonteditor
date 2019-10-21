/**
 * @file 直线绘制
 * @author mengke01(kekee000@gmail.com)
 */

import shape from './Shape';
import dashedLineTo from '../util/dashedLineTo';
import computeBoundingBox from 'graphics/computeBoundingBox';

export default shape.derive({

    type: 'line',

    adjust(shape, camera) {
        let center = camera.center;
        let ratio = camera.ratio;

        if (undefined !== shape.p0.x) {
            shape.p0.x = ratio * (shape.p0.x - center.x) + center.x;
        }
        else {
            shape.p0.y = ratio * (shape.p0.y - center.y) + center.y;
        }

        if (undefined !== shape.p1) {
            shape.p1.x = ratio * (shape.p1.x - center.x) + center.x;
            shape.p1.y = ratio * (shape.p1.y - center.y) + center.y;
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

        if (undefined !== shape.p1) {
            shape.p1.x += mx;
            shape.p1.y += my;
        }
        return shape;
    },

    getRect(shape) {
        return undefined === shape.p1
            ? false
            : computeBoundingBox.computeBounding([shape.p0, shape.p1]);
    },

    isIn(shape, x, y) {

        // 单点模式
        if (undefined === shape.p1) {
            return undefined !== shape.p0.x && Math.abs(shape.p0.x - x) < 4
                || undefined !== shape.p0.y && Math.abs(shape.p0.y - y) < 4;
        }

        let x0 = shape.p0.x;
        let y0 = shape.p0.y;
        let x1 = shape.p1.x;
        let y1 = shape.p1.y;
        return (y - y0) * (x - x1) === (y - y1) * (x - x0);
    },

    /**
     * 绘制一个shape对象
     *
     * @param {CanvasContext} ctx canvas的context
     * @param {Object} shape shape数据
     */
    draw(ctx, shape) {

        let x0;
        let y0;
        let x1;
        let y1;

        // 单点模式
        if (undefined === shape.p1) {

            if (undefined !== shape.p0.x) {
                x0 = Math.round(shape.p0.x);
                ctx.moveTo(x0, 0);
                ctx.lineTo(x0, ctx.canvas.height);
            }
            else {
                y0 = Math.round(shape.p0.y);
                ctx.moveTo(0, y0);
                ctx.lineTo(ctx.canvas.width, y0);
            }

        }
        else {
            x0 = Math.round(shape.p0.x);
            y0 = Math.round(shape.p0.y);
            x1 = Math.round(shape.p1.x);
            y1 = Math.round(shape.p1.y);

            if (shape.dashed) {
                dashedLineTo(ctx, x0, y0, x1, y1);
            }
            else {
                ctx.moveTo(x0, y0);
                ctx.lineTo(x1, y1);
            }
        }

    }
});
