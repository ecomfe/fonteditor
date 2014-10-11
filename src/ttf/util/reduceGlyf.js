/**
 * @file reduceGlyf.js
 * @author mengke01
 * @date 
 * @description
 * 缩减glyf大小，去除冗余节点
 */


define(
    function(require) {

        /**
         * 判断点是否多余的点
         * 
         * @param {Object} p 当前
         * @param {Object} prev 上一个
         * @param {Object} next 下一个
         * @return {boolean}
         */
        function redundant(p, prev, next) {

            // 是否重合的点, 只有两个点同在曲线上或者同不在曲线上移出
            if ( Math.pow(p.x - next.x, 2) + Math.pow(p.y - next.y, 2) <= 1) {
                return !p.onCurve ^ !!next.onCurve;
            }
            
            // 三点同线
            // else if ((next.y - p.y) * (prev.x - p.x) == (prev.y - p.y) * (next.x - p.x)) {
            //     return p.onCurve && prev.onCurve && next.onCurve;
            // }

            return false;
        }

        /**
         * 缩减glyf，去除冗余节点
         * 
         * @param {Object} glyf glyf对象
         * @return {Object} glyf对象
         */
        function reduceGlyf(glyf) {

            var contours = glyf.contours, contour, prev;
            for(var j = 0, cl = contours.length; j < cl; j++) {
                contour = contours[j];

                for(var i = contour.length - 1, last = i; i >= 0; i--) {

                    // 这里注意逆序
                    next = i === last ? contour[0] : contour[i + 1];
                    prev = i === 0 ? contour[last] : contour[i - 1];
                    p = contour[i];

                    if (redundant(p, prev, next)) {
                        contour.splice(i, 1);
                        last--;
                        continue;
                    }
                }
            }
        }

        return reduceGlyf;
    }
);
