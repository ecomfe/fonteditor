/**
 * @file font格式字体绘制
 * @author mengke01(kekee000@gmail.com)
 */

import shape from './Shape';
import isInsidePath from 'graphics/isInsidePath';
import pathAdjust from 'graphics/pathAdjust';
import drawPath from '../util/drawPath';
import computeBoundingBox from 'graphics/computeBoundingBox';

export default shape.derive({

    type: 'font',

    adjust(shape, camera) {
        let ratio = camera.ratio;
        let x = camera.center.x;
        let y = camera.center.y;
        let contours = shape.contours;
        for (let i = 0, l = contours.length; i < l; i++) {
            pathAdjust(contours[i], ratio, ratio, -x, -y);
            pathAdjust(contours[i], 1, 1, x, y);
        }

        return shape;

    },

    move(shape, mx, my) {
        let contours = shape.contours;
        for (let i = 0, l = contours.length; i < l; i++) {
            pathAdjust(contours[i], 1, 1, mx, my);
        }
        return shape;
    },

    getRect(shape) {
        return computeBoundingBox.computePath.apply(null, shape.contours);
    },

    isIn(shape, x, y) {
        let bound = computeBoundingBox.computePath.apply(null, shape.contours);
        if (
            x <= bound.x + bound.width
            && x >= bound.x
            && y <= bound.y + bound.height
            && y >= bound.y
        ) {
            let contours = shape.contours;
            for (let i = 0, l = contours.length; i < l; i++) {
                if (isInsidePath(contours[i], {
                    x,
                    y
                })) {
                    return true;
                }
            }
        }
        return false;
    },

    draw(ctx, shape) {
        let contours = shape.contours;
        for (let i = 0, l = contours.length; i < l; i++) {
            drawPath(ctx, contours[i]);
        }
    }
});
