/**
 * @file 判断线段是否直线点
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        var getDist = require('graphics/vector').getDist;

        function isSegmentLine(contour, start, end, isLast) {

            var contourSize = contour.length;
            var mid;
            var thetaDistance = 1; // 判断直线点距离

            // 随机选取 几个点进行直线判断
            var startIndex = start.index;
            var endIndex = end.index;

            if (isLast) {
                startIndex = start.index;
                endIndex = contourSize + end.index;
            }

            mid = contour[Math.floor(startIndex / 2 + endIndex / 2) % contourSize];

            if (getDist(start, end, mid) > thetaDistance) {
                return false;
            }

            // 距离比较长的话可以适当放大
            if (endIndex - startIndex > 40) {
                thetaDistance = 2;
            }

            var step = Math.floor(Math.max((endIndex - startIndex) / 10, 4));
            var lineFlag = true;

            for (var j = startIndex + step; j < endIndex; j += step) {
                var dist = getDist(start, end, contour[j % contourSize]);
                if (dist > thetaDistance) {
                    lineFlag = false;
                    break;
                }
            }

            return lineFlag;
        }

        return isSegmentLine;
    }
);
