/**
 * @file bezierQ2Split.js
 * @author mengke01
 * @date 
 * @description
 * 分割二次贝塞尔曲线
 */


define(
    function(require) {
        
        var bezierQ2Equation = require('math/bezierQ2Equation');

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
                var result = bezierQ2Equation(
                    p0.x + p2.x - 2 * p1.x + p0.y + p2.y - 2 * p1.y,
                    2 * (p1.x - p0.x) + 2 * (p1.y - p0.y),
                    p0.x + p0.y - p.x - p.y
                );

                if (!result) {
                    return false;
                }
                
                if (result.length === 1) {
                    t =  result[0];
                }
                else {
                    var pt = getPoint(p0, p1, p2, result[0]);
                    if (Math.abs(pt.x - p.x) < 0.01 && Math.abs(pt.y - p.y) < 0.01) {
                        t = result[0];
                    }
                    else {
                        t = result[1];
                    }
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
