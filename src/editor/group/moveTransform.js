/**
 * @file 平移变换
 * @author mengke01(kekee000@gmail.com)
 */

import lang from 'common/lang';
import pathAdjust from 'graphics/pathAdjust';

/**
 * 移动对象
 *
 * @param {Object} camera 镜头对象
 * @param {boolean} fixX 固定X
 * @param {boolean} fixY 固定Y
 * @param {boolean} enableSorption 是否吸附
 */
export default function moveTransform(camera, fixX, fixY, enableSorption) {

    let x = fixX ? 0 : (camera.x - camera.startX);
    let y = fixY ? 0 : (camera.y - camera.startY);

    // 更新shape
    let shapes = this.shapes;
    let bound = this.bound;

    let coverLayer = this.editor.coverLayer;
    let boundShape = coverLayer.getShape('bound');

    // 吸附选项
    if (enableSorption) {
        let centerX = bound.x + bound.width / 2;
        let centerY = bound.y + bound.height / 2;
        let sorptionColor = this.editor.options.sorption.sorptionColor;
        let i;
        let result;

        if (!fixX) {

            // 设置吸附辅助线
            let sorptionShapeX = coverLayer.getShape('sorptionX');
            if (!sorptionShapeX) {
                sorptionShapeX = coverLayer.addShape({
                    type: 'line',
                    id: 'sorptionX',
                    style: {
                        strokeColor: sorptionColor
                    },
                    p0: {},
                    p1: {}
                });
            }

            let posXList = [this.bound.x, centerX, this.bound.x + this.bound.width];
            for (i = 0; i < 3; i++) {
                result = this.editor.sorption.detectX(posXList[i] + x);
                if (result) {
                    x = result.axis - posXList[i];
                    sorptionShapeX.p0.x = sorptionShapeX.p1.x = result.axis;
                    sorptionShapeX.p0.y = centerY + y;
                    sorptionShapeX.p1.y = result.y;
                    sorptionShapeX.disabled = false;
                    break;
                }
            }

            if (i === 3) {
                sorptionShapeX.disabled = true;
            }
        }

        if (!fixY) {

            // 设置吸附辅助线
            let sorptionShapeY = coverLayer.getShape('sorptionY');
            if (!sorptionShapeY) {
                sorptionShapeY = coverLayer.addShape({
                    type: 'line',
                    id: 'sorptionY',
                    style: {
                        strokeColor: sorptionColor
                    },
                    p0: {},
                    p1: {}
                });
            }

            let posYList = [this.bound.y, centerY, this.bound.y + this.bound.height];
            for (i = 0; i < 3; i++) {
                result = this.editor.sorption.detectY(posYList[i] + y);
                if (result) {
                    y = result.axis - posYList[i];
                    sorptionShapeY.p0.x = centerX + x;
                    sorptionShapeY.p1.x = result.x;
                    sorptionShapeY.p0.y = sorptionShapeY.p1.y = result.axis;
                    sorptionShapeY.disabled = false;
                    break;
                }
            }

            if (i === 3) {
                sorptionShapeY.disabled = true;
            }
        }

    }

    this.coverShapes.forEach(function (coverShape, index) {
        let shape = lang.clone(shapes[index]);
        pathAdjust(shape.points, 1, 1, x, y);
        Object.assign(coverShape, shape);

    });

    // 更新边界
    boundShape.points = pathAdjust(
        [
            {x: bound.x, y: bound.y},
            {x: bound.x + bound.width, y: bound.y},
            {x: bound.x + bound.width, y: bound.y + bound.height},
            {x: bound.x, y: bound.y + bound.height}
        ],
        1, 1, x, y
    );
}
