/**
 * @file glyf转换svg
 * @author mengke01(kekee000@gmail.com)
 *
 * thanks to：
 * ynakajima/ttf.js
 * https://github.com/ynakajima/ttf.js
 */


define(
    function (require) {

        var contour2svg = require('./contour2svg');
        var contours2svg = require('./contours2svg');
        var pathTransform = require('graphics/pathTransform');
        var lang = require('common/lang');

        /**
         * glyf转换svg
         *
         * @param {Object} glyf 解析后的glyf结构
         * @param {Object} ttf ttf对象
         * @return {string} svg文本
         */
        function glyf2svg(glyf, ttf) {

            if (!glyf) {
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
                glyfs.forEach(function (g) {
                    var glyph = ttf.glyf[g.glyphIndex];

                    if (!glyph) {
                        return;
                    }

                    var contours = lang.clone(glyph.contours); // 这里需要进行matrix变换，需要复制一份
                    var transform = g.transform;
                    for (var i = 0, l = contours.length; i < l; i++) {
                        pathTransform(
                            contours[i],
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
