/**
 * @file 椭圆转换成轮廓
 * @author mengke01(kekee000@gmail.com)
 */


define(function (require) {
    var computeBoundingBox = require('graphics/computeBoundingBox');
    var pathAdjust = require('graphics/pathAdjust');
    var circlePath = require('graphics/path/circle');
    var lang = require('common/lang');

    /**
     * 椭圆转换成轮廓
     *
     * @param {number} cx 椭圆中心点x
     * @param {number} cy 椭圆中心点y
     * @param {number} rx 椭圆x轴半径
     * @param {number} ry 椭圆y周半径
     * @return {Array} 轮廓数组
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
        var contour = lang.clone(circlePath);
        pathAdjust(contour, scaleX, scaleY);
        pathAdjust(contour, 1, 1, +cx - centerX, +cy - centerY);

        return contour;
    }

    return oval2contour;
});
