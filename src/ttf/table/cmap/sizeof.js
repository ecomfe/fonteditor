/**
 * @file 获取cmap表的大小
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {


        /**
         * 获取format4 delta值
         * Delta is saved in signed int in cmap format 4 subtable,
         * but can be in -0xFFFF..0 interval.
         * -0x10000..-0x7FFF values are stored with offset.
         *
         * @param {number} delta delta值
         * @return {number} delta值
         */
        function encodeDelta(delta) {
            return delta > 0x7FFF
                ? delta - 0x10000
                : (delta < -0x7FFF ? delta + 0x10000 : delta);
        }

        /**
         * 根据bound获取glyf segment
         *
         * @param {Array} glyfUnicodes glyf编码集合
         * @param {number} bound 编码范围
         * @return {Array} 码表
         */
        function getSegments(glyfUnicodes, bound) {

            var prevGlyph = null;
            var result = [];
            var segment = {};

            glyfUnicodes.forEach(function (glyph) {

                if (bound === undefined || glyph.unicode <= bound) {
                    // 初始化编码头部，这里unicode和graph id 都必须连续
                    if (prevGlyph === null
                        || glyph.unicode !== prevGlyph.unicode + 1
                        || glyph.id !== prevGlyph.id + 1
                    ) {
                        if (prevGlyph !== null) {
                            segment.end = prevGlyph.unicode;
                            result.push(segment);
                            segment = {
                                start: glyph.unicode,
                                startId: glyph.id,
                                delta: encodeDelta(glyph.id - glyph.unicode)
                            };
                        }
                        else {
                            segment.start = glyph.unicode;
                            segment.startId = glyph.id;
                            segment.delta = encodeDelta(glyph.id - glyph.unicode);
                        }
                    }

                    prevGlyph = glyph;
                }
            });

            // need to finish the last segment
            if (prevGlyph !== null) {
                segment.end = prevGlyph.unicode;
                result.push(segment);
            }

            // 返回编码范围
            return result;
        }

        /**
         * 获取format0编码集合
         *
         * @param {Array} glyfUnicodes glyf编码集合
         * @return {Array} 码表
         */
        function getFormat0Segment(glyfUnicodes) {
            var unicodes = [];
            glyfUnicodes.forEach(function (u) {
                if (u.unicode !== undefined && u.unicode < 256) {
                    unicodes.push([u.unicode, u.id]);
                }
            });

            // 按编码排序
            unicodes.sort(function (a, b) {
                return a[0] - b[0];
            });

            return unicodes;
        }

        /**
         * 对cmap数据进行预处理，获取大小
         *
         * @param  {Object} ttf ttf对象
         * @return {number} 大小
         */
        function sizeof(ttf) {
            ttf.support.cmap = {};
            var glyfUnicodes = [];
            ttf.glyf.forEach(function (glyph, index) {

                var unicodes = glyph.unicode;

                if (typeof glyph.unicode === 'number') {
                    unicodes = [glyph.unicode];
                }

                if (unicodes && unicodes.length) {
                    unicodes.forEach(function (unicode) {
                        glyfUnicodes.push({
                            unicode: unicode,
                            id: unicode !== 0xFFFF ? index : 0
                        });
                    });
                }

            });

            glyfUnicodes = glyfUnicodes.sort(function (a, b) {
                return a.unicode - b.unicode;
            });

            ttf.support.cmap.unicodes = glyfUnicodes;

            var unicodes2Bytes = glyfUnicodes;

            ttf.support.cmap.format4Segments = getSegments(unicodes2Bytes, 0xFFFF);
            ttf.support.cmap.format4Size = 24
                + ttf.support.cmap.format4Segments.length * 8;

            ttf.support.cmap.format0Segments = getFormat0Segment(glyfUnicodes);
            ttf.support.cmap.format0Size = 262;

            // we need subtable 12 only if found unicodes with > 2 bytes.
            var hasGLyphsOver2Bytes = unicodes2Bytes.some(function (glyph) {
                return glyph.unicode > 0xFFFF;
            });

            if (hasGLyphsOver2Bytes) {
                ttf.support.cmap.hasGLyphsOver2Bytes = hasGLyphsOver2Bytes;

                var unicodes4Bytes = glyfUnicodes;

                ttf.support.cmap.format12Segments = getSegments(unicodes4Bytes);
                ttf.support.cmap.format12Size = 16
                    + ttf.support.cmap.format12Segments.length * 12;
            }

            var size = 4 + (hasGLyphsOver2Bytes ? 32 : 24) // cmap header
                + ttf.support.cmap.format0Size // format 0
                + ttf.support.cmap.format4Size // format 4
                + (hasGLyphsOver2Bytes ? ttf.support.cmap.format12Size : 0); // format 12

            return size;
        }


        return sizeof;
    }
);
