/**
 * @file 形状相关命令
 * @author mengke01(kekee000@gmail.com)
 */

import pathsUtil from 'graphics/pathsUtil';

export default {

    /**
     * 移除shape
     *
     * @param {Array} shapes 形状集合
     */
    removeshapes(shapes) {
        let fontLayer = this.fontLayer;
        shapes.forEach(function (shape) {
            fontLayer.removeShape(shape);
        });
        fontLayer.refresh();
        this.refreshSelected([]);
        this.setMode();
    },

    /**
     * 反转shape
     *
     * @param {Array} shapes 形状集合
     */
    reversepoints(shapes) {
        shapes.forEach(function (shape) {
            shape.points = shape.points.reverse();
        });

        this.fontLayer.refresh();
    },

    /**
     * 设置shape到顶层
     *
     * @param {Array} shape 形状
     */
    topshape(shape) {
        let index = this.fontLayer.shapes.indexOf(shape);
        this.fontLayer.shapes.splice(index, 1);
        this.fontLayer.shapes.push(shape);
    },

    /**
     * 设置shape到底层
     *
     * @param {Array} shape 形状
     */
    bottomshape(shape) {
        let index = this.fontLayer.shapes.indexOf(shape);
        this.fontLayer.shapes.splice(index, 1);
        this.fontLayer.shapes.unshift(shape);
    },

    /**
     * 提升shape层级
     *
     * @param {Array} shape 形状
     */
    upshape(shape) {
        let index = this.fontLayer.shapes.indexOf(shape);
        this.fontLayer.shapes.splice(index, 1);
        this.fontLayer.shapes.splice(index + 1, 0, shape);
    },

    /**
     * 降低shape层级
     *
     * @param {Array} shape 形状
     */
    downshape(shape) {
        let index = this.fontLayer.shapes.indexOf(shape);
        this.fontLayer.shapes.splice(index, 1);
        this.fontLayer.shapes.splice(index - 1, 0, shape);
    },

    /**
     * 剪切shapes
     *
     * @param {Array} shapes 形状集合
     */
    cutshapes(shapes) {
        let cutedShapes = this.getShapes(shapes);
        this.setClipBoard(cutedShapes);
        let fontLayer = this.fontLayer;
        shapes.forEach(function (shape) {
            fontLayer.removeShape(shape);
        });
        fontLayer.refresh();
        this.refreshSelected([]);
    },

    /**
     * 复制shapes
     *
     * @param {Array} shapes 形状集合
     */
    copyshapes(shapes) {
        shapes = this.getShapes(shapes);
        this.setClipBoard(shapes);
    },

    /**
     * 粘贴shapes
     *
     * @param {Array} shapes 形状集合
     * @param {Object=} pos 指定的位置
     * @return {boolean} `false`或者`undefined`
     */
    pasteshapes(shapes, pos) {

        if (!shapes || !shapes.length) {
            return false;
        }

        if (pos) {
            let paths = shapes.map(function (shape) {
                return shape.points;
            });
            // 需要根据坐标原点以及缩放换算成鼠标位置移动
            let origin = this.axis;
            let scale = this.render.camera.scale;
            let x = (pos.x - origin.x) / scale;
            let y = (origin.y - pos.y) / scale;

            pathsUtil.move(paths, x, y);
        }


        this.addShapes(shapes);
        this.setMode('shapes', shapes);
    },

    /**
     * 增加shapes
     *
     * @param {Array} shapes 形状集合
     * @param {boolean} selected 是否选中
     */
    addshapes(shapes, selected) {
        this.addShapes(shapes);
        selected && this.setSelected(shapes);
    },

    /**
     * 增加轮廓
     *
     * @param {Array} contours 轮廓集合
     * @param {Object} options 选项
     * @param {number} scale 缩放级别
     * @param {boolean} selected 是否选中
     */
    addcontours(contours, options = {}) {
        // 是否翻转图像
        if (options.flip) {
            pathsUtil.flip(contours);
        }

        if (options.mirror) {
            pathsUtil.mirror(contours);
        }

        let shapes = this.addContours(contours, options.scale);

        options.selected && this.setSelected(shapes);
    }
};
