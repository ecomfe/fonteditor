/**
 * @file 对路径进行四舍五入
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {

        /**
         * 对path坐标进行调整
         * @param {Array} contour 轮廓点数组
         * @return {Object} contour 坐标点
         */
        function pathCeil(contour) {
            var p;
            for (var i = 0, l = contour.length; i < l; i++) {
                p = contour[i];
                p.x = Math.round(p.x);
                p.y = Math.round(p.y);
            }
            return contour;
        }

        return pathCeil;
    }
);
