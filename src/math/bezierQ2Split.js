/**
 * @file bezierQ2Split.js
 * @author mengke01
 * @date 
 * @description
 * 分割二次贝塞尔曲线
 */


define(
    function(require) {
        
        var getBezierQ2T = require('./getBezierQ2T');

        // 获取贝塞尔曲线上的点
        function getPoint(p0, p1, p2, t) {
            return {
                x: p0.x * Math.pow(1 - t, 2) + 2 * p1.x * t * (1-t) + p2.x * Math.pow(t, 2),
                y: p0.y * Math.pow(1 - t, 2) + 2 * p1.y * t * (1-t) + p2.y * Math.pow(t, 2)
            };
        }

        /**
         * 分割贝塞尔曲线
         * 
         * @param {Object} p0 p0
         * @param {Object} p1 p1
         * @param {Object} p2 p2
         * @param {number|Object} point 分割点t或者坐标
         * @return {Array} 分割后的贝塞尔
         */
        function bezierQ2Split(p0, p1, p2, point) {
            var t, p;

            if (typeof(point) === 'number') {
                t = point;
                p = getPoint(p0, p1, p2, t);
            }
            else if (typeof(point) === 'object') {
                p = point;
                t = getBezierQ2T(p0, p1, p2, p);

                if (false === t) {
                    return false;
                }
            }

            return [
                [
                    p0, 
                    {
                        x: p0.x + (p1.x - p0.x) * t,
                        y: p0.y + (p1.y - p0.y) * t,
                    },
                    p
                ],
                [
                    p, 
                    {
                        x: p1.x + (p2.x - p1.x) * t,
                        y: p1.y + (p2.y - p1.y) * t,
                    },
                    p2
                ]
            ];
        }


        return bezierQ2Split;
    }
);
