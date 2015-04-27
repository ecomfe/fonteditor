/**
 * @file 判断贝塞尔曲线与线段相交
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {
        var computeBoundingBox = require('./computeBoundingBox');
        var isBezierLineCross = require('./isBezierLineCross');
        var isBoundingBoxCross = require('./isBoundingBoxCross');
        var isPointInBound = require('./util').isPointInBound;

        /**
         * 判断贝塞尔曲线与线段相交
         *
         * @param {Object} p0 起点
         * @param {Object} p1 控制点
         * @param {Object} p2 终点
         * @param {Object} s0 线段点1
         * @param {Object} s1 线段点2
         * @return {Array.<Object>|boolean} 交点数组或者false
         */
        function isBezierSegmentCross(p0, p1, p2, s0, s1) {
            var b1 = computeBoundingBox.quadraticBezier(p0, p1, p2);
            var bound = {
                x: Math.min(s0.x, s1.x),
                y: Math.min(s0.y, s1.y),
                width: Math.abs(s0.x - s1.x),
                height: Math.abs(s0.y - s1.y)
            };

            if (isBoundingBoxCross(b1, bound)) {
                var result = isBezierLineCross(p0, p1, p2, s0, s1);
                if (result) {
                    return result.filter(function (p) {
                        return isPointInBound(bound, p, true);
                    });
                }
            }

            return false;
        }

        return isBezierSegmentCross;
    }
);
