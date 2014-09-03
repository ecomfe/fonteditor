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
                p.x < bound.x + bound.width
                & p.y > bound.y && p.y < bound.y + bound.height
             ) {
                var a = p0.y  + p2.y - 2 * p1.y;
                var b = 2 * (p1.y - p0.y);
                var c = p0.y - p.y;
                var t1;
                var t2;

                // 只有一个解
                if(a == 0) {
                    t1 = -c / b;
                    t2 = -1;
                }
                else {
                    var b4ac = Math.pow(b, 2) - 4 * a *c;
                    // 求解二次方程
                    if(b4ac >= 0) {
                        t1  =  (-b + Math.sqrt(b4ac, 2)) / 2 / a;
                        t2 = (-b - Math.sqrt(b4ac, 2)) / 2 / a;
                    }
                }

                var t = 0;
                var x1, x2;

                // 两个交点
                if(t1 >= 0 && t1 <= 1) {
                    t = t1;
                    x1 = Math.pow(1 - t, 2) * p0.x 
                        + 2 * t * (1-t) * p1.x
                        + Math.pow(t, 2) * p2.x;
                }

                if(t2 >= 0 && t2 <= 1) {
                    t = t2;
                    x2 = Math.pow(1 - t, 2) * p0.x 
                        + 2 * t * (1-t) * p1.x
                        + Math.pow(t, 2) * p2.x;
                }

                if (x1 != undefined && x2 != undefined) {
                    // 点在两个交点中间
                    if(! (p.x > x1) ^ (p.x < x2) ) {
                        return p.x > x1 
                            ? {x: x2, y: p.y}
                            : {x: x1, y: p.y};
                    }
                }
                else if(x1 != undefined) {
                    if(p.x < x1) {
                        return {
                            x: x1,
                            y: p.y
                        }
                    }
                }
                else if(x2 != undefined) {
                    if(p.x < x2) {
                        return {
                            x: x2,
                            y: p.y
                        }
                    }
                }

            }

            return false;
        }


        return isBezierCross;
    }
);
