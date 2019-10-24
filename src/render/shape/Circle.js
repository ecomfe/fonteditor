/**
 * @file 圆绘制
 * @author mengke01(kekee000@gmail.com)
 */
import shape from './Shape';

export default shape.derive({

    type: 'circle',

    getRect(shape) {
        return {
            x: shape.x - shape.r,
            y: shape.y - shape.r,
            width: 2 * shape.r,
            height: 2 * shape.r
        };
    },

    isIn(shape, x, y) {
        return Math.pow(shape.x - x, 2) + Math.pow(shape.y - y, 2) <= Math.pow(shape.r, 2);
    },


    draw(ctx, shape) {
        ctx.moveTo(shape.x + shape.r, shape.y);
        ctx.arc(shape.x, shape.y, shape.r, 0, Math.PI * 2, true);
    }
});
