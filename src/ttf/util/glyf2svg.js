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
        var contours2svg = require('./contours2svg');
        var pathAdjust = require('graphics/pathAdjust');
        var matrixTransform = require('graphics/transform');
        var lang = require('common/lang');

        /**
         * glyf转换svg 
         * 
         * @param {Object} glyf 解析后的glyf结构
         * @return {string} svg文本
         */
        function glyf2svg(glyf, ttf) {

            if(!glyf) {
                return '';
            }

            var pathArray = [];

            if (!glyf.compound) {
                if (glyf.contours && glyf.contours.length) {
                    pathArray.push(contours2svg(glyf.contours));
                }

            }
            else {
                var glyfs = glyf.glyfs;
                glyfs.forEach(function(g) {
                    var compound = ttf.glyf[g.glyphIndex];
                    var contours = lang.clone(compound.contours); // 这里需要进行matrix变换，需要复制一份
                    var transform = g.transform;
                    for ( var i = 0, l = contours.length; i < l; i++) {
                        matrixTransform(contours[i], 
                            transform.a,
                            transform.b,
                            transform.c,
                            transform.d,
                            transform.e,
                            transform.f
                        );
                        pathArray.push(contour2svg(contours[i]));
                    }
                });
            }

            return pathArray.join(' ');
        }



        return glyf2svg;
    }
);
