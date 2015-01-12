/**
 * @file rect2contour.js
 * @author mengke01
 * @description
 * 矩形转换成轮廓
 */


define(
    function (require) {

        /**
         * 矩形转换成轮廓
         *
         * @param {number} x x
         * @param {number} y y
         * @param {number} width width
         * @param {number} height height
         * @return {Array} contours
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
    }
);
