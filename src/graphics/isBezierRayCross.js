/**
 * @file isBezierRayCross.js
 * @author mengke01
 * @date 
 * @description
 * 判断x轴射线是否与贝塞尔曲线相交
 */


define(
    function(require) {
        var computeBoundingBox = require('./computeBoundingBox');
        var isBezierLineCross = require('./isBezierLineCross');
        var isPointInBound = require('./util').isPointInBound;

        /**
         * 判断x轴射线是否与贝塞尔曲线相交
         * 
         * @return {Array|boolean} 交点数组或者false
         */
        function isBezierRayCross(p0, p1, p2, p) {
            
            // 3点都在同一侧
            if(!((p0.y > p.y) + (p1.y > p.y) + (p2.y > p.y)) % 3) {
                return false;
            }

            var result = isBezierLineCross(p0, p1, p2, p, {x: 100000, y: p.y});
            if (result) {
                var filter = result.filter(function(item) {
                    return item.x >= p.x;
                });
                return filter.length ? filter : false;
            }

            return false;
        }


        return isBezierRayCross;
    }
);
