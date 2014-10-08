/**
 * @file pathCeil.js
 * @author mengke01
 * @date 
 * @description
 * 对路径进行四舍五入
 */


define(
    function(require) {

        /**
         * 对path坐标进行调整
         * 
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
