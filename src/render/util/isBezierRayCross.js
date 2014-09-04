/**
 * @file isBezierCross.js
 * @author mengke01
 * @date 
 * @description
 * 判断x轴射线是否与贝塞尔曲线相交
 */


define(
    function(require) {

        var computeBoundingBox = require('./computeBoundingBox');
        var bezierQuadeEquation = require('./bezierQuadeEquation');

        /**
         * 判断x轴射线是否与贝塞尔曲线相交
         * 
         * @return {boolean} 是否
         */
        function isBezierCross(p0, p1, p2, p) {
            
            // 3点都在同一侧
            if(!((p0.y > p.y) + (p1.y > p.y) + (p2.y > p.y)) % 3) {
                return false;
            }

            var bound = computeBoundingBox.quadraticBezier(p0, p1, p2);

            // 退化成线段
            if(bound.width == 0) {
                return ! (p.y > p0.y) ^ (p.y < p2.y) 
                    ? {
                        x: p0.x,
                        y: p.y
                    }
                    : false;
            }
            // 判断是否在曲线上
            else if (bound.height == 0) {
                return p.y == p0.y && (p.x < p0.x || p.x < p2.x) 
                    ? p
                    : false;
            }

            // 在包围盒内部
            if(
                p.x >= bound.x && p.x <= bound.x + bound.width
                && p.y >= bound.y && p.y <= bound.y + bound.height
             ) {

                var a = p0.y  + p2.y - 2 * p1.y;
                var b = 2 * (p1.y - p0.y);
                var c = p0.y - p.y;
                
                var tResult = bezierQuadeEquation(a, b, c);

                // 无解
                if(!tResult) {
                    return false;
                }
                // 一个解
                else if(tResult.length == 1) {
                    var t = tResult[0];
                    var x = Math.pow(1 - t, 2) * p0.x 
                        + 2 * t * (1-t) * p1.x
                        + Math.pow(t, 2) * p2.x;

                    if(p.x < x) {
                        return {
                            x: x,
                            y: p.y
                        }
                    }
                }
                else {
                    var t = tResult[0];
                    var x1 = Math.pow(1 - t, 2) * p0.x 
                        + 2 * t * (1-t) * p1.x
                        + Math.pow(t, 2) * p2.x;

                    t = tResult[1];
                    var x2 = Math.pow(1 - t, 2) * p0.x 
                        + 2 * t * (1-t) * p1.x
                        + Math.pow(t, 2) * p2.x;

                    // 交换
                    if(x1 > x2) {
                        var t = x1;
                        x1 = x2;
                        x2 = t;
                    }

                    // 点在两个交点中间
                    if(p.x > x1 && p.x < x2) {
                        return {
                            x: x2,
                            y: p.y
                        };
                    }
                }
            }

            return false;
        }


        return isBezierCross;
    }
);
