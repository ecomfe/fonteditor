/**
 * @file 轮廓拟合处理类
 * @author mengke01(kekee000@gmail.com)
 */

import findContours from './contour/findContours';
import findBreakPoints from './contour/findBreakPoints';
import fitContour from './contour/fitContour';
import pathUtil from '../pathUtil';
import reducePoints from './contour/douglasPeuckerReducePoints';

export default class Processor {

    /**
     * 轮廓点集合
     *
     * @param {Array} contourPoints 轮廓点集合
     * @param {?Object} options 参数
     * @param {number} options.scale 缩放级别
     * @param {boolean} options.segment 是否线段
     */
    constructor(contourPoints, options = {}) {
        this.scale = options.scale || 2;
        this.segment = options.segment || false;
        contourPoints && this.set(contourPoints);
    }

    /**
     * 从二值图像中导入轮廓点集
     *
     * @param  {Object} imageData 图像数据
     */
    import(imageData) {
        let contourPoints = findContours(imageData);
        this.set(contourPoints);
    }

    /**
     * 设置轮廓点集
     *
     * @param {Array} contourPoints 轮廓点集
     */
    set(contourPoints = []) {
        let scale = this.scale;
        contourPoints.forEach(function (points) {
            pathUtil.scale(points, scale);
        });
        this.contourPoints = contourPoints;
    }

    /**
     * 获取轮廓点集
     *
     * @return {Array} 轮廓点集
     */
    get() {
        let scale = 1 / this.scale;
        return this.contourPoints.map(function (points) {
            return pathUtil.scale(pathUtil.clone(points), scale);
        });
    }


    /**
     * 获取关键点数组
     *
     * @param {number} index 指定轮廓的关键点数组索引号
     * @return {Array} 关键点数组
     */
    getBreakPoints(index) {
        let scale = this.scale;
        let breakPoints = [];
        let contourPoints = index >= 0 ? [this.contourPoints[index]] : this.contourPoints;
        contourPoints.forEach(function (points) {
            let reducedData = reducePoints(points, 0, points.length - 1, scale);
            breakPoints = breakPoints.concat(findBreakPoints(pathUtil.clone(reducedData), scale));
        });
        return pathUtil.scale(breakPoints, 1 / this.scale);
    }

    /**
     * 获取拟合后的轮廓数组
     *
     * @return {Array}
     */
    getContours() {
        let scale = this.scale;
        let segment = this.segment;
        return this.contourPoints.map(function (points) {
            return fitContour(pathUtil.clone(points), scale, {
                segment
            });
        }).filter(function (contour) {
            return contour && contour.length > 2;
        }).map(function (contour) {
            return pathUtil.scale(contour, 1 / scale);
        });
    }

    dispose() {
        this.contourPoints = null;
    }
}

