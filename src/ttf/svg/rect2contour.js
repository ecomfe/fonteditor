/**
 * @file 矩形转换成轮廓
 * @author mengke01(kekee000@gmail.com)
 */

define(function (require) {

    /**
     * 矩形转换成轮廓
     *
     * @param {number} x 左上角x
     * @param {number} y 左上角y
     * @param {number} width 宽度
     * @param {number} height 高度
     * @return {Array} 轮廓数组
     */
    function rect2contour(x, y, width, height) {
        x = +x;
        y = +y;
        width = +width;
        height = +height;

        return [
            {
                x: x,
                y: y,
                onCurve: true
            },
            {
                x: x + width,
                y: y,
                onCurve: true
            },
            {
                x: x + width,
                y: y + height,
                onCurve: true
            },
            {
                x: x,
                y: y + height,
                onCurve: true
            }
        ];
    }

    return rect2contour;
});
