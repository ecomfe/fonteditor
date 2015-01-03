/**
 * @file cmapwriter.js
 * @author mengke01
 * @date
 * @description
 * cmap 写方法
 * thanks to fontello/svg2ttf
 * @reference
 * https://github.com/fontello/svg2ttf/blob/master/lib/ttf/tables/cmap.js
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
         * 创建`子表0`
         *
         * @param {Writer} writer 写对象
         * @param {Array} unicodes unicodes列表
         * @return {Writer}
         */
        function writeSubTable0(writer, unicodes) {

            writer.writeUint16(0); // format
            writer.writeUint16(262); // length
            writer.writeUint16(0); // language

            // Array of unicodes 0..255
            var i = -1;
            var unicode;
            while ((unicode = unicodes.shift())) {
                while (++i < unicode[0]) {
                    writer.writeUint8(0);
                }

                writer.writeUint8(unicode[1]);
                i = unicode[0];
            }

            while (++i < 256) {
                writer.writeUint8(0);
            }

            return writer;
        }


        /**
         * 创建`子表4`
         *
         * @param {Writer} writer 写对象
         * @param {Array} segments 分块编码列表
         * @return {Writer}
         */
        function writeSubTable4(writer, segments) {

            writer.writeUint16(4); // format
            writer.writeUint16(24 + segments.length * 8); // length
            writer.writeUint16(0); // language

            var segCount = segments.length + 1;
            var maxExponent = Math.floor(Math.log(segCount) / Math.LN2);
            var searchRange = 2 * Math.pow(2, maxExponent);

            writer.writeUint16(segCount * 2); // segCountX2
            writer.writeUint16(searchRange); // searchRange
            writer.writeUint16(maxExponent); // entrySelector
            writer.writeUint16(2 * segCount - searchRange); // rangeShift

            // end list
            segments.forEach(function (segment) {
                writer.writeUint16(segment.end);
            });
            writer.writeUint16(0xFFFF); // end code
            writer.writeUint16(0); // reservedPad


            // start list
            segments.forEach(function (segment) {
                writer.writeUint16(segment.start);
            });
            writer.writeUint16(0xFFFF); // start code

            // id delta
            segments.forEach(function (segment) {
                writer.writeUint16(segment.delta);
            });
            writer.writeUint16(1);

            // Array of range offsets, it doesn't matter when deltas present
            for (var i = 0, l = segments.length; i < l; i++) {
                writer.writeUint16(0);
            }
            writer.writeUint16(0); // rangeOffsetArray should be finished with 0

            return writer;
        }

        /**
         * 创建`子表12`
         *
         * @param {Writer} writer 写对象
         * @param {Array} segments 分块编码列表
         * @return {Writer}
         */
        function writeSubTable12(writer, segments) {

            writer.writeUint16(12); // format
            writer.writeUint16(0); // reserved
            writer.writeUint32(16 + segments.length * 12); // length
            writer.writeUint32(0); // language
            writer.writeUint32(segments.length); // nGroups

            segments.forEach(function (segment) {
                writer.writeUint32(segment.start);
                writer.writeUint32(segment.end);
                writer.writeUint32(segment.startId);
            });

            return writer;
        }

        /**
         * 写subtableheader
         *
         * @param {Writer} writer Writer对象
         * @param {number} platform 平台
         * @param {number} encoding 编码
         * @param {number} offset 偏移
         * @return {Writer}
         */
        function writeSubTableHeader(writer, platform, encoding, offset) {
            writer.writeUint16(platform); // platform
            writer.writeUint16(encoding); // encoding
            writer.writeUint32(offset); // offset
            return writer;
        }


        var writer = {

            write: function (writer, ttf) {

                var hasGLyphsOver2Bytes = ttf.support.cmap.hasGLyphsOver2Bytes;

                // write table header.
                writer.writeUint16(0); // version
                writer.writeUint16(hasGLyphsOver2Bytes ? 4 : 3); // count

                // header size
                var subTableOffset = 4 + (hasGLyphsOver2Bytes ? 32 : 24);
                var format4Size = ttf.support.cmap.format4Size;
                var format0Size = ttf.support.cmap.format0Size;

                // subtable 4, unicode
                writeSubTableHeader(writer, 0, 3, subTableOffset);

                // subtable 0, mac standard
                writeSubTableHeader(writer, 1, 0, subTableOffset + format4Size);

                // subtable 4, windows standard
                writeSubTableHeader(writer, 3, 1, subTableOffset);

                if (hasGLyphsOver2Bytes) {
                    writeSubTableHeader(writer, 3, 10, subTableOffset + format4Size + format0Size);
                }

                // write tables, order of table seem to be magic, it is taken from TTX tool
                writeSubTable4(writer, ttf.support.cmap.format4Segments);
                writeSubTable0(writer, ttf.support.cmap.format0Segments);

                if (hasGLyphsOver2Bytes) {
                    writeSubTable12(writer, ttf.support.cmap.format12Segments);
                }


                return writer;
            },

            size: function (ttf) {
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
        };

        return writer;
    }
);
