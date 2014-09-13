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
            var middleYx2 = glyf.yMax + glyf.yMin;
            var scale = scale || 1;
            var x = offsetX || 0;
            var y = offsetY || 0;

            glyf.contours.forEach(function (path) {
                path.forEach(function(p) {
                    p.x = x + scale * (p.x);
                    p.y = y + scale * (middleYx2 - p.y);
                });
            });

            glyf.xMin = x + glyf.xMin * scale;
            glyf.yMin = y + glyf.yMin * scale;
            glyf.xMax = x + glyf.xMax * scale;
            glyf.yMax = y + glyf.yMax * scale;
            
            return glyf;
        }

        return glyfAdjust;
    }
);
