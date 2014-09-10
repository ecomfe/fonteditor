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
         * @param {number} scale 缩放比例
         * @param {number} offsetX x偏移
         * @param {number} offsetY y偏移
         * @return {number} path数据结构
         */
        function pathAdjust(path, scale, offsetX, offsetY) {
            var scale = scale || 1;
            var x = offsetX || 0;
            var y = offsetY || 0;
            if(scale == 1) {
                pathIterator(path, function(c, i, p0, p1, p2) {
                    if (c == 'Q') {
                        p1.x = p1.x + x;
                        p1.y = p1.y + y;
                        p2.x = p2.x + x;
                        p2.y = p2.y + y;
                    }
                    else {
                        p0.x = p0.x + x;
                        p0.y = p0.y + y;
                    }
                });
            }
            else {

                pathIterator(path, function(c, i, p0, p1, p2) {
                    if (c == 'Q') {
                        p1.x = scale * (p1.x + x);
                        p1.y = scale * (p1.y + y);
                        p2.x = scale * (p2.x + x);
                        p2.y = scale * (p2.y + y);
                    }
                    else {
                        p0.x = scale * (p0.x + x);
                        p0.y = scale * (p0.y + y);
                    }
                });
            }
            return path;
        }

        return pathAdjust;
    }
);
