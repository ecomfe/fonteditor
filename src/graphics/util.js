/**
 * @file grahpics点相关工具箱
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        /**
         * 将点进行误差舍入
         *
         * @param {Object} p 点对象
         * @return {Object} 点
         */
        function ceilPoint(p) {
            var t = p.x;

            // 处理形如 4.99999 = 5, 5.00001 = 5的情况
            if (Math.abs(Math.round(t) - t) < 0.00002) {
                p.x = Math.round(t);
            }
            else {
                p.x = Math.round(p.x * 100000) / 100000;
            }

            t = p.y;
            if (Math.abs(Math.round(t) - t) < 0.00005) {
                p.y = Math.round(t);
            }
            else {
                p.y = Math.round(p.y * 100000) / 100000;
            }

            return p;
        }

        /**
         * 将数值进行误差舍入
         *
         * @param {Object} x 数值
         * @return {number} 点
         */
        function ceil(x) {
            if (Math.abs(Math.round(x) - x) < 0.00002) {
                return Math.round(x);
            }

            return Math.round(x * 100000) / 100000;
        }

        /**
         * 判断点是否在bounding box内部
         * @param {Object} bound bounding box对象
         * @param {Object} p 点对象
         * @param {boolean=} fixed 是否四舍五入
         * @return {boolean} 是否
         */
        function isPointInBound(bound, p, fixed) {

            if (fixed) {
                return ceil(p.x) <= ceil(bound.x + bound.width)
                    && ceil(p.x) >= ceil(bound.x)
                    && ceil(p.y) <= ceil(bound.y + bound.height)
                    && ceil(p.y) >= ceil(bound.y);
            }

            return p.x <= bound.x + bound.width
                && p.x >= bound.x
                && p.y <= bound.y + bound.height
                && p.y >= bound.y;
        }

        /**
         * 判断点是否重合
         *
         * @param {Object} p0 p0
         * @param {Object} p1 p1
         * @return {boolean} 是否
         */
        function isPointOverlap(p0, p1) {
            return ceil(p0.x) === ceil(p1.x) && ceil(p0.y) === ceil(p1.y);
        }


        /**
         * 获取点的hash值
         *
         * @param {Object} p p
         * @param {Object} p1 p1
         * @return {number}
         */
        function getPointHash(p) {
            return Math.floor(7 * Math.floor(p.x * 10) + 131 * Math.floor(p.y * 100));
        }

        return {
            ceil: ceil,
            ceilPoint: ceilPoint,
            isPointInBound: isPointInBound,
            isPointOverlap: isPointOverlap,
            getPointHash: getPointHash
        };
    }
);
