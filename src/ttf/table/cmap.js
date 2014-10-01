/**
 * @file cmap.js
 * @author mengke01
 * @date 
 * @description
 * cmap 表
 */

define(
    function(require) {
        var lang = require('common/lang');
        var table = require('./table');

        /**
         * 读取子表
         * Each 'cmap' subtable is in one of nine currently available
         *  formats. These are format 0, format 2, format 4,
         *  format 6, format 8.0, format 10.0, format 12.0,
         *  format 13.0, and format 14 described in the next section.
         * https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6cmap.html
         */
        function readSubTable(reader, ttf, subTable, cmapOffset) {
            var startOffset = cmapOffset + subTable.offset; 
            subTable.format = reader.readUint16(startOffset);

            var i;
            // 0～256 紧凑排列
            if (subTable.format == 0) {
                var format4 = subTable;
                // 跳过format字段
                format4.length = reader.readUint16();
                format4.language = reader.readUint16();
                var glyphIdArray = [];
                for (var i = 0, l = format4.length - 6; i < l; i++) {
                    glyphIdArray.push(reader.readUint8());
                }
                format4.glyphIdArray = glyphIdArray;
            }
            // 双字节编码，非紧凑排列
            else if(subTable.format == 4) {
                var format4 = subTable;
                // 跳过format字段
                format4.length = reader.readUint16();
                format4.language = reader.readUint16();
                format4.segCountX2 = reader.readUint16();
                format4.searchRange = reader.readUint16();
                format4.entrySelector = reader.readUint16();
                format4.rangeShift = reader.readUint16();

                var segCount = format4.segCountX2 / 2;

                // end code
                var endCode = [];
                for(i = 0; i < segCount; ++i) {
                    endCode.push(reader.readUint16());
                }
                format4.endCode = endCode;

                format4.reservedPad = reader.readUint16();

                // start code
                var startCode = [];
                for(i = 0; i < segCount; ++i) {
                    startCode.push(reader.readUint16());
                }
                format4.startCode = startCode;

                // idDelta
                var idDelta = [];
                for(i = 0; i < segCount; ++i) {
                    idDelta.push(reader.readUint16());
                }
                format4.idDelta = idDelta;


                format4.idRangeOffsetOffset = reader.offset;
                
                // idRangeOffset
                var idRangeOffset = [];
                for(i = 0; i < segCount; ++i) {
                    idRangeOffset.push(reader.readUint16());
                }
                format4.idRangeOffset = idRangeOffset;

                // 总长度 - glyphIdArray起始偏移/2
                var glyphCount = (format4.length - (reader.offset - startOffset)) / 2;

                // 记录array offset
                format4.glyphIdArrayOffset = reader.offset;

                // glyphIdArray
                var glyphIdArray = [];
                for(i = 0; i < glyphCount; ++i) {
                    glyphIdArray.push(reader.readUint16());
                }

                format4.glyphIdArray = glyphIdArray;

            }
            // The firstCode and entryCount values in the subtable specify 
            // the useful subrange within the range of possible character codes. 
            // The range begins with firstCode and has a length equal to entryCount. 
            else if(subTable.format == 6) {
                var format6 = subTable;

                format6.length = reader.readUint16();
                format6.language = reader.readUint16();
                format6.firstCode = reader.readUint16();
                format6.entryCount = reader.readUint16();

                // 记录array offset
                format6.glyphIdArrayOffset = reader.offset;

                var glyphIndexArray = [];
                var entryCount = format6.entryCount;
                // 读取字符分组
                for (i = 0; i < entryCount; ++i){
                    glyphIndexArray.push(reader.readUint16());
                }
                format6.glyphIdArray = glyphIndexArray;

            }
            // defines segments for sparse representation in 4-byte character space
            else if(subTable.format == 12) {
                var format12 = subTable;

                format12.reserved = reader.readUint16();
                format12.length = reader.readUint32();
                format12.language = reader.readUint32();
                format12.nGroups = reader.readUint32();

                var groups = [];
                var nGroups = format12.nGroups;
                // 读取字符分组
                for (i = 0; i < nGroups; ++i){
                    var group = {};
                    group.startCharCode = reader.readUint32();
                    group.endCharCode = reader.readUint32();
                    group.startGlyphID = reader.readUint32();
                    groups.push(groups);
                }

            }
        }


        /**
         * 获取format4 delta编码
         * Delta is saved in signed int in cmap format 4 subtable, 
         * but can be in -0xFFFF..0 interval.
         * -0x10000..-0x7FFF values are stored with offset.
         * 
         * @param {number} delta delta
         * @return {number} 
         */
        function encodeDelta(delta) {
          return delta > 0x7FFF 
            ? delta - 0x10000 
            : (delta < -0x7FFF ? delta + 0x10000 : delta);
        }

        /**
         * 根据bound获取glyf segment
         * 
         * @param {Object} ttf ttf数据结构
         * @param {number} bound 编码范围
         * @return {Array} 码表
         */
        function getSegments(unicodes, bound) {

            var prevGlyph = null;
            var result = [];
            var segment = {};

            unicodes.forEach(function (glyph) {

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

            // Need to finish the last segment
            if (prevGlyph !== null) {
                segment.end = prevGlyph.unicode;
                result.push(segment);
            }

            // 返回编码范围
            return result;
        }

        /**
         * 创建子表 0 
         * 
         * @param {Writer} writer 写对象
         * @param {Object} ttf ttf对象
         * @return {Writer}
         */
        function writeSubTable0(writer, glyfUnicodes) {

            writer.writeUint16(0); // format
            writer.writeUint16(262); // length
            writer.writeUint16(0); // language

            // Array of unicodes 0..255
            var unicodes = [];
            glyfUnicodes.forEach(function(u) {
                if (u.unicode !== undefined && u.unicode < 256) {
                    unicodes.push([u.unicode, u.id]);
                }
            });

            // 按编码排序
            unicodes.sort(function(a, b) {
                return a[0] - b[0];
            });

            var i = -1, unicode;
            while (unicode = unicodes.shift()) {
                while(++i < unicode[0]) {
                    writer.writeUint8(0);
                }

                writer.writeUint8(unicode[1]);
                i = unicode[0];
            }
            
            while(++i < 256) {
                writer.writeUint8(0);
            }

            return writer;
        }


        /**
         * 创建子表 4 
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
            var maxExponent = Math.floor(Math.log(segCount)/Math.LN2);
            var searchRange = 2 * Math.pow(2, maxExponent);

            writer.writeUint16(segCount * 2); // segCountX2
            writer.writeUint16(searchRange); // searchRange
            writer.writeUint16(maxExponent); // entrySelector
            writer.writeUint16(2 * segCount - searchRange); // rangeShift

            // end list
            segments.forEach(function(segment) {
                writer.writeUint16(segment.end);
            });
            writer.writeUint16(0xFFFF); // end code
            writer.writeUint16(0); // reservedPad


            // start list
            segments.forEach(function(segment) {
                writer.writeUint16(segment.start);
            });
            writer.writeUint16(0xFFFF); // start code

            // id delta
            segments.forEach(function(segment) {
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
         * 创建子表 12 
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

            segments.forEach(function(segment) {
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


        var cmap = table.create(
            'cmap', 
            [],
            {
                read: function(reader, ttf) {
                    var tcmap = {};
                    var cmapOffset = this.offset;

                    reader.seek(cmapOffset);

                    tcmap.version = reader.readUint16(); // 编码方式
                    var numberSubtables = tcmap.numberSubtables = reader.readUint16(); // 表个数


                    var subTables = tcmap.tables = []; // 名字表
                    var offset = reader.offset;

                    // 使用offset读取，以便于查找
                    for(var i = 0, l = numberSubtables; i < l; i++) {
                        var subTable = {};
                        subTable.platformID = reader.readUint16(offset);
                        subTable.encodingID = reader.readUint16(offset + 2);
                        subTable.offset = reader.readUint32(offset + 4);

                        readSubTable(reader, ttf, subTable, cmapOffset);
                        subTables.push(subTable);

                        offset += 8;
                    }
                    
                    tcmap.tables = subTables;

                    return tcmap;
                },

                write: function(writer, ttf) {

                    var hasGLyphsOver2Bytes = ttf.support.cmap.hasGLyphsOver2Bytes;

                    // Write table header.
                    writer.writeUint16(0); // version
                    writer.writeUint16(hasGLyphsOver2Bytes ? 4 : 3); // count

                    // header size
                    var subTableOffset = 4 + (hasGLyphsOver2Bytes ? 32 : 24);
                    var format4Size = ttf.support.cmap.format4Size;

                    // subtable 4, unicode
                    writeSubTableHeader(writer, 0, 3, subTableOffset);

                    // subtable 0, mac standard
                    writeSubTableHeader(writer, 1, 0, subTableOffset + format4Size);

                    // subtable 4, windows standard
                    writeSubTableHeader(writer, 3, 1, subTableOffset);

                    if (hasGLyphsOver2Bytes) {
                        writeSubTableHeader(writer, 3, 10, subTableOffset + 262 + format4Size);
                    }

                    // Write tables, order of table seem to be magic, it is taken from TTX tool
                    writeSubTable4(writer, ttf.support.cmap.format4Segments);
                    writeSubTable0(writer, ttf.support.cmap.unicodes);

                    if (hasGLyphsOver2Bytes) {
                        writeSubTable12(writer, ttf.support.cmap.format12Segments);
                    }


                    return writer;
                },

                size: function(ttf) {
                    ttf.support.cmap = {};

                    var unicodes = [];
                    ttf.glyf.forEach(function(glyph, index) {
                        if (lang.isArray(glyph.unicode)) {
                            glyph.unicode.forEach(function(unicode) {
                                unicodes.push({
                                    unicode: unicode,
                                    id: index
                                });
                            });
                        }
                        else if (typeof glyph.unicode == 'number') {
                            unicodes.push({
                                unicode: glyph.unicode,
                                id: index
                            });
                        }
                    });

                    unicodes = unicodes.sort(function(a, b) {
                        return a.unicode - b.unicode;
                    });

                    ttf.support.cmap.unicodes = unicodes;
                    ttf.support.cmap.format4Segments = getSegments(unicodes, 0xFFFF);
                    ttf.support.cmap.format4Size = 24 
                        + ttf.support.cmap.format4Segments.length * 8;

                    // We need subtable 12 only if found unicodes with > 2 bytes.
                    var hasGLyphsOver2Bytes = unicodes.some(function(glyph) {
                        return glyph.unicode > 0xFFFF;
                    });

                    if (hasGLyphsOver2Bytes) {
                        ttf.support.cmap.hasGLyphsOver2Bytes = hasGLyphsOver2Bytes;
                        ttf.support.cmap.format12Segments = getSegments(unicodes);
                        ttf.support.cmap.format12Size = 16 
                            + ttf.support.cmap.format12Segments.length * 12
                    }

                    
                    var size = 4 + (hasGLyphsOver2Bytes ? 32 : 24) // cmap header
                        + 262 // format 0
                        + ttf.support.cmap.format4Size // format 4
                        + (hasGLyphsOver2Bytes ? ttf.support.cmap.format12Size : 0) // format 12

                    return size;
                }
            }
        );

        return cmap;
    }
);