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
            p.x = Math.round(p.x * 100000) / 100000;
            p.y = Math.round(p.y * 100000) / 100000;
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
            return Math.round(x * 100000) / 100000;
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
         * @return {number} 0 无方向 1 clockwise, 2 counter clockwise
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
         * 对路径进行插值，补全省略的点
         * 
         * @param {Array} path 路径
         * @return {Array} 路径
         */
        function interpolate(path) {
            var newPath = [];
            for (var i = 0, l = path.length; i < l; i++) {
                var next = i == l - 1 ? 0 : i + 1;
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
                var next = i == l - 1 ? 0 : i + 1;
                var prev = i == 0 ? l - 1 : i - 1;
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


        return {
            ceil: ceil,
            ceilPoint: ceilPoint,
            isPointInBound: isPointInBound,
            isClockWise: isClockWise,
            interpolate: interpolate,
            deInterpolate: deInterpolate
        };
    }
);