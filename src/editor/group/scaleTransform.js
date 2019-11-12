/**
 * @file 缩放变换
 * @author mengke01(kekee000@gmail.com)
 */

import getScaleMatrix from './getScaleMatrix';
import pathAdjust from 'graphics/pathAdjust';
import lang from 'common/lang';
const scalePoints = [1, 2, 3, 4];

/**
 * 缩放变换
 *
 * @param {Object} point 参考点
 * @param {Camera} camera 镜头对象
 */
export default function scaleTransform(point, camera) {

    let matrix = getScaleMatrix(point.pos, this.bound, camera);
    // 默认等比缩放
    if (scalePoints.indexOf(point.pos) >= 0) {
        if (!camera.event.shiftKey) {
            let scale = Math.max(Math.abs(matrix[2]), Math.abs(matrix[3]));
            matrix[2] = matrix[2] >= 0 ? scale : -scale;
            matrix[3] = matrix[3] >= 0 ? scale : -scale;
        }
    }

    // 更新shape
    let shapes = this.shapes;

    this.coverShapes.forEach(function (coverShape, index) {

        let shape = lang.clone(shapes[index]);
        pathAdjust(shape.points, matrix[2], matrix[3], -matrix[0], -matrix[1]);
        pathAdjust(shape.points, 1, 1, matrix[0], matrix[1]);

        if (matrix[2] < 0 && matrix[3] >= 0) {
            shape.points = shape.points.reverse();
        }

        if (matrix[3] < 0 && matrix[2] >= 0) {
            shape.points = shape.points.reverse();
        }

        Object.assign(coverShape, shape);
    });

    // 更新边界
    let coverLayer = this.editor.coverLayer;
    let boundShape = coverLayer.getShape('bound');
    let bound = this.bound;
    let points = pathAdjust(
        [
            {x: bound.x, y: bound.y},
            {x: bound.x + bound.width, y: bound.y},
            {x: bound.x + bound.width, y: bound.y + bound.height},
            {x: bound.x, y: bound.y + bound.height}
        ],
        matrix[2], matrix[3], -matrix[0], -matrix[1]
    );
    pathAdjust(points, 1, 1, matrix[0], matrix[1]);
    boundShape.points = points;

}
