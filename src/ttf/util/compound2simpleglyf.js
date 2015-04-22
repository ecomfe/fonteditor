/**
 * @file ttf复合字形转简单字形
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        var pathCeil = require('graphics/pathCeil');
        var pathTransform = require('graphics/pathTransform');
        var lang = require('common/lang');
        /**
         * ttf复合字形转简单字形
         *
         * @param  {Object} glyf glyf对象
         * @param  {Object} ttf ttfObject对象
         * @return {Object} 转换后的对象
         */
        function compound2simpleglyf(glyf, ttf) {

            if (!glyf.compound || !glyf.glyfs) {
                return glyf;
            }

            var glyfs = glyf.glyfs;
            var compoundContours = [];
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
                    compoundContours.push(pathCeil(contours[i]));
                }
            });

            glyf.contours = compoundContours;

            delete glyf.compound;
            delete glyf.glyfs;
            // 这里hinting信息会失效，删除hinting信息
            delete glyf.instructions;

            return glyf;
        }

        return compound2simpleglyf;
    }
);
