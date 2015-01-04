/**
 * @file isSegmentRayCross.js
 * @author mengke01
 * @date
 * @description
 * 判断x轴射线是否穿过线段
 */

define(
    function (require) {

        var isSegmentCross = require('./isSegmentCross');

        /**
         * 判断x轴射线是否穿过线段
         *
         * @param {Object} p0 线段p0
         * @param {Object} p1 线段p1
         * @param {Object} p 射线起点
         *  @return {boolean} 是否
         */
        function isSegmentRayCross(p0, p1, p) {
            return isSegmentCross(p0, p1, p, {x: 100000, y: p.y});
        }

        return isSegmentRayCross;
    }
);
