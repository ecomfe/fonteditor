/**
 * @file loca.js
 * @author mengke01
 * @date 
 * @description
 * loca表
 */

define(
    function(require) {
        var table = require('./table');
        var struct = require('./struct');
        var loca = table.create(
            'loca', 
            [], 
            {
                /**
                 * 解析local表
                 */
                read: function(reader, ttf) {
                    var offset = this.offset;
                    var indexToLocFormat = ttf.head.indexToLocFormat;
                    // indexToLocFormat有2字节和4字节的区别
                    var type = struct.names[(indexToLocFormat === 0) ? struct.Uint16 : struct.Uint32];
                    var size = (indexToLocFormat === 0) ? 2 : 4; //字节大小
                    var sizeRatio = (indexToLocFormat === 0) ? 2 : 1; //真实地址偏移
                    var wordOffset = [];

                    reader.seek(offset);

                    var numGlyphs = ttf.maxp.numGlyphs;
                    for (var i = 0; i < numGlyphs; ++i) {
                        wordOffset.push(reader.read(type, offset, false) * sizeRatio);
                        offset += size;
                    }
                    
                    return wordOffset;
                },

                write: function(writer, ttf) {
                    return writer;
                }
            }
        );

        return loca;
    }
);