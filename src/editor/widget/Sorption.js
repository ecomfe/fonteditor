/**
 * @file Sorption.js
 * @author mengke01
 * @date 
 * @description
 * 智能吸附组件
 */


define(
    function(require) {
        
        var computeBoundingBox = require('graphics/computeBoundingBox');

        /**
         * 二分查找
         * 
         * @param {Array} arr 查找数组
         * @param {number} val 值
         * @return {Object|false} 找到的点或者false
         */
        function binaryFind(arr, val, delta) {
            var l = 0;
            var r = arr.length - 1;
            var mid;
            var axis;
            while(l <= r) {
                mid = (l + r) >> 1;
                axis = arr[mid].axis;

                if (Math.abs(val - axis) < delta) {
                    return arr[mid];
                }
                else if(val < axis) {
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
         */
        function Sorption(options) {
            this.gridDelta = options.gridDelta || 5; // 吸附检查offset
            this.delta = options.delta || 5; // 吸附检查offset
            this.enableGrid = options.enableGrid || false;
            this.enableShape = options.enableShape || true;
        }

        /**
         * 设置吸附的网格
         * @param {Object} axis 坐标参数
         * @return {this}
         */
        Sorption.prototype.setGrid = function(axis) {
            this.axis = axis;
        };


        /**
         * 设置吸附的对象
         * 
         * @return {this}
         */
        Sorption.prototype.setShapes = function(shapes) {
            var xAxis = [];
            var yAxis = [];
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

            xAxis.sort(function(a, b) {
                return a.axis - b.axis;
            });

            yAxis.sort(function(a, b) {
                return a.axis - b.axis;
            });

            this.xAxis = xAxis;
            this.yAxis = yAxis;
        };

        /**
         * 检查x轴是否有可用的吸附
         * 
         * @return {this}
         */
        Sorption.prototype.detectX = function(x) {

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
         * @return {this}
         */
        Sorption.prototype.detectY = function(y) {
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
         * 结束吸附检测
         * 
         * @return {this}
         */
        Sorption.prototype.isEnable = function() {
            return this.enableShape || this.enableGrid;
        };

        /**
         * 结束吸附检测
         * 
         * @return {this}
         */
        Sorption.prototype.clear = function() {
            this.xAxis = this.yAxis = null;
        };

        /**
         * 注销
         * 
         * @return {this}
         */
        Sorption.prototype.dispose = function() {
            this.clear();
            this.axis = null;
            this.xAxis = this.yAxis = null;
        };


        return Sorption;
    }
);
