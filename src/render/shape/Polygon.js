/**
 * @file 多边形绘制
 * @author mengke01(kekee000@gmail.com)
 */

import shape from './Shape';
import dashedLineTo from '../util/dashedLineTo';
import pathAdjust from 'graphics/pathAdjust';
import computeBoundingBox from 'graphics/computeBoundingBox';
import isInsidePolygon from 'graphics/isInsidePolygon';

export default shape.derive({

    type: 'polygon',

    adjust(shape, camera) {
        let ratio = camera.ratio;
        let x = camera.center.x;
        let y = camera.center.y;
        pathAdjust(shape.points, ratio, ratio, -x, -y);
        pathAdjust(shape.points, 1, 1, x, y);
    },

    move(shape, mx, my) {
        pathAdjust(shape.points, 1, 1, mx, my);
        return shape;
    },

    getRect(shape) {
        return computeBoundingBox.computeBounding(shape.points);
    },

    isIn(shape, x, y) {
        let bound = computeBoundingBox.computeBounding(shape.points);
        if (
            x <= bound.x + bound.width
            && x >= bound.x
            && y <= bound.y + bound.height
            && y >= bound.y
        ) {

            return isInsidePolygon(shape.points, {
                x,
                y
            });
        }
        return false;
    },

    draw(ctx, shape) {

        let points = shape.points;
        if (!points || points.length < 2) {
            return;
        }

        let i = 0;
        let l = points.length;
        if (shape.dashed) {
            for (; i < l - 1; i++) {
                dashedLineTo(ctx,
                    Math.round(points[i].x), Math.round(points[i].y),
                    Math.round(points[i + 1].x), Math.round(points[i + 1].y)
                );
            }
            dashedLineTo(ctx,
                Math.round(points[l - 1].x), Math.round(points[l - 1].y),
                Math.round(points[0].x), Math.round(points[0].y)
            );
        }
        else {

            ctx.moveTo(Math.round(points[0].x), Math.round(points[0].y));
            for (i = 1; i < l; i++) {
                ctx.lineTo(
                    Math.round(points[i].x), Math.round(points[i].y)
                );
            }
            ctx.lineTo(
                Math.round(points[0].x), Math.round(points[0].y)
            );
        }

    }
});
