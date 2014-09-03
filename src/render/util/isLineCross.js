/**
 * @file isLineCross.js
 * @author mengke01
 * @date 
 * @description
 * 判断x轴射线是否穿过线段
 */

define(
    function(require) {

        /**
         * 判断x轴射线是否穿过线段
         * 
         * @return {boolean} 是否
         */
        function isLineCross(p0, p1, p) {
            // 射线平行于线段
            if (p0.y == p1.y && p0.y == p.y) {
                return p.x < p1.x;
            }
            else if(p0.y == p1.y && p0.y != p.y) {
                return false;
            }

            // 直线在射线两边，求交点
            if (!(p0.y < p.y) ^ (p1.y > p.y)) {

                // 垂直, 并且大于p
                if (p0.x == p1.x) {
                    if(p.x < p0.x) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }

                var xcross = (p.y - p0.y) / (p1.y - p0.y) * (p1.x - p0.x) + p0.x;
                if (xcross > p.x) {
                    return true;
                }
            }

            return false;
        }

        return isLineCross;
    }
);
