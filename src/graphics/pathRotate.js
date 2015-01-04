/**
 * @file pathRotate.js
 * @author mengke01
 * @date
 * @description
 * 路径旋转
 */


define(
    function (require) {

        /**
         * 对path坐标进行调整
         *
         * @param {Object} contour 坐标点
         * @param {number} angle 角度
         * @param {number} centerX x偏移
         * @param {number} centerY y偏移
         *
         * @return {Object} contour 坐标点
         */
        function pathRotate(contour, angle, centerX, centerY) {
            angle = angle === undefined ? 0 : angle;
            var x = centerX || 0;
            var y = centerY || 0;
            var cos = Math.cos(angle);
            var sin = Math.sin(angle);
            var px;
            var py;
            var p;

            // x1=cos(angle)*x-sin(angle)*y;
            // y1=cos(angle)*y+sin(angle)*x;
            for (var i = 0, l = contour.length; i < l; i++) {
                p = contour[i];
                px = cos * (p.x - x) - sin * (p.y - y);
                py = cos * (p.y - y) + sin * (p.x - x);
                p.x = px + x;
                p.y = py + y;
            }

            return contour;
        }

        return pathRotate;
    }
);
