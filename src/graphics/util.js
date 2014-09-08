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
         * @return {Object} 点
         */
        function ceil(p) {
            p.x = Math.ceil(p.x * 100000) / 100000;
            p.y = Math.ceil(p.y * 100000) / 100000
            return p;
        }
        
        /**
         * 判断点是否在bounding box内部
         * @param {Object} bound bounding box对象
         * @param {Object} p 点对象
         * @return {boolean} 是否
         */
        function isPointInBound(bound, p, fixed) {
            p = fixed ? ceil(p) : p;
            return p.x <= bound.x + bound.width 
                && p.x >= bound.x
                && p.y <= bound.y + bound.height
                && p.y >= bound.y
        }

        return {
            ceil: ceil,
            isPointInBound: isPointInBound
        };
    }
);