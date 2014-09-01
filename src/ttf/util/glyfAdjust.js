/**
 * @file glyfAdjust.js
 * @author mengke01
 * @date 
 * @description
 * 将glyf坐标系平移到原点
 */


define(
    function(require) {
        
        /**
         * 对glyf坐标进行调整
         * 
         * @param {Object} glyf glyf结构
         * @param {number} scale 缩放比例
         * @param {number} offsetX x偏移
         * @param {number} offsetY y偏移
         * @return {number} glyf结构
         */
        function glyfAdjust(glyf, scale, offsetX, offsetY) {

            // 对轮廓进行反向，以及坐标系调整，取整
            var xOffset = -glyf.xMin;
            var yOffset = -glyf.yMin;
            var middleYx2 = glyf.yMax + glyf.yMin;
            var scale = scale || 1;
            var x = offsetX || 0;
            var y = offsetY || 0;
            var coordinates = [];

            glyf.coordinates.forEach(function(p) {
                coordinates.push({
                    x: x + scale * (p.x + xOffset),
                    y: y + scale * (middleYx2 - p.y + yOffset),
                    isOnCurve: p.isOnCurve
                });
            });

            glyf.xMin = x;
            glyf.yMin = y;
            glyf.xMax = scale * (glyf.xMax - glyf.xMin) + x;
            glyf.yMax = scale * (glyf.yMax - glyf.yMin) + y;
            glyf.coordinates = coordinates;

            return glyf;
        }

        return glyfAdjust;
    }
);
