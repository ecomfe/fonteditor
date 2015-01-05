/**
 * @file glyfAdjust.js
 * @author mengke01
 * @date
 * @description
 * glyf调整
 */


define(
    function (require) {

        var pathAdjust = require('graphics/pathAdjust');
        var pathCeil = require('graphics/pathCeil');
        var computeBoundingBox = require('graphics/computeBoundingBox');

        /* eslint-disable max-params */
        /**
         * 简单字形的缩放和平移调整
         *
         * @param {Object} g glyf对象
         * @param {number} scaleX x缩放比例
         * @param {number} scaleY y缩放比例
         * @param {number} offsetX x偏移
         * @param {number} offsetY y偏移
         * @param {boolan} ceil 是否对字形设置取整，默认取整
         *
         * @return {Object} 调整后的glyf对象
         */
        function glyfAdjust(g, scaleX, scaleY, offsetX, offsetY, ceil) {

            scaleX = scaleX || 1;
            scaleY = scaleY || 1;
            offsetX = offsetX || 0;
            offsetY = offsetY || 0;

            if (g.contours && g.contours.length) {
                if (scaleX !== 1 || scaleY !== 1) {
                    g.contours.forEach(function (contour) {
                        pathAdjust(contour, scaleX, scaleY);
                    });
                }

                if (offsetX !== 0 || offsetY !== 0) {
                    g.contours.forEach(function (contour) {
                        pathAdjust(contour, 1, 1, offsetX, offsetY);
                    });
                }

                if (false !== ceil) {
                    g.contours.forEach(function (contour) {
                        pathCeil(contour);
                    });
                }
            }

            // 重新计算xmin，xmax，ymin，ymax
            var advanceWidth = g.advanceWidth;
            if (
                undefined === g.xMin
                || undefined === g.yMax
                || undefined === g.leftSideBearing
                || undefined === g.advanceWidth
            ) {
                // 有的字形没有形状，需要特殊处理一下
                var bound;
                if (g.contours && g.contours.length) {
                    bound = computeBoundingBox.computePathBox.apply(this, g.contours);
                }
                else {
                    bound = {
                        x: 0,
                        y: 0,
                        width: 0,
                        height: 0
                    };
                }

                g.xMin = bound.x;
                g.xMax = bound.x + bound.width;
                g.yMin = bound.y;
                g.yMax = bound.y + bound.height;

                g.leftSideBearing = g.xMin;

                // 如果设置了advanceWidth就是用默认的，否则为xMax + abs(xMin)
                if (undefined !== advanceWidth) {
                    g.advanceWidth = Math.round(advanceWidth * scaleX + offsetX);
                }
                else {
                    g.advanceWidth = g.xMax + Math.abs(g.xMin);
                }
            }
            else {
                g.xMin = Math.round(g.xMin * scaleX + offsetX);
                g.xMax = Math.round(g.xMax * scaleX + offsetX);
                g.yMin = Math.round(g.yMin * scaleY + offsetY);
                g.yMax = Math.round(g.yMax * scaleY + offsetY);
                g.leftSideBearing = Math.round(g.leftSideBearing * scaleX + offsetX);
                g.advanceWidth = Math.round(advanceWidth * scaleX + offsetX);
            }

            return g;
        }
        /* eslint-enable max-params */

        return glyfAdjust;
    }
);
