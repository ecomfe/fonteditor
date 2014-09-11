/**
 * @file isSegmentRayCross.js
 * @author mengke01
 * @date 
 * @description
 * 判断x轴射线是否穿过线段
 */

define(
    function(require) {

        var isSegmentCross = require('./isSegmentCross');

        /**
         * 判断x轴射线是否穿过线段
         * 
         * @return {boolean} 是否
         */
        function isSegmentRayCross(p0, p1, p) {
            return isSegmentCross(p0, p1, p, {x: 10000, y: p.y});
        }

        return isSegmentRayCross;
    }
);
