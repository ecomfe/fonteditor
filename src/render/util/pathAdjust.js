/**
 * @file pathAdjust.js
 * @author mengke01
 * @date 
 * @description
 * 路径调整
 */


define(
    function(require) {

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
            var l = path.length;
            var i = -1;
            while (++i < l) {
                var point = path[i];
                switch (point.c) {
                    case 'M':
                    case 'L':
                        point.p.x = scale * (point.p.x + x);
                        point.p.y = scale * (point.p.y + y);
                        break;
                    case 'Q':
                        point.p.x = scale * (point.p.x + x);
                        point.p.y = scale * (point.p.y + y);
                        point.p1.x = scale * (point.p1.x + x);
                        point.p1.y = scale * (point.p1.y + y);
                        break;
                }
            }
            return path;
        }

        return pathAdjust;
    }
);
