/**
 * @file compoundGlyf.js
 * @author mengke01
 * @date
 * @description
 * 复合字形相关的工具函数
 */


define(
    function (require) {

        var matrixTransform = require('./transform');
        var computeBoundingBox = require('./computeBoundingBox');
        var lang = require('common/lang');

        /**
         * 获取复合字形的边界
         *
         * @param {Object} glyf 复合字形
         * @return {Object} bound对象
         */
        function getGlyfBound(glyf) {
            var points = [];
            var glyfs = glyf.glyfs;

            glyfs.forEach(function (g) {
                var glyph = g.glyf;

                if (!glyph || !glyph.contours) {
                    return;
                }
                var bound = getContoursBound(glyph.contours, glyph.transform);
                points.push(bound, {
                    x: bound.x + bound.width,
                    y: bound.y + bound.height
                });
            });

            return computeBoundingBox.computeBounding(points);
        }

        /**
         * 获取变换后的contours边界
         *
         * @param {Object} contours glyf独享
         * @param {Object} transform 变换参数
         * @return {Object} bound对象
         */
        function getContoursBound(contours, transform) {
            var cloned = lang.clone(contours);
            if (transform) {
                matrixTransform(cloned,
                    transform.a,
                    transform.b,
                    transform.c,
                    transform.d,
                    transform.e,
                    transform.f
                );
            }
            return computeBoundingBox.computePathBox.apply(null, cloned);
        }


        return {
            getGlyfBound: getGlyfBound,
            getContoursBound: getContoursBound
        };
    }
);
