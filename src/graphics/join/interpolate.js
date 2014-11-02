/**
 * @file interpolate.js
 * @author mengke01
 * @date 
 * @description
 * 对路径进行插值，以便于计算
 */


define(
    function(require) {
        
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

        return interpolate;
    }
);
