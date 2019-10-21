/**
 * @file 轮廓对齐命令
 * @author mengke01(kekee000@gmail.com)
 */

import computeBoundingBox from 'graphics/computeBoundingBox';
import pathAdjust from 'graphics/pathAdjust';

export default {

    /**
     * 对齐方式
     *
     * @param {Array} shapes 形状集合
     * @param {string} align 对齐方式
     * @return {boolean} `false`或者`undefined`
     */
    alignshapes(shapes, align) {
        shapes = shapes || (this.currentGroup && this.currentGroup.shapes);
        if (!shapes || !shapes.length) {
            return false;
        }

        let contours = shapes.map(function (shape) {
            return shape.points;
        });

        // 求边界线
        let bound = computeBoundingBox.computePath.apply(null, contours);
        bound.x1 = bound.x + bound.width;
        bound.y1 = bound.y + bound.height;
        bound.xc = bound.x + bound.width / 2;
        bound.yc = bound.y + bound.height / 2;

        let xOffset;
        let yOffset;
        contours.forEach(function (contour) {
            let b = computeBoundingBox.computePath(contour);
            xOffset = 0;
            yOffset = 0;

            if ('left' === align) {
                xOffset = bound.x - b.x;
            }
            else if ('center' === align) {
                xOffset = bound.xc - b.x - b.width / 2;
            }
            else if ('right' === align) {
                xOffset = bound.x1 - b.x - b.width;
            }
            else if ('top' === align) {
                yOffset = bound.y - b.y;
            }
            else if ('middle' === align) {
                yOffset = bound.yc - b.y - b.height / 2;
            }
            else if ('bottom' === align) {
                yOffset = bound.y1 - b.y - b.height;
            }
            pathAdjust(contour, 1, 1, xOffset, yOffset);
        });

        this.fontLayer.refresh();
        this.refreshSelected(shapes);
    },

    /**
     * 字体垂直对齐
     *
     * @param {Array} shapes 形状集合
     * @param {string} align 对齐方式
     * @return {boolean} `false`或者`undefined`
     */
    verticalalignshapes(shapes, align) {
        shapes = shapes || (this.currentGroup && this.currentGroup.shapes);
        if (!shapes || !shapes.length) {
            return false;
        }

        let contours = shapes.map(function (shape) {
            return shape.points;
        });

        let metrics = this.axis.metrics;
        let ybaseline = this.axis.y; // 基线
        let yascent = ybaseline - metrics.ascent; // 上升
        let ydescent = ybaseline - metrics.descent; // 下降
        let ymiddle = (yascent + ydescent) / 2; // 中间

        // 求边界线
        let bound = computeBoundingBox.computePath.apply(null, contours);
        let yOffset = 0;

        if ('ascent' === align) {
            yOffset = yascent - bound.y;
        }
        else if ('middle' === align) {
            yOffset = ymiddle - bound.y - bound.height / 2;
        }
        else if ('descent' === align) {
            yOffset = ydescent - bound.y - bound.height;
        }
        else if ('baseline' === align) {
            yOffset = ybaseline - bound.y - bound.height;
        }

        contours.forEach(function (contour) {
            pathAdjust(contour, 1, 1, 0, yOffset);
        });

        this.fontLayer.refresh();
        this.refreshSelected(shapes);
    },

    /**
     * 字体水平对齐
     *
     * @param {Array} shapes 形状集合
     * @param {string} align 对齐方式
     * @return {boolean} `false`或者`undefined`
     */
    horizontalalignshapes(shapes, align) {
        shapes = shapes || (this.currentGroup && this.currentGroup.shapes);
        if (!shapes || !shapes.length) {
            return false;
        }

        let contours = shapes.map(function (shape) {
            return shape.points;
        });

        let xbaseline = this.axis.x; // 基线
        let rightSideBearing = this.rightSideBearing.p0.x;

        // 求边界线
        let bound = computeBoundingBox.computePath.apply(null, contours);
        let xOffset = 0;

        if ('left' === align) {
            xOffset = xbaseline - bound.x;
        }
        else if ('center' === align) {
            xOffset = (xbaseline + rightSideBearing) / 2 - bound.x - bound.width / 2;
        }
        else if ('right' === align) {
            xOffset = rightSideBearing - bound.x - bound.width;
        }

        contours.forEach(function (contour) {
            pathAdjust(contour, 1, 1, xOffset, 0);
        });

        this.fontLayer.refresh();
        this.refreshSelected(shapes);
    }

};
