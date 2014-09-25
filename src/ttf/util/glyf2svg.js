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
        var pathAdjust = require('graphics/pathAdjust');
        var matrixTransform = require('graphics/transform');

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
            var contours = glyf.contours;
            var height = glyf.yMax;
            var x = options.x || 0;
            var y = height + (options.y || 0);
            var scale = options.scale || 1;


            if (!glyf.compound) {
                for ( var i = 0, l = contours.length; i < l; i++) {
                    pathAdjust(contours[i], 1, -1);
                    pathAdjust(contours[i], scale, scale, x, y);
                    pathArray.push(contour2svg(contours[i]));
                }
            }
            else {
                var glyfs = glyf.glyfs;
                glyfs.forEach(function(g) {
                    var contours = g.glyf.contours;
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
                        pathAdjust(contours[i], 1, -1);
                        pathAdjust(contours[i], scale, scale, x, y);
                        pathArray.push(contour2svg(contours[i]));
                    }
                });
            }

            return pathArray.join(' ');
        }



        return glyf2svg;
    }
);
