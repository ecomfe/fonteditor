/**
 * @file 简单字形绘制
 * @author mengke01(kekee000@gmail.com)
 */

import shape from './Shape';
import drawPath from '../util/drawPath';

export default shape.derive({

    type: 'glyf',

    adjust(shape, camera) {
        let center = camera.center;
        let ratio = camera.ratio;

        shape.x = ratio * (shape.x - center.x) + center.x;
        shape.y = ratio * (shape.y - center.y) + center.y;

        return shape;

    },

    move(shape, mx, my) {
        shape.x += mx;
        shape.y += my;

        return shape;
    },

    getRect(shape) {
        return false;
    },

    isIn(shape, x, y) {
        return false;
    },

    draw(ctx, shape, camera) {

        ctx.save();
        ctx.translate(shape.x, shape.y);
        ctx.scale(camera.scale, -camera.scale);

        let transform = shape.transform;
        ctx.transform(
            transform.a,
            transform.b,
            transform.c,
            transform.d,
            transform.e,
            transform.f
        );

        let contours = shape.glyf.contours;
        for (let i = 0, l = contours.length; i < l; i++) {
            drawPath(ctx, contours[i]);
        }

        ctx.restore();
    }
});
