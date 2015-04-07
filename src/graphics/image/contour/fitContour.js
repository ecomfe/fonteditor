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


                if (start.right === 3 && end.right !== 3) {
                    resultContour.push({
                        x: start.x,
                        y: start.y
                    });
                    tHat1Point = start;
                }
                else if (start.right === 1) {
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
                        onCurve: true
                    });

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
                    if (false &&
                        bezierCurve.length
                        && bezierCurve.every(function (p) {
                            return !isNaN(p.x) && !isNaN(p.y)
                        })
                    ) {
                        bezierCurve.forEach(function (p) {
                            resultContour.push({
                                x: p.x,
                                y: p.y,
                                onCurve: p.onCurve
                            });
                        });

                        end = bezierCurve[bezierCurve.length - 2];
                        tHat1Point = end;
                    }
                    else {
                        curvePoints.slice(1, curvePoints.length - 2).forEach(function (p) {
                            resultContour.push({
                                x: p.x,
                                y: p.y,
                                onCurve: true
                            });
                        });

                        tHat1Point = null;
                        console.warn('error fitting curve');
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

            return pathUtil.deInterpolate(reducePath(resultContour).map(function (p) {
                p.x = Math.round(p.x);
                p.y = Math.round(p.y);
                return p;
            }));

        }



        return fitContour;
    }
);
