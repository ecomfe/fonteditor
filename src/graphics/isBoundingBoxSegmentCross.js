/**
 * @file isBoundingBoxSegmentCross.js
 * @author mengke01
 * @date 
 * @description
 * boundingbox和线段的关系
 */


define(
    function(require) {
        var isPointInBound = require('./util').isPointInBound;
        var isSegmentCross = require('./isSegmentCross');

        /**
         * boundingbox和线段的关系
         * 
         * @param {Object} bound bounding 1
         * @param {Object} s0 线段点1
         * @param {Object} s1 线段点2
         * @return {number} 包含关系
         */
        function isBoundingBoxSegmentCross(bound, s0, s1) {
            if (isPointInBound(bound, s0) || isPointInBound(bound, s1)) {
                return true;
            }

            if (
                isSegmentCross(bound, {x: bound.x, y: bound.y + bound.height}, s0, s1)
                || isSegmentCross(bound, {x: bound.x + bound.width, y: bound.y}, s0, s1)
                || isSegmentCross(
                    {x: bound.x + bound.width, y: bound.y}, 
                    {x: bound.x + bound.width, y: bound.y + bound.height},
                    s0, s1)
                || isSegmentCross(
                    {x: bound.x, y: bound.y + bound.height},
                    {x: bound.x + bound.width, y: bound.y + bound.height},
                    s0, s1)
            ) {
                return true;
            }

            return false;
        }

        return isBoundingBoxSegmentCross;
    }
);
