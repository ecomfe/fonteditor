/**
 * @file oval2contour.js
 * @author mengke01
 * @description
 * 椭圆转换成轮廓
 */


define(
    function (require) {
        var computeBoundingBox = require('graphics/computeBoundingBox');
        var pathAdjust = require('graphics/pathAdjust');
        var circlePath = require('graphics/path/circle');
        var lang = require('common/lang');

        /**
         * 椭圆转换成轮廓
         *
         * @param {number} cx cx
         * @param {number} cy cy
         * @param {number} rx rx
         * @param {number} ry ry
         * @return {Array} contours
         */
        function oval2contour(cx, cy, rx, ry) {

            if (undefined === ry) {
                ry = rx;
            }

            var bound = computeBoundingBox.computePath(circlePath);
            var scaleX = (+rx) * 2 / bound.width;
            var scaleY = (+ry) * 2 / bound.height;
            var centerX = bound.width * scaleX / 2;
            var centerY = bound.height * scaleY / 2;
            var path = lang.clone(circlePath);
            pathAdjust(path, scaleX, scaleY);
            pathAdjust(path, 1, 1, +cx - centerX, +cy - centerY);
            return path;
        }

        return oval2contour;
    }
);
