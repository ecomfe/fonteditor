/**
 * @file 刻度线绘制
 * @author mengke01(kekee000@gmail.com)
 */

import shape from './Shape';
import drawGraduation from '../util/drawGraduation';

export default shape.derive({

    type: 'graduation',

    adjust(shape, camera) {
        return shape;
    },

    isIn(shape, x, y) {
        return false;
    },

    draw(ctx, shape, camera) {

        shape.scale = camera.scale;
        ctx.save();
        // 绘制刻度线
        drawGraduation(ctx, shape.config);
        ctx.restore();
        ctx.beginPath();
    }
});
