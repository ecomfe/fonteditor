/**
 * @file 矩形绘制
 * @author mengke01(kekee000@gmail.com)
 */

import shape from './Shape';
import dashedLineTo from '../util/dashedLineTo';

export default shape.derive({

    type: 'rect',

    getRect(shape) {
        return shape;
    },

    isIn(shape, x, y) {
        let w = shape.width;
        let h = shape.height;
        return x <= shape.x + w
            && x >= shape.x
            && y <= shape.y + h
            && y >= shape.y;
    },

    draw(ctx, shape) {

        let x = Math.round(shape.x);
        let y = Math.round(shape.y);
        let w = Math.round(shape.width);
        let h = Math.round(shape.height);

        if (shape.dashed) {
            dashedLineTo(ctx, x, y, x + w, y);
            dashedLineTo(ctx, x + w, y, x + w, y + h);
            dashedLineTo(ctx, x + w, y + h, x, y + h);
            dashedLineTo(ctx, x, y + h, x, y);
        }
        else {
            ctx.moveTo(x, y);
            ctx.lineTo(x + w, y);
            ctx.lineTo(x + w, y + h);
            ctx.lineTo(x, y + h);
            ctx.lineTo(x, y);
        }
    }
});

