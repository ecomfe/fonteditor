/**
 * @file pathUtil.js
 * @author mengke01
 * @date
 * @description
 * 路径相关的函数集合
 */


define(
    function (require) {


        /**
         * 对路径进行插值，补全省略的点
         *
         * @param {Array} path 路径
         * @return {Array} 路径
         */
        function interpolate(path) {
            var newPath = [];
            for (var i = 0, l = path.length; i < l; i++) {
                var next = i === l - 1 ? 0 : i + 1;
                newPath.push(path[i]);
                // 插值
                if (!path[i].onCurve && !path[next].onCurve) {
                    newPath.push({
                        x: (path[i].x + path[next].x) / 2,
                        y: (path[i].y + path[next].y) / 2,
                        onCurve: true
                    });
                }
            }

            return newPath;
        }


        /**
         * 去除路径中的插值点
         *
         * @param {Array} path 路径
         * @return {Array} 路径
         */
        function deInterpolate(path) {
            var newPath = [];

            for (var i = 0, l = path.length; i < l; i++) {
                var next = i === l - 1 ? 0 : i + 1;
                var prev = i === 0 ? l - 1 : i - 1;
                // 插值
                if (
                    !path[prev].onCurve && path[i].onCurve && !path[next].onCurve
                    && Math.abs(2 * path[i].x - path[prev].x - path[next].x) < 0.001
                    && Math.abs(2 * path[i].y - path[prev].y - path[next].y) < 0.001
                ) {
                    continue;
                }

                newPath.push(path[i]);
            }

            return newPath;
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
                var prev = i === 0 ? path[l - 1] : path[i - 1];
                var next = i === l - 1 ? path[0] : path[i + 1];
                var z = (cur.x - prev.x) * (next.y - cur.y)
                    - (cur.y - prev.y) * (next.x - cur.x);

                if (z < 0) {
                    zCount--;
                }
                else if (z > 0) {
                    zCount++;
                }
            }

            return zCount === 0
                ? 0
                : zCount  < 0 ? 1 : -1;
        }

        /**
         * 获取点的hash
         * @param {Object} p 点对象
         *
         * @return {number} 哈希值
         */
        function getPointHash(p) {
            return (p.x * 31 + p.y) * 31 + (p.onCurve ? 1 : 0);
        }

        /**
         * 获取路径哈希
         * @param {Array} path 路径数组
         *
         * @return {number} 哈希值
         */
        function getPathHash(path) {
            var hash = 0;
            var seed = 131;

            path.forEach(function (p) {
                hash = 0x7FFFFFFF & (hash * seed + getPointHash(p));
            });

            return hash;
        }


        /**
         * 移除重复点
         *
         * @param {Array} points 点集合
         * @return {Array} 移除后点集合
         */
        function removeOverlapPoints(points) {
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
            interpolate: interpolate,
            deInterpolate: deInterpolate,
            isClockWise: isClockWise,
            removeOverlapPoints: removeOverlapPoints,
            getPointHash: getPointHash,
            getPathHash: getPathHash
        };
    }
);
