/**
 * @file matrix.js
 * @author mengke01
 * @date 
 * @description
 * 相关工具箱
 */


define(
    function(require) {

        /**
         * 将点进行误差舍入
         * 
         * @param {Object} p 点对象
         * 
         * @return {Object} 点
         */
        function ceilPoint(p) {
            p.x = Math.round(p.x * 100000) / 100000;
            p.y = Math.round(p.y * 100000) / 100000;
            return p;
        }

        /**
         * 将数值进行误差舍入
         * 
         * @param {Object} x 数值
         * 
         * @return {number} 点
         */
        function ceil(x) {
            return Math.round(x * 100000) / 100000;
        }

        /**
         * 判断点是否在bounding box内部
         * @param {Object} bound bounding box对象
         * @param {Object} p 点对象
         * 
         * @return {boolean} 是否
         */
        function isPointInBound(bound, p, fixed) {
            if(fixed) {
                return ceil(p.x) <= ceil(bound.x + bound.width)
                    && ceil(p.x) >= ceil(bound.x)
                    && ceil(p.y) <= ceil(bound.y + bound.height)
                    && ceil(p.y) >= ceil(bound.y);
            }
            else {
                return p.x <= bound.x + bound.width 
                    && p.x >= bound.x
                    && p.y <= bound.y + bound.height
                    && p.y >= bound.y;
            }
        }

        return {
            ceil: ceil,
            ceilPoint: ceilPoint,
            isPointInBound: isPointInBound
        };
    }
);