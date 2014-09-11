/**
 * @file pathAdjust.js
 * @author mengke01
 * @date 
 * @description
 * 路径调整
 */


define(
    function(require) {

        var pathIterator = require('./pathIterator');

        /**
         * 对path坐标进行调整
         * 
         * @param {Object} path path数据结构
         * @param {number} scaleX x缩放比例
         * @param {number} scaleY y缩放比例
         * @param {number} offsetX x偏移
         * @param {number} offsetY y偏移
         * @return {number} path数据结构
         */
        function pathAdjust(path, scaleX, scaleY, offsetX, offsetY) {
            var scaleX = scaleX == undefined ? 1 : scaleX;
            var scaleY = scaleY == undefined ? 1 : scaleY;
            var x = offsetX || 0;
            var y = offsetY || 0;
            pathIterator(path, function(c, i, p0, p1, p2) {
                if (c == 'Q') {
                    p1.x = scaleX * (p1.x + x);
                    p1.y = scaleY * (p1.y + y);
                    p2.x = scaleX * (p2.x + x);
                    p2.y = scaleY * (p2.y + y);
                }
                else {
                    p0.x = scaleX * (p0.x + x);
                    p0.y = scaleY * (p0.y + y);
                }
            });
            return path;
        }

        return pathAdjust;
    }
);
