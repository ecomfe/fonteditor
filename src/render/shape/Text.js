/**
 * @file 文本节点绘制
 * @author mengke01(kekee000@gmail.com)
 */

import shape from './Shape';

export default shape.derive({

    type: 'text',

    getRect(shape) {
        return false;
    },

    isIn(shape, x, y) {
        return false;
    },

    draw(ctx, shape) {
        ctx.save();
        let x = Math.round(shape.x);
        let y = Math.round(shape.y);
        if (shape.fillColor) {
            ctx.fillStyle = shape.fillColor;
        }
        ctx.fillText(shape.text, x, y);
        ctx.restore();
    }
});
