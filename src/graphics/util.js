/**
 * @file matrix.js
 * @author mengke01
 * @date 
 * @description
 * 相关工具箱
 */


define(
    function(require) {

        /**
         * 将点进行误差舍入
         * 
         * @param {Object} p 点对象
         * 
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
         * 
         * @return {number} 点
         */
        function ceil(x) {
            if (Math.abs(Math.round(x) - x) < 0.00002) {
                return Math.round(x);
            }
            else {
                return Math.round(x * 100000) / 100000;
            }
        }

        /**
         * 判断点是否在bounding box内部
         * @param {Object} bound bounding box对象
         * @param {Object} p 点对象
         * 
         * @return {boolean} 是否
         */
        function isPointInBound(bound, p, fixed) {
            if(fixed) {
                return ceil(p.x) <= ceil(bound.x + bound.width)
                    && ceil(p.x) >= ceil(bound.x)
                    && ceil(p.y) <= ceil(bound.y + bound.height)
                    && ceil(p.y) >= ceil(bound.y);
            }
            else {
                return p.x <= bound.x + bound.width 
                    && p.x >= bound.x
                    && p.y <= bound.y + bound.height
                    && p.y >= bound.y;
            }
        }

        /**
         * 判断路径的方向是否顺时针
         * see:
         * http://debian.fmi.uni-sofia.bg/~sergei/cgsr/docs/clockwise.htm
         * @param {Array} path 路径
         * @return {number} 0 无方向 1 clockwise, -1 counter clockwise
         */
        function isClockWise(path) {

            if (path.length < 3) {
                return 0;
            }

            var zCount = 0;
            for (var i = 0, l = path.length; i < l; i++) {
                var cur = path[i];
                var prev = i == 0 ? path[l - 1] : path[i - 1];
                var next = i == l - 1 ? path[0] : path[i + 1];

                var z = (cur.x - prev.x) * (next.y - cur.y) - (cur.y - prev.y) * (next.x - cur.x);
                if (z < 0) {
                    zCount--;
                }
                else if (z > 0){
                    zCount++;
                }
            }

            return zCount == 0 
                ? 0 
                : zCount  < 0 ? 1 : -1;
        }


        /**
         * 获取点的hash
         * 
         * @return {number} 哈希值
         */
        function getPointHash(p) {
            return (p.x * 31 + p.y) * 31 + (p.onCurve ? 1 : 0);
        }
        
        /**
         * 移除重复点
         * 
         * @param {Array} points 点集合
         * @return {Array} 移除后点集合
         */
        function removeOverlap(points) {
            var hash = {};
            var ret = [];
            for (var i = 0, l = points.length; i < l ; i++) {
                var hashcode = points[i].x * 31 + points[i].y;
                if (!hash[hashcode]) {
                    ret.push(points[i]);
                    hash[hashcode] = 1;
                }
            }
            return ret;
        }

        return {
            ceil: ceil,
            ceilPoint: ceilPoint,
            isPointInBound: isPointInBound,
            isClockWise: isClockWise,
            removeOverlap: removeOverlap,
            getPointHash: getPointHash
        };
    }
);