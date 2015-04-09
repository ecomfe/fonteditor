/**
 * @file 消减非必要的点
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        var getDist = require('graphics/vector').getDist;

        var THRESHOLD_DEFAULT = 1; // 默认消减点的阈值

        function reduce(contour, firstIndex, lastIndex, threshold, splitArray) {

            if (lastIndex - firstIndex < 3) {
                return;
            }

            var start = contour[firstIndex];
            var end = contour[lastIndex];
            var splitIndex = -1;
            var maxDistance = 0;
            for (var i = firstIndex + 1; i < lastIndex; i++) {
                var dist = getDist(start, end, contour[i]);
                if (dist > maxDistance) {
                    maxDistance = dist;
                    splitIndex = i;
                }
            }

            if (maxDistance > threshold) {
                splitArray.push(splitIndex);
                reduce(contour, firstIndex, splitIndex, threshold, splitArray);
                reduce(contour, splitIndex, lastIndex, threshold, splitArray);
            }
        }


        /**
         * 消减非必要的点
         *
         * @param  {Array} contour 轮廓点集
         * @param  {number} firstIndex   起始索引
         * @param  {number} lastIndex    结束索引
         * @param  {number} scale    缩放级别
         * @param  {number} threshold    消减阈值
         * @return {Array}  消减后的点集
         */
        function reducePoint(contour, firstIndex, lastIndex, scale, threshold) {
            firstIndex = firstIndex || 0;
            lastIndex = lastIndex || contour.length - 1;
            threshold = threshold || THRESHOLD_DEFAULT * (scale || 1);
            var splitArray = [];

            reduce(contour, firstIndex, lastIndex, threshold, splitArray);

            if (splitArray.length) {
                splitArray.unshift(firstIndex);
                splitArray = splitArray.map(function (index) {
                    contour[index].contourIndex = index;
                    return contour[index];
                });

                splitArray.sort(function (a, b) {
                    return a.contourIndex - b.contourIndex;
                });
                return splitArray;
            }

            return contour;
        }


        return reducePoint;
    }
);
