/**
 * @file glyf2svg.js
 * @author mengke01
 * @date 
 * @description
 * glyf转换svg
 * 
 * thanks to：
 * ynakajima/ttf.js
 * https://github.com/ynakajima/ttf.js
 */


define(
    function(require) {
        var contour2svg = require('./contour2svg');
        var glyfAdjust = require('ttf/util/glyfAdjust');

        /**
         * glyf转换svg 
         * 
         * @param {Object} glyf 解析后的glyf结构
         * @return {string} svg文本
         */
        function glyf2svg(glyf, options) {
            if(!glyf) {
                return null;
            }
            var pathArray = [];


            // 对轮廓进行反向，以及坐标系调整，取整
            glyf = glyfAdjust(glyf, options.scale, options.x, options.y);

            var contours = glyf.contours;
            
            for ( var i = 0, l = contours.length; i < l; i++) {
                pathArray.push(contour2svg(contours[i]));
            }

            return pathArray.join(" ");
        }



        return glyf2svg;
    }
);
