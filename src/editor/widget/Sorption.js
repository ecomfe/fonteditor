/**
 * @file 智能吸附组件
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {

        var computeBoundingBox = require('graphics/computeBoundingBox');

        /**
         * 二分查找
         *
         * @param {Array} arr 查找数组
         * @param {number} val 值
         * @param {number} delta 误差范围
         * @return {Object|false} 找到的点或者false
         */
        function binaryFind(arr, val, delta) {
            var l = 0;
            var r = arr.length - 1;
            var mid;
            var axis;

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
        function Sorption(options) {
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
        Sorption.prototype.setGrid = function (axis) {
            this.axis = axis;
        };


        /**
         * 设置吸附的对象
         *
         * @param {Array} shapes 对象数组
         */
        Sorption.prototype.addShapes = function (shapes) {
            var xAxis = this.xAxis;
            var yAxis = this.yAxis;

            for (var i = shapes.length - 1; i >= 0; i--) {
                var box = computeBoundingBox.computePath(shapes[i].points);
                var cx = box.x + box.width / 2;
                var cy = box.y + box.height / 2;

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
        };

        /**
         * 设置x轴吸附
         *
         * @param {Array.<number>} xAxisArray x轴坐标集合
         */
        Sorption.prototype.addXAxis = function (xAxisArray) {
            var xAxis = this.xAxis;
            xAxisArray.forEach(function (x) {
                xAxis.push({
                    axis: x,
                    y: 0
                });
            });
            xAxis.sort(function (a, b) {
                return a.axis - b.axis;
            });
        };

        /**
         * 设置y轴吸附
         *
         * @param {Array.<number>} yAxisArray y轴坐标集合
         */
        Sorption.prototype.addYAxis = function (yAxisArray) {
            var yAxis = this.yAxis;
            yAxisArray.forEach(function (y) {
                yAxis.push({
                    axis: y,
                    x: 0
                });
            });
            yAxis.sort(function (a, b) {
                return a.axis - b.axis;
            });
        };

        /**
         * 检查x轴是否有可用的吸附
         *
         * @param {number} x x坐标
         * @return {number|boolean} 吸附的坐标或者`false`
         */
        Sorption.prototype.detectX = function (x) {

            // 检测是否有吸附的对象
            if (this.enableShape) {
                var result = binaryFind(this.xAxis, x, this.delta);
                if (result) {
                    return result;
                }
            }


            if (this.enableGrid) {
                var delta = (x - this.axis.x) % this.axis.gap;
                if (Math.abs(delta) < this.gridDelta) {
                    return {
                        axis: x - delta,
                        y: 0
                    };
                }
            }

            return false;
        };

        /**
         * 检查y轴是否有可用的吸附
         *
         * @param {number} y y坐标
         * @return {number|boolean} 吸附的坐标或者`false`
         */
        Sorption.prototype.detectY = function (y) {
            // 检测是否有吸附的对象
            if (this.enableShape) {
                var result = binaryFind(this.yAxis, y, this.delta);
                if (result) {
                    return result;
                }
            }

            if (this.enableGrid) {
                var delta = (y - this.axis.y) % this.axis.gap;
                if (Math.abs(delta) < this.gridDelta) {
                    return {
                        axis: y - delta,
                        x: 0
                    };
                }
            }

            return false;
        };

        /**
         * 是否吸附可用
         *
         * @return {boolean}
         */
        Sorption.prototype.isEnable = function () {
            return this.enableShape || this.enableGrid;
        };

        /**
         * 清除缓存坐标
         */
        Sorption.prototype.clear = function () {
            this.xAxis.length = 0;
            this.yAxis.length = 0;
        };

        /**
         * 注销
         */
        Sorption.prototype.dispose = function () {
            this.clear();
            this.axis = null;
            this.xAxis = this.yAxis = null;
        };


        return Sorption;
    }
);
