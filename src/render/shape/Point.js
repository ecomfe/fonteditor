/**
 * @file 点绘制
 * @author mengke01(kekee000@gmail.com)
 */

import shape from './Shape';
const POINT_SIZE = 6; // 控制点的大小

export default shape.derive({

    type: 'point',

    getRect(shape) {
        let size = shape.size || POINT_SIZE;
        return {
            x: shape.x - size / 2,
            y: shape.y - size / 2,
            width: size,
            height: size
        };
    },

    isIn(shape, x, y) {
        let size = shape.size || POINT_SIZE;
        let w = size;
        let h = size;
        return x <= shape.x + w
            && x >= shape.x - w
            && y <= shape.y + h
            && y >= shape.y - h;
    },

    draw(ctx, shape) {

        let x = Math.round(shape.x);
        let y = Math.round(shape.y);
        let size = shape.size || POINT_SIZE;
        let w = size / 2;
        let h = size / 2;
        ctx.moveTo(x - w, y - h);
        ctx.lineTo(x + w, y - h);
        ctx.lineTo(x + w, y + h);
        ctx.lineTo(x - w, y + h);
        ctx.lineTo(x - w, y - h);
    }
});
