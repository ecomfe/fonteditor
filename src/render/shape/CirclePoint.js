/**
 * @file 圆形点绘制
 * @author mengke01(kekee000@gmail.com)
 */

import shape from './Shape';
const POINT_SIZE = 2;

export default shape.derive({

    type: 'cpoint',

    getRect(shape) {
        let size = shape.size || POINT_SIZE;
        return {
            x: shape.x - size,
            y: shape.y - size,
            width: 2 * size,
            height: 2 * size
        };
    },

    isIn(shape, x, y) {
        let size = shape.size || POINT_SIZE;
        return Math.pow(shape.x - x, 2) + Math.pow(shape.y - y, 2) <= Math.pow(size * 2, 2);
    },

    draw(ctx, shape) {
        let size = shape.size || POINT_SIZE;
        let x = Math.round(shape.x);
        let y = Math.round(shape.y);

        ctx.moveTo(x + size, y);
        ctx.arc(x, y, size, 0, Math.PI * 2, true);
    }
});
