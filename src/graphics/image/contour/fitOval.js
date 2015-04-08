/**
 * @file 拟合圆
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {
        var pathUtil = require('graphics/pathUtil');
        var computeBoundingBox = require('graphics/computeBoundingBox');
        var pathAdjust = require('graphics/pathAdjust');
        var circlePath = require('graphics/path/circle');
        var lang = require('common/lang');

        /**
         * 拟合椭圆
         * @param  {Array} points 轮廓
         * @return {Object}         bound
         */
        function fitOval(points) {
            var b = computeBoundingBox.computeBounding(points);
            var bound = computeBoundingBox.computePath(circlePath);
            var scaleX = b.width / bound.width;
            var scaleY = b.height / bound.height;
            var contour = lang.clone(circlePath);
            pathAdjust(contour, scaleX, scaleY);
            pathAdjust(contour, 1, 1, b.x - bound.x, b.y - bound.y);
            return pathUtil.isClockWise(points) === -1 ? contour : contour.reverse();
        }

        return fitOval;
    }
);
