/**
 * @file reducePath.js
 * @author mengke01
 * @date
 * @description
 * 缩减glyf大小，去除冗余节点
 */


define(
    function (require) {

        /**
         * 判断点是否多余的点
         *
         * @param {Object} prev 上一个
         * @param {Object} p 当前
         * @param {Object} next 下一个
         * @return {boolean}
         */
        function redundant(prev, p, next) {

            // 是否重合的点, 只有两个点同在曲线上或者同不在曲线上移出
            if (
                (p.onCurve && next.onCurve || !p.onCurve && !next.onCurve)
                && Math.pow(p.x - next.x, 2) + Math.pow(p.y - next.y, 2) <= 1
            ) {
                return true;
            }

            // 三点同线 检查直线点
            if (
                (p.onCurve && prev.onCurve && next.onCurve)
                && Math.abs((next.y - p.y) * (prev.x - p.x) - (prev.y - p.y) * (next.x - p.x)) <= 0.001
            ) {
                return true;
            }

            // 三点同线 检查控制点
            if (
                (!p.onCurve && prev.onCurve && next.onCurve)
                && Math.abs((next.y - p.y) * (prev.x - p.x) - (prev.y - p.y) * (next.x - p.x)) <= 0.001
            ) {
                return true;
            }

            return false;
        }

        /**
         * 缩减glyf，去除冗余节点
         *
         * @param {Array} contour 路径对象
         * @return {Array} 路径对象
         */
        function reducePath(contour) {

            if (!contour.length) {
                return contour;
            }

            var prev;
            var next;
            var p;
            for (var i = contour.length - 1, last = i; i >= 0; i--) {

                // 这里注意逆序
                p = contour[i];
                next = i === last ? contour[0] : contour[i + 1];
                prev = i === 0 ? contour[last] : contour[i - 1];

                if (redundant(prev, p, next)) {
                    contour.splice(i, 1);
                    last--;
                    continue;
                }
            }

            return contour;
        }

        return reducePath;
    }
);
