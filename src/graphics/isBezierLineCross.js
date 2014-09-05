/**
 * @file isBezierLineCross.js
 * @author mengke01
 * @date 
 * @description
 * 判断贝塞尔曲线与直线相交
 */

define(
    function(require) {
        
        /**
         * 判断贝塞尔曲线与直线相交
         * 
         * @param {Object} p0 起点
         * @param {Object} p1 控制点
         * @param {Object} p2 终点
         * @param {Object} s1 直线点1
         * @param {Object} s2 直线点2
         * @return {boolean|Object} 是否相交
         */
        function isBezierLineCross(p0, p1, p2, s1, s2) {
            // y = kx + b
            // x = at^2 + bt + c
            // y = bt^2 + et + f
            //(ka-d)t^2 + (kb-e)t + (kc+b-f) = 0
        }

        return isBezierLineCross;
    }
);
