/**
 * @file 坐标轴绘制
 * @author mengke01(kekee000@gmail.com)
 */
import shape from './Shape';
import drawAxis from '../util/drawAxis';

export default shape.derive({

    type: 'axis',

    adjust(shape, camera) {
        let center = camera.center;
        let ratio = camera.ratio;

        shape.unitsPerEm *= ratio;

        let metrics = shape.metrics;
        Object.keys(metrics).forEach(function (line) {
            metrics[line] *= ratio;
        });

        shape.x = ratio * (shape.x - center.x) + center.x;
        shape.y = ratio * (shape.y - center.y) + center.y;

        return shape;
    },

    isIn(shape, x, y) {
        return false;
    },

    getBound(shape) {
        return {
            x: shape.x,
            y: shape.y,
            width: 0,
            height: 0
        };
    },

    draw(ctx, shape, camera) {
        shape.scale = camera.scale;
        ctx.save();
        drawAxis(ctx, shape);
        ctx.restore();
        ctx.beginPath();
    }
});
