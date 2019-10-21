/**
 * @file 轮廓合并操作
 * @author mengke01(kekee000@gmail.com)
 */

import pathBoolean from 'graphics/pathBoolean';
import lang from 'common/lang';
import pathSplitBySegment from 'graphics/pathSplitBySegment';
import computeBoundingBox from 'graphics/computeBoundingBox';
import isBoundingBoxSegmentCross from 'graphics/isBoundingBoxSegmentCross';

function combineShape(shapes, relation) {

    let pathList = shapes.map(function (path) {
        return path.points;
    });

    let result = pathBoolean(pathList, relation);
    let i;
    let l;

    // 检查有shapes没有改变过
    let changed = false;

    if (result.length === pathList.length) {
        for (i = 0, l = result.length; i < l; i++) {
            if (result[i] !== pathList[i]) {
                changed = true;
                break;
            }
        }
    }
    else {
        changed = true;
    }

    // 有改变则更新节点集合
    if (changed) {

        let fontLayer = this.fontLayer;
        let resultLength = result.length;
        let shapesLength = shapes.length;
        let length = Math.min(resultLength, shapesLength);

        // 替换原来位置的
        for (i = 0; i < length; i++) {
            shapes[i].points = lang.clone(result[i]);
        }

        // 移除多余的
        if (shapesLength > length) {
            for (i = length; i < shapesLength; i++) {
                fontLayer.removeShape(shapes[i]);
            }
            shapes.splice(length, shapesLength - length);
        }

        // 添加新的shape
        if (resultLength > length) {
            for (i = length; i < resultLength; i++) {
                let shape = fontLayer.addShape('path', {
                    points: result[i]
                });
                shapes.push(shape);
            }
        }

        fontLayer.refresh();
    }

    return shapes;
}

export default {

    /**
     * 结合
     *
     * @param {Array} shapes 路径对象数组
     */
    joinshapes(shapes) {
        combineShape.call(this, shapes, pathBoolean.Relation.join);
        this.refreshSelected(shapes);
    },

    /**
     * 相交
     *
     * @param {Array} shapes 路径对象数组
     */
    intersectshapes(shapes) {
        combineShape.call(this, shapes, pathBoolean.Relation.intersect);
        this.refreshSelected(shapes);
    },

    /**
     * 相切
     *
     * @param {Array} shapes 路径对象数组
     */
    tangencyshapes(shapes) {
        combineShape.call(this, shapes, pathBoolean.Relation.tangency);
        this.refreshSelected(shapes);
    },

    /**
     * 切割路径
     *
     * @param {Object} p0 p0
     * @param {Object} p1 p1
     * @return {boolean} `false`或者`undefined`
     */
    splitshapes(p0, p1) {
        let shapes = this.fontLayer.shapes;
        let shapesCross = [];
        let i;
        let l;
        for (i = 0, l = shapes.length; i < l; i++) {
            let bound = computeBoundingBox.computePath(shapes[i].points);
            // 判断是否相交
            if (isBoundingBoxSegmentCross(bound, p0, p1)) {
                shapesCross.push(shapes[i]);
            }
        }

        if (shapesCross.length) {
            let outShapes = pathSplitBySegment(shapesCross.map(function (shape) {
                return shape.points;
            }), p0, p1);

            if (outShapes.length) {

                let fontLayer = this.fontLayer;

                // 替换原来位置的
                for (i = 0, l = shapesCross.length; i < l; i++) {
                    shapesCross[i].points = lang.clone(outShapes[i]);
                }

                // 添加新的shape
                if (outShapes.length > shapesCross.length) {
                    for (i = shapesCross.length, l = outShapes.length; i < l; i++) {
                        let shape = fontLayer.addShape('path', {
                            points: outShapes[i]
                        });
                        shapesCross.push(shape);
                    }
                }

                fontLayer.refresh();
                this.setMode('shapes', shapesCross);
            }

            return true;
        }

        return false;
    }
};
