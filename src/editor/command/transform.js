/**
 * @file shape变换相关命令
 * @author mengke01(kekee000@gmail.com)
 */

import pathsUtil from 'graphics/pathsUtil';

/**
 * 旋转图形
 *
 * @param {Array} shapes 图形集合
 * @param {number} angle 弧度
 * @return {boolean} `false`或者`undefined`
 */
function rotateShapes(shapes, angle) {
    if (!angle) {
        return false;
    }
    let paths = shapes.map(function (shape) {
        return shape.points;
    });

    pathsUtil.rotate(paths, angle);
}


const transform = {

    /**
     * 旋转指定角度
     *
     * @param {Array} shapes 图形集合
     * @param {number} angle 弧度
     * @return {boolean} `false`或者`undefined`
     */
    rotate(shapes, angle) {

        if (!shapes || !shapes.length) {
            return false;
        }

        let ret = rotateShapes(shapes, angle);
        if (false !== ret) {
            this.fontLayer.refresh();
            this.refreshSelected(shapes);
        }
        return ret;
    },

    /**
     * 向左旋转
     *
     * @param {Array} shapes 图形集合
     * @return {boolean} `false`或者`undefined`
     */
    rotateleft(shapes) {
        shapes = shapes || (this.currentGroup && this.currentGroup.shapes);
        return transform.rotate.call(this, shapes, -Math.PI / 2);
    },

    /**
     * 向右旋转
     *
     * @param {Array} shapes 图形集合
     * @return {boolean} `false`或者`undefined`
     */
    rotateright(shapes) {
        shapes = shapes || (this.currentGroup && this.currentGroup.shapes);
        return transform.rotate.call(this, shapes, Math.PI / 2);
    },

    /**
     * 翻转
     *
     * @param {Array} shapes 图形集合
     * @return {boolean} `false`或者`undefined`
     */
    flipshapes(shapes) {
        shapes = shapes || (this.currentGroup && this.currentGroup.shapes);
        if (!shapes || !shapes.length) {
            return false;
        }

        pathsUtil.flip(shapes.map(function (shape) {
            return shape.points;
        }));
        this.fontLayer.refresh();
        this.refreshSelected(shapes);
    },

    /**
     * 镜像
     *
     * @param {Array} shapes 图形集合
     * @return {boolean} `false`或者`undefined`
     */
    mirrorshapes(shapes) {
        debugger;
        shapes = shapes || (this.currentGroup && this.currentGroup.shapes);
        if (!shapes || !shapes.length) {
            return false;
        }

        pathsUtil.mirror(shapes.map(function (shape) {
            return shape.points;
        }));
        this.fontLayer.refresh();
        this.refreshSelected(shapes);
    }
};

export default transform;
