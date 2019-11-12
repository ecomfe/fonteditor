/**
 * @file 旋转变换
 * @author mengke01(kekee000@gmail.com)
 */

import getRotateMatrix from './getRotateMatrix';
import pathRotate from 'graphics/pathRotate';
import pathSkew from 'graphics/pathSkew';
import lang from 'common/lang';

/**
 * 旋转变换
 *
 * @param {Object} point 参考点
 * @param {Camera} camera 镜头对象
 */
export default function rotateTransform(point, camera) {

    let matrix = getRotateMatrix(point.pos, this.bound, camera);

    let transformer = point.pos <= 4 ? pathRotate : pathSkew;

    // 更新shape
    let shapes = this.shapes;

    this.coverShapes.forEach(function (coverShape, index) {
        let shape = lang.clone(shapes[index]);
        transformer(shape.points, matrix[2], matrix[0], matrix[1]);
        Object.assign(coverShape, shape);

    });


    // 更新边界
    let coverLayer = this.editor.coverLayer;
    let boundShape = coverLayer.getShape('bound');
    let bound = this.bound;
    boundShape.points = transformer(
        [
            {x: bound.x, y: bound.y},
            {x: bound.x + bound.width, y: bound.y},
            {x: bound.x + bound.width, y: bound.y + bound.height},
            {x: bound.x, y: bound.y + bound.height}
        ],
        matrix[2], matrix[0], matrix[1]
    );

    // 更新中心点
    let boundCenter = coverLayer.getShape('boundcenter');
    if (!boundCenter) {
        boundCenter = {
            type: 'cpoint',
            id: 'boundcenter',
            x: bound.x + bound.width / 2,
            y: bound.y + bound.height / 2
        };
        coverLayer.addShape(boundCenter);
    }
    boundCenter.x = (boundShape.points[0].x + boundShape.points[2].x) / 2;
    boundCenter.y = (boundShape.points[0].y + boundShape.points[2].y) / 2;

}
