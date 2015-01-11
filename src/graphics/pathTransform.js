/**
 * @file transform.js
 * @author mengke01
 * @date
 * @description
 * 对轮廓进行transform变换
 *
 * 参考资料：
 * http://blog.csdn.net/henren555/article/details/9699449
 *
 *  |X|    |a      c       e|    |x|
 *  |Y| =  |b      d       f| *  |y|
 *  |1|    |0      0       1|    |1|
 *
 *  X = x * a + y * c + e
 *  Y = x * b + y * d + f
 */


define(
    function (require) {

        /* eslint-disable max-params */
        /**
         * 图形仿射矩阵变换
         *
         * @param {Array.<Object>} contour 轮廓点
         * @param {number} a m11
         * @param {number} b m12
         * @param {number} c m21
         * @param {number} d m22
         * @param {number} e dx
         * @param {number} f dy
         * @return {Array.<Object>} contour 轮廓点
         */
        function transform(contour, a, b, c, d, e, f) {
            var x;
            var y;
            var p;
            for (var i = 0, l = contour.length; i < l; i++) {
                p = contour[i];
                x = p.x;
                y = p.y;
                p.x = x * a + y * c + e;
                p.y = x * b + y * d + f;
            }
            return contour;
        }
        /* eslint-enable max-params */

        return transform;
    }
);
