/**
 * @file bezier曲线拟合2
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        var reducePoints = require('graphics/image/contour/reducePoints');
        var findBreakPoints = require('./findBreakPoints');
        var fitBezier = require('./fitBezier');
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
            var reducedData = reducePoints(data, 0, data.length - 1, scale);
            breakPoints = breakPoints || findBreakPoints(reducedData, scale);

            var tHat1Point = null;
            var resultContour = [];
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
                        curvePoints = reducedData.slice(start.index).concat(reducedData.slice(0, end.index));
                    }
                    else {
                        curvePoints = reducedData.slice(start.index, end.index + 1);
                    }

                    if (curvePoints.length <= 2) {
                        continue;
                    }

                    if (start.tangency && tHat1Point && start !== tHat1Point) {
                        tHat1 = vector.normalize({
                            x: start.x - tHat1Point.x,
                            y: start.y - tHat1Point.y
                        });
                    }
                    else {
                        tHat1 = null;
                    }

                    var bezierCurve = fitBezier(curvePoints, scale);
                    if (bezierCurve.length) {
                        bezierCurve.forEach(function (p) {
                            if (!isNaN(p.x) && !isNaN(p.y)) {
                                resultContour.push({
                                    x: p.x,
                                    y: p.y,
                                    onCurve: p.onCurve
                                });
                            }
                            else {
                                console.log('nan');
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
                return [];
            }
            // 去除拟合后变成了直线轮廓
            else if (
                resultContour.length <= 4
                && vector.getDist(resultContour[0], resultContour[1], resultContour[2]) < scale
            ) {
                return [];
            }

            return pathUtil.deInterpolate(reducePath(resultContour).map(function (p) {
                p.x = Math.round(p.x);
                p.y = Math.round(p.y);
                return p;
            }));

        }



        return fitContour;
    }
);
