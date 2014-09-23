/**
 * @file boundAdjust.js
 * @author mengke01
 * @date 
 * @description
 * 边界缩放
 */


define(
    function(require) {

        /**
         * 对bound坐标进行调整
         * 
         * @param {Object} bound bound数据结构
         * @param {number} scaleX x缩放比例
         * @param {number} scaleY y缩放比例
         * @param {number} offsetX x偏移
         * @param {number} offsetY y偏移
         * 
         * @return {number} bound数据结构
         */
        function boundAdjust(bound, scaleX, scaleY, offsetX, offsetY) {

            var scaleX = scaleX === undefined ? 1 : scaleX;
            var scaleY = scaleY === undefined ? 1 : scaleY;
            var x = offsetX || 0;
            var y = offsetY || 0;

            bound.x = scaleX * (bound.x + x);
            bound.y = scaleY * (bound.y + y);
            bound.width = scaleX * bound.width;
            bound.height = scaleY * bound.height;

            return bound;
        }

        return boundAdjust;
    }
);
