/**
 * @file polygon2contour.js
 * @author mengke01
 * @description
 * 多边形转换成轮廓
 */


define(
    function (require) {

        var parseParams = require('./parseParams');

        /**
         * 多边形点转换成轮廓
         *
         * @param {Array} points 点集合
         * @return {Array} contours
         */
        function polygon2contour(points) {

            if (!points || !points.length) {
                return null;
            }

            var contours = [];
            var segments = parseParams(points);
            for (var i = 0, l = segments.length; i < l; i += 2) {
                contours.push({
                    x: segments[i],
                    y: segments[i + 1],
                    onCurve: true
                });
            }

            return contours;
        }

        return polygon2contour;
    }
);
