/**
 * @file 消减曲线上的点
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {




        function reducePath (contour, scale) {

            var curvePoints = [];

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

        }

        return reducePath;
    }
);
