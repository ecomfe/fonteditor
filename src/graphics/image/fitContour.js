/**
 * @file 根据关键点数据拟合轮廓
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        var fitBezier = require('graphics/image/fitBezier');
        var findBreakPoints = require('graphics/image/findBreakPoints');
        var pathUtil = require('graphics/pathUtil');
        var vector = require('graphics/vector');


        function fitContour(data) {

            data = pathUtil.scale(data, 10);

            var breakPoints = findBreakPoints(data);

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
                    else {
                        bezierCurvePoints = curvePoints.filter(function (p, index) {
                            return  index === 0 || index === curvePointsLast || p.index % 5 === 0;
                        });
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

                    var bezierCurve = fitBezier(bezierCurvePoints, 10, tHat1);
                    if (bezierCurve.length) {
                        bezierCurve.forEach(function (p) {
                            resultContour.push(p);
                        });
                        tHat1Point = bezierCurve[bezierCurve.length - 2];
                    }
                    else {
                        tHat1Point = null;
                    }
                }
                else {
                    tHat1Point = start;
                }
            }

            resultContour = pathUtil.scale(resultContour, 0.1);

            data = pathUtil.scale(data, 0.1);

            return resultContour;
        }

        return fitContour;
    }
);
