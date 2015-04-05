/**
 * @file 消减非必要的点
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        var getDist = require('graphics/vector').getDist;

        var TORANCE_DEFAULT = 1;

        function reduce(contour, firstIndex, lastIndex, tolerance, splitArray) {

            if (lastIndex - firstIndex <= 3) {
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

            if (maxDistance > tolerance) {
                splitArray.push(splitIndex);
                reduce(contour, firstIndex, splitIndex, tolerance, splitArray);
                reduce(contour, splitIndex, lastIndex, tolerance, splitArray);
            }
        }


        /**
         * 消减非必要的点
         *
         * @param  {Array} contour 轮廓点集
         * @param  {number} firstIndex   起始索引
         * @param  {number} lastIndex    结束索引
         * @return {Array}  消减后的点集
         */
        function reducePoint(contour, firstIndex, lastIndex, scale, tolerance) {
            firstIndex = firstIndex || 0;
            lastIndex = lastIndex || contour.length - 1;
            tolerance = tolerance || TORANCE_DEFAULT * (scale || 1);
            var splitArray = [];

            reduce(contour, firstIndex, lastIndex, tolerance, splitArray);

            if (splitArray.length) {
                splitArray.unshift(firstIndex);
                return splitArray.map(function (index) {
                    contour[index].index = index;
                    return contour[index];
                }).sort(function (a, b) {
                    return a.index - b.index;
                });
            }

            return contour;
        }


        return reducePoint;
    }
);
