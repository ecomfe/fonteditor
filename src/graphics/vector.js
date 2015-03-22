/**
 * @file 向量相关操作
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        /**
         * 获取向量夹角余弦，传入3个点或者向量的x1, y1, x2, y2
         *
         * @param  {Object} p0 p0
         * @param  {Object} p1 p1
         * @param  {Object} p2 p2
         * @param  {?Object} p3 p3
         * @return {number}    夹角余弦
         */
        function getCos(p0, p1, p2, p3) {
            var x1;
            var y1;
            var x2;
            var y2;
            if (typeof p0 === 'number') {
                x1 = p0;
                y1 = p1;
                x2 = p2;
                y2 = p3;
            }
            else {
                x1 = p1.x - p0.x;
                y1 = p1.y - p0.y;
                x2 = p2.x - p1.x;
                y2 = p2.y - p1.y;
            }

            return (x1 * x2 + y1 * y2) / Math.sqrt(x1 * x1 + y1 * y1) / Math.sqrt(x2 * x2 + y2 * y2);
        }

        /**
         * 求点到向量的距离平方
         *
         * @param  {Object} p0 p0
         * @param  {Object} p1 p1
         * @param  {Object} p  p
         * @return {number} 距离
         */
        function getDistPow(p0, p1, p) {
            var x = p.x;
            var y = p.y;
            var x1 = p0.x;
            var y1 = p0.y;
            var x2 = p1.x;
            var y2 = p1.y;
            var cross = (x2 - x1) * (x - x1) + (y2 - y1) * (y - y1);

            if (cross <= 0) {
                return ((x - x1) * (x - x1) + (y - y1) * (y - y1));
            }

            var d2 = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);

            if (cross >= d2) {
                return ((x - x2) * (x - x2) + (y - y2) * (y - y2));
            }

            var r = cross / d2;
            var px = x1 + (x2 - x1) * r;
            var py = y1 + (y2 - y1) * r;

            return ((x - px) * (x - px) + (py - y1) * (py - y1));
        }

        /**
         * 求点到向量的距离
         *
         * @param  {Object} p0 p0
         * @param  {Object} p1 p1
         * @param  {Object} p  p
         * @return {number} 距离
         */
        function getDist(p0, p1, p) {
            return Math.sqrt(getDistPow(p0, p1, p));
        }


        return {
            getCos: getCos,
            getDist: getDist,
            getDistPow: getDistPow
        };
    }
);
