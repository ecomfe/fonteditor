/**
 * @file 根据关键点数据拟合轮廓
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        var fitBezier = require('./fitBezier');
        var findBreakPoints = require('./findBreakPoints');

        var pathUtil = require('graphics/pathUtil');
        var reducePath = require('graphics/reducePath');
        var vector = require('graphics/vector');

        /**
         * 拟合轮廓点曲线
         * @param  {Array} data        轮廓点数组
         * @param  {number} scale       缩放级别
         * @param  {Array?} breakPoints 关键点数组
         * @return {Array}             拟合后轮廓
         */
        function fitContour(data, scale, breakPoints) {
            scale = scale || 1;

            breakPoints = breakPoints || findBreakPoints(data, scale);
            var resultContour = [];
            var isLast;
            var start;
            var end;
            var curvePoints;
            var tHat1Point;

            for (var i = 0, l = breakPoints.length; i < l; i++) {
                isLast = i === l - 1;
                start = breakPoints[i];
                end = breakPoints[ isLast ? 0 : i + 1];

                resultContour.push({
                    x: start.x,
                    y: start.y,
                    onCurve: true
                });

                if (start.right !== 1) {

                    if (isLast) {
                        curvePoints = data.slice(start.index).concat(data.slice(0, end.index));
                    }
                    else {
                        curvePoints = data.slice(start.index, end.index + 1);
                    }

                    var bezierCurvePoints = [];
                    var curvePointsLast = curvePoints.length - 1;

                    if (curvePoints.length > 200) {
                        var derive = Math.floor(curvePoints.length / 20);
                        bezierCurvePoints = curvePoints.filter(function (p, index) {
                            return index === 0 || index === curvePointsLast || p.index % derive === 0;
                        });
                    }
                    else if (curvePoints.length > 40) {
                        var derive = Math.floor(curvePoints.length / 10);
                        bezierCurvePoints = curvePoints.filter(function (p, index) {
                            return  index === 0 || index === curvePointsLast || p.index % derive === 0;
                        });
                    }
                    else if (curvePoints.length > 20) {
                        bezierCurvePoints = curvePoints.filter(function (p, index) {
                            return  index === 0 || index === curvePointsLast || p.index % 4 === 0;
                        });
                    }
                    else if (curvePoints.length > 10) {
                        bezierCurvePoints = curvePoints.filter(function (p, index) {
                            return  index === 0 || index === curvePointsLast || p.index % 3 === 0;
                        });
                    }
                    else {

                        end = curvePoints[curvePointsLast];
                        resultContour.push({
                            x: end.x,
                            y: end.y,
                            onCurve: true
                        });

                        tHat1 = null;
                        continue;
                    }

                    if (start.tangency && tHat1Point) {
                        tHat1 = vector.normalize({
                            x: start.x - tHat1Point.x,
                            y: start.y - tHat1Point.y
                        });
                    }
                    else {
                        tHat1 = null;
                    }

                    var bezierCurve = fitBezier(bezierCurvePoints, scale, tHat1);
                    if (bezierCurve.length) {
                        bezierCurve.forEach(function (p) {
                            if (!isNaN(p.x) && !isNaN(p.y)) {
                                resultContour.push({
                                    x: p.x,
                                    y: p.y,
                                    onCurve: p.onCurve
                                });
                            }
                        });
                        end = bezierCurve[bezierCurve.length - 2];
                        if (!isNaN(end.x) && !isNaN(end.y)) {
                            tHat1Point = end;
                        }
                        else {
                            tHat1Point = null;
                        }
                    }
                    else {
                        tHat1Point = null;
                    }
                }
                else {
                    tHat1Point = start;
                }
            }

            // 去除直线
            if (resultContour.length <= 2) {
                return null;
            }
            // 去除拟合后变成了直线轮廓
            else if (
                resultContour.length <= 4
                && vector.getDist(resultContour[0], resultContour[1], resultContour[2]) < scale
            ) {
                return null;
            }

            if (vector.dist(resultContour[0], resultContour[resultContour.length - 1]) <= scale) {
                resultContour.splice(resultContour.length - 1, 1);
            }

            return pathUtil.deInterpolate(reducePath(resultContour).map(function (p) {
                p.x = Math.floor(p.x);
                p.y = Math.floor(p.y);
                return p;
            }));
        }

        return fitContour;
    }
);
