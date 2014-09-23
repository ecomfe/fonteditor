/**
 * @file pathAdjust.js
 * @author mengke01
 * @date 
 * @description
 * 轮廓调整
 */


define(
    function(require) {

        /**
         * 对path坐标进行调整
         * 
         * @param {Object} contour 坐标点
         * @param {number} scaleX x缩放比例
         * @param {number} scaleY y缩放比例
         * @param {number} offsetX x偏移
         * @param {number} offsetY y偏移
         * 
         * @return {Object} contour 坐标点
         */
        function pathAdjust(contour, scaleX, scaleY, offsetX, offsetY) {
            var scaleX = scaleX === undefined ? 1 : scaleX;
            var scaleY = scaleY === undefined ? 1 : scaleY;
            var x = offsetX || 0;
            var y = offsetY || 0;
            var p;
            for (var i = 0, l = contour.length; i < l; i++) {
                p = contour[i];
                p.x = scaleX * (p.x + x);
                p.y = scaleY * (p.y + y);
            }
            return contour;
        }

        return pathAdjust;
    }
);
