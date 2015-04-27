/**
 * @file otf轮廓转ttf轮廓
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {
        var bezierCubic2Q2 = require('math/bezierCubic2Q2');
        var pathCeil = require('graphics/pathCeil');

        /**
         * 转换轮廓
         * @param  {Array} otfContour otf轮廓
         * @return {Array}            ttf轮廓
         */
        function transformContour(otfContour) {
            var contour = [];
            var prevPoint;
            var curPoint;
            var nextPoint;
            var nextNextPoint;

            contour.push(prevPoint = otfContour[0]);
            for (var i = 1, l = otfContour.length; i < l; i++) {
                curPoint = otfContour[i];

                if (curPoint.onCurve) {
                    contour.push(curPoint);
                    prevPoint = curPoint;
                }
                // 三次bezier曲线
                else {
                    nextPoint =  otfContour[i + 1];
                    nextNextPoint =  i === l - 2 ? otfContour[0] : otfContour[i + 2];
                    var bezierArray = bezierCubic2Q2(prevPoint, curPoint, nextPoint, nextNextPoint);
                    bezierArray[0][2].onCurve = true;
                    contour.push(bezierArray[0][1]);
                    contour.push(bezierArray[0][2]);

                    // 第二个曲线
                    if (bezierArray[1]) {
                        bezierArray[1][2].onCurve = true;
                        contour.push(bezierArray[1][1]);
                        contour.push(bezierArray[1][2]);
                    }

                    prevPoint = nextNextPoint;
                    i += 2;
                }
            }

            return pathCeil(contour);
        }


        /**
         * otf轮廓转ttf轮廓
         * @param  {Array} otfContours otf轮廓数组
         * @return {Array} ttf轮廓
         */
        function otfContours2ttfContours(otfContours) {
            if (!otfContours || !otfContours.length) {
                return otfContours;
            }
            var contours = [];
            for (var i = 0, l = otfContours.length; i < l; i++) {

                // 这里可能由于转换错误导致空轮廓，需要去除
                if (otfContours[i][0]) {
                    contours.push(transformContour(otfContours[i]));
                }
            }

            return contours;
        }

        return otfContours2ttfContours;
    }
);
