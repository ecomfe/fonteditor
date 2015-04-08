/**
 * @file bezier曲线拟合2
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {
        var computeBoundingBox = require('graphics/computeBoundingBox');
        var reducePoints = require('graphics/image/contour/reducePoints');
        var pathUtil = require('graphics/pathUtil');
        var vector = require('graphics/vector');
        var findBreakPoints = require('./findBreakPoints');
        var fitBezier = require('./fitBezier');
        var fitOval = require('./fitOval');

        /**
         * 获取轮廓线的边界
         * @param  {Array} points 轮廓
         * @return {Object}         bound
         */
        function getBound(points) {
            return computeBoundingBox.computeBounding(points);
        }

        /**
         * 去除路径中的插值点
         *
         * @param {Array} path 路径
         * @return {Array} 路径
         */
        function reducePath(path, scale) {
            var newPath = [];
            var delta = scale;
            for (var i = 0, l = path.length; i < l; i++) {
                var cur = path[i];
                var next = path[i === l - 1 ? 0 : i + 1];
                var prev = path[i === 0 ? l - 1 : i - 1];

                if (cur.onCurve
                    && Math.abs(cur.x - next.x) < delta
                    && Math.abs(cur.y - next.y) < delta
                ){
                    continue;
                }

                // 插值
                if (
                    !prev.onCurve && cur.onCurve && !next.onCurve
                    && Math.abs(2 * cur.x -prev.x - next.x) < delta
                    && Math.abs(2 * cur.y -prev.y - next.y) < delta
                ) {
                    continue;
                }

                newPath.push(cur);
            }

            return newPath;
        }


        /**
         * 判断轮廓是否圆
         * @param  {Array}  contour contour
         * @return {Boolean}         [description]
         */
        function isCircle(contour) {
            var start = contour[0];
            var cur = start;
            var bound = getBound(contour);

            if (Math.abs(bound.width - bound.height) / bound.width > 0.1) {
                return false;
            }

            do {
                if (Math.abs(cur.theta - cur.next.theta) > 0.15) {
                    return false;
                }
                cur = cur.next;
            } while (cur !== start);
            return true;
        }

        /**
         * 拟合轮廓点曲线
         * @param  {Array} data        轮廓点数组
         * @param  {number} scale       缩放级别
         * @param {?Object} options 参数
         * @return {Array}             拟合后轮廓
         */
        function fitContour(data, scale, options) {
            options = options || {};
            scale = scale || 1;

            var resultContour = [];
            var reducedData = reducePoints(data, 0, data.length - 1, scale);

            // 仅线段
            if (options.segment) {
                return reducedData.map(function (p) {
                    return {
                        x: p.x,
                        y: p.y,
                        onCurve: true
                    };
                });
            }

            breakPoints = findBreakPoints(reducedData, scale);

            if (false === breakPoints) {

                if (isCircle(reducedData)) {
                    return fitOval(reducedData);
                }

                reducedData.forEach(function (p) {
                    resultContour.push({
                        x: p.x,
                        y: p.y
                    });
                });
            }
            else {

                for (var i = 0, l = breakPoints.length; i < l; i++) {
                    isLast = i === l - 1;
                    start = breakPoints[i];
                    end = breakPoints[ isLast ? 0 : i + 1];

                    if (start.right === 1) {
                        resultContour.push({
                            x: start.x,
                            y: start.y,
                            onCurve: true
                        });
                        tHat1Point = start;
                    }
                    else {

                        resultContour.push({
                            x: start.x,
                            y: start.y,
                            onCurve: start.tangency ? false : true
                        });

                        if (isLast) {
                            curvePoints = reducedData.slice(start.index).concat(reducedData.slice(0, end.index + 1));
                        }
                        else {
                            curvePoints = reducedData.slice(start.index, end.index + 1);
                        }

                        if (curvePoints.length <= 2) {
                            continue;
                        }

                        var bezierCurve = fitBezier(curvePoints, scale);
                        if (bezierCurve.length && bezierCurve.every(function (p) {
                                return !isNaN(p.x) && !isNaN(p.y)
                            })
                        ) {
                            bezierCurve.slice(0, bezierCurve.length - 1).forEach(function (p) {
                                resultContour.push({
                                    x: p.x,
                                    y: p.y,
                                    onCurve: p.onCurve
                                });
                            });

                            end = bezierCurve[bezierCurve.length - 1];
                        }
                        else {
                            curvePoints.slice(1, curvePoints.length - 2).forEach(function (p) {
                                resultContour.push({
                                    x: p.x,
                                    y: p.y
                                });
                            });

                            console.warn('error fitting curve');
                        }
                    }

                }
            }

            // 去除直线
            if (resultContour.length <= 2) {
                return [];
            }
            // 去除拟合后变成了直线轮廓
            else if (
                resultContour.length <= 4
                && vector.getDist(resultContour[0], resultContour[1], resultContour[2]) < scale
            ) {
                return [];
            }

            return reducePath(resultContour.map(function (p) {
                p.x = Math.round(p.x);
                p.y = Math.round(p.y);
                return p;
            }), scale);

        }



        return fitContour;
    }
);
