/**
 * @file deInterpolate.js
 * @author mengke01
 * @date 
 * @description
 * 对路径去除插值
 */


define(
    function(require) {
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
        
        return deInterpolate;
    }
);
