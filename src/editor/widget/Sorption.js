/**
 * @file 智能吸附组件
 * @author mengke01(kekee000@gmail.com)
 */

import computeBoundingBox from 'graphics/computeBoundingBox';

/**
 * 二分查找
 *
 * @param {Array} arr 查找数组
 * @param {number} val 值
 * @param {number} delta 误差范围
 * @return {Object|false} 找到的点或者false
 */
function binaryFind(arr, val, delta) {
    let l = 0;
    let r = arr.length - 1;
    let mid;
    let axis;

    while (l <= r) {
        mid = (l + r) >> 1;
        axis = arr[mid].axis;

        if (Math.abs(val - axis) < delta) {
            return arr[mid];
        }
        else if (val < axis) {
            r = mid - 1;
        }
        else {
            l = mid + 1;
        }
    }

    return false;
}

export default class Sorption {

    /**
     * 智能吸附组件
     *
     * @constructor
     * @param {Object} options 参数选项
     * @param {number} options.gridDelta 吸附网格 offset
     * @param {number} options.delta 吸附对象 offset
     * @param {boolean} options.enableGrid 是否网格吸附
     * @param {boolean} options.enableShape 是否对象吸附
     */
    constructor(options) {
        this.gridDelta = options.gridDelta || 5; // 吸附网格 offset
        this.delta = options.delta || 5; // 吸附对象 offset
        this.enableGrid = options.enableGrid || false;
        this.enableShape = options.enableShape || true;
        this.xAxis = [];
        this.yAxis = [];
    }

    /**
     * 设置吸附的网格参数
     *
     * @param {Object} axis 坐标参数
     */
    setGrid(axis) {
        this.axis = axis;
    }


    /**
     * 设置吸附的对象
     *
     * @param {Array} shapes 对象数组
     */
    addShapes(shapes) {
        let xAxis = this.xAxis;
        let yAxis = this.yAxis;

        for (let i = shapes.length - 1; i >= 0; i--) {
            let box = computeBoundingBox.computePath(shapes[i].points);
            let cx = box.x + box.width / 2;
            let cy = box.y + box.height / 2;

            xAxis.push({
                axis: box.x,
                y: cy
            });
            xAxis.push({
                axis: cx,
                y: cy
            });
            xAxis.push({
                axis: box.x + box.width,
                y: cy
            });

            yAxis.push({
                axis: box.y,
                x: cx
            });
            yAxis.push({
                axis: cy,
                x: cx
            });
            yAxis.push({
                axis: box.y + box.height,
                x: cx
            });

        }

        xAxis.sort(function (a, b) {
            return a.axis - b.axis;
        });

        yAxis.sort(function (a, b) {
            return a.axis - b.axis;
        });
    }

    /**
     * 设置x轴吸附
     *
     * @param {Array.<number>} xAxisArray x轴坐标集合
     */
    addXAxis(xAxisArray) {
        let xAxis = this.xAxis;
        xAxisArray.forEach(function (x) {
            xAxis.push({
                axis: x,
                y: 0
            });
        });
        xAxis.sort(function (a, b) {
            return a.axis - b.axis;
        });
    }

    /**
     * 设置y轴吸附
     *
     * @param {Array.<number>} yAxisArray y轴坐标集合
     */
    addYAxis(yAxisArray) {
        let yAxis = this.yAxis;
        yAxisArray.forEach(function (y) {
            yAxis.push({
                axis: y,
                x: 0
            });
        });
        yAxis.sort(function (a, b) {
            return a.axis - b.axis;
        });
    }

    /**
     * 检查x轴是否有可用的吸附
     *
     * @param {number} x x坐标
     * @return {number|boolean} 吸附的坐标或者`false`
     */
    detectX(x) {

        // 检测是否有吸附的对象
        if (this.enableShape) {
            let result = binaryFind(this.xAxis, x, this.delta);
            if (result) {
                return result;
            }
        }


        if (this.enableGrid) {
            let delta = (x - this.axis.x) % this.axis.gap;
            if (Math.abs(delta) < this.gridDelta) {
                return {
                    axis: x - delta,
                    y: 0
                };
            }
        }

        return false;
    }

    /**
     * 检查y轴是否有可用的吸附
     *
     * @param {number} y y坐标
     * @return {number|boolean} 吸附的坐标或者`false`
     */
    detectY(y) {
        // 检测是否有吸附的对象
        if (this.enableShape) {
            let result = binaryFind(this.yAxis, y, this.delta);
            if (result) {
                return result;
            }
        }

        if (this.enableGrid) {
            let delta = (y - this.axis.y) % this.axis.gap;
            if (Math.abs(delta) < this.gridDelta) {
                return {
                    axis: y - delta,
                    x: 0
                };
            }
        }

        return false;
    }

    /**
     * 是否吸附可用
     *
     * @return {boolean}
     */
    isEnable() {
        return this.enableShape || this.enableGrid;
    }

    /**
     * 清除缓存坐标
     */
    clear() {
        this.xAxis.length = 0;
        this.yAxis.length = 0;
    }

    /**
     * 注销
     */
    dispose() {
        this.clear();
        this.axis = null;
        this.xAxis = this.yAxis = null;
    }

}
