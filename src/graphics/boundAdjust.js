/**
 * @file 对bound对象进行缩放和平移
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {

        /**
         * 对bound坐标进行调整
         *
         * @param {Object} bound bound数据结构 {x,y,width,height}
         * @param {number} scaleX x缩放比例
         * @param {number} scaleY y缩放比例
         * @param {number} offsetX x偏移
         * @param {number} offsetY y偏移
         *
         * @return {number} bound数据结构
         */
        function boundAdjust(bound, scaleX, scaleY, offsetX, offsetY) {

            scaleX = scaleX === undefined ? 1 : scaleX;
            scaleY = scaleY === undefined ? 1 : scaleY;
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
