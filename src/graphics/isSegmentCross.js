/**
 * @file isSegmentCross.js
 * @author mengke01
 * @date
 * @description
 * 线段是否相交
 */

define(
    function (require) {

        var isBoundingBoxCross = require('./isBoundingBoxCross');
        var ceilPoint = require('./util').ceilPoint;
        var isPointInBound = require('./util').isPointInBound;
        var matrix = require('./matrix');
        var multi = matrix.multi;
        var minus = matrix.minus;

        /**
         * 过滤重叠线段上的点
         *
         * @param {Object} s0 线段1点1
         * @param {Object} s1 线段1点2
         * @param {Object} t0 线段2点1
         * @param {Object} t1 线段2点2
         * @param {string} axis 坐标轴 x or y
         *
         * @return {Array} 交点集合
         */
        function filter(s0, s1, t0, t1, axis) {

            var sorted = [s0, s1, t0, t1].sort(function (a, b) {
                return a[axis] < b[axis] ? -1 : 1;
            });

            var points = [];

            if (sorted[0][axis] === sorted[1][axis]) {
                points.push(sorted[0]);
                points.push(sorted[2]);
            }
            else if (sorted[2][axis] === sorted[3][axis]) {
                points.push(sorted[1]);
                points.push(sorted[3]);
            }
            else {
                points.push(sorted[1]);
                if (sorted[1][axis] !== sorted[2][axis]) {
                    points.push(sorted[2]);
                }
            }
            return points;
        }

        /**
         * 线段是否相交
         *
         * @param {Object} s0 线段1点1
         * @param {Object} s1 线段1点2
         * @param {Object} t0 线段2点1
         * @param {Object} t1 线段2点2
         *
         * @return {Array|boolean} 交点集合或者false
         */
        function isSegmentCross(s0, s1, t0, t1) {
            var p;
            var x;
            var y;

            if (s1.x < s0.x) {
                p = s1;
                s1 = s0;
                s0 = p;
            }

            if (t1.x < t0.x) {
                p = t1;
                t1 = t0;
                t0 = p;
            }


            var b1 = {
                x: Math.min(s0.x, s1.x),
                y: Math.min(s0.y, s1.y),
                width: Math.abs(s0.x - s1.x),
                height: Math.abs(s0.y - s1.y)
            };

            var b2 = {
                x: Math.min(t0.x, t1.x),
                y: Math.min(t0.y, t1.y),
                width: Math.abs(t0.x - t1.x),
                height: Math.abs(t0.y - t1.y)
            };

            if (isBoundingBoxCross(b1, b2)) {
                // 参数方程 Ax + By + C = 0
                var seg1 = [s1.y - s0.y, -(s1.x - s0.x), s0.y * (s1.x - s0.x) - s0.x * (s1.y - s0.y)];
                var seg2 = [t1.y - t0.y, -(t1.x - t0.x), t0.y * (t1.x - t0.x) - t0.x * (t1.y - t0.y)];

                // 直线退化成点
                if (seg1[0] === seg1[1] && seg1[0] === seg1[2] && seg1[0] === 0) {
                    if (
                        Math.abs((t1.y - s0.y) * (t0.x - s0.x) - (t0.y - s0.y) * (t1.x - s0.x)) <= 0.001
                        && s0.x >= t0.x && s0.x <= t1.x
                    ) {
                        return [s0];
                    }

                    return false;
                }

                if (seg2[0] === seg2[1] && seg2[0] === seg2[2] && seg2[0] === 0) {
                    if (
                        Math.abs((s1.y - t0.y) * (s0.x - t0.x) - (s0.y - t0.y) * (s1.x - t0.x)) <= 0.001
                        && t0.x >= s0.x && t0.x <= s1.x
                    ) {
                        return [t0];
                    }

                    return false;
                }

                // x轴重叠
                if (seg1[1] === seg2[1] && seg1[1] === 0) {
                    if (s1.x === t1.x) {
                        return filter(s0, s1, t0, t1, 'y');
                    }

                    return false;
                }

                // y轴重叠
                else if (seg1[0] === seg2[0] && seg1[0] === 0) {
                    if (s1.y === t1.y) {
                        return filter(s0, s1, t0, t1, 'x');
                    }

                    return false;
                }

                // 平行
                else if (seg1[0] * seg2[1] === seg1[1] * seg2[0]) {
                    // 重叠
                    if (seg1[1] * seg2[2] === seg1[2] * seg2[1]) {
                        return filter(s0, s1, t0, t1, 'x');
                    }

                    return false;
                }

                var tmp = minus(multi(seg1, seg2[0]), multi(seg2, seg1[0]));
                y = -tmp[2] / tmp[1];

                if (seg1[0] !== 0) {
                    x = -(seg1[2] + seg1[1] * y) / seg1[0];
                }
                else {
                    x = -(seg2[2] + seg2[1] * y) / seg2[0];
                }

                p = ceilPoint({
                    x: x,
                    y: y
                });

                if (isPointInBound(b1, p, true) && isPointInBound(b2, p, true)) {
                    return [p];
                }
            }

            return false;
        }

        return isSegmentCross;
    }
);
