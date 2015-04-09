/**
 * @file 轮廓拟合处理类
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        var findContours = require('./contour/findContours');
        var findBreakPoints = require('./contour/findBreakPoints');
        var fitContour = require('./contour/fitContour');
        var pathUtil = require('graphics/pathUtil');
        var reducePoints = require('graphics/image/contour/douglasPeuckerReducePoints');

        /**
         * 轮廓点集合
         *
         * @param {Array} contourPoints 轮廓点集合
         * @param {?Object} options 参数
         * @param {number} options.scale 缩放级别
         * @param {boolean} options.segment 是否线段
         */
        function Processor(contourPoints, options) {
            options = options || {};
            this.scale = options.scale || 2;
            this.segment = options.segment || false;
            contourPoints && this.set(contourPoints);
        }

        /**
         * 从二值图像中导入轮廓点集
         * @param  {Object} imageData 图像数据
         */
        Processor.prototype.import = function (imageData) {
            var contourPoints = findContours(imageData);
            this.set(contourPoints);
        };

        /**
         * 设置轮廓点集
         *
         * @param {Array} contourPoints 轮廓点集
         */
        Processor.prototype.set = function (contourPoints) {
            contourPoints = contourPoints || [];
            var scale = this.scale;
            contourPoints.forEach(function (points) {
                pathUtil.scale(points, scale);
            });
            this.contourPoints = contourPoints;
        };

        /**
         * 获取轮廓点集
         * @return {Array} 轮廓点集
         */
        Processor.prototype.get = function () {
            var scale = 1 / this.scale;
            return this.contourPoints.map(function (points) {
                return pathUtil.scale(pathUtil.clone(points), scale);
            });
        };


        /**
         * 获取关键点数组
         *
         * @param {number} index 指定轮廓的关键点数组
         * @return {Array} 关键点数组
         */
        Processor.prototype.getBreakPoints = function (index) {
            var scale = this.scale;
            var breakPoints = [];
            var contourPoints = index >= 0 ? [this.contourPoints[index]] : this.contourPoints;
            contourPoints.forEach(function (points) {
                var reducedData = reducePoints(points, 0, points.length - 1, scale);
                breakPoints = breakPoints.concat(findBreakPoints(pathUtil.clone(reducedData), scale));
            });
            return pathUtil.scale(breakPoints, 1 / this.scale);
        };

        /**
         * 获取拟合后的轮廓数组
         *
         * @return {Array}
         */
        Processor.prototype.getContours = function () {
            var scale = this.scale;
            var segment = this.segment;
            return this.contourPoints.map(function (points) {
                return fitContour(pathUtil.clone(points), scale, {
                    segment: segment
                });
            }).filter(function (contour) {
                return contour && contour.length > 2;
            }).map(function (contour) {
                return pathUtil.scale(contour, 1 / scale);
            });
        };

        /**
         * 注销
         */
        Processor.prototype.dispose = function () {
            this.contourPoints = null;
        };

        return Processor;
    }
);
