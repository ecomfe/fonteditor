/**
 * @file post.js
 * @author mengke01
 * @date 
 * @description
 * 
 * post 表
 * 
 * https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6post.html
 */

define(
    function(require) {
        var table = require('./table');
        var struct = require('./struct');
        var string = require('../util/string');

        var Posthead = table.create(
            'posthead', 
            [
                ['format', struct.Fixed],
                ['italicAngle', struct.Fixed],
                ['postoints', struct.Uint16],
                ['underlinePosition', struct.Int16],
                ['underlineThickness', struct.Int16],
                ['isFixedPitch', struct.Uint32],
                ['minMemType42', struct.Uint32],
                ['maxMemType42', struct.Uint32],
                ['minMemType1', struct.Uint32],
                ['maxMemType1', struct.Uint32]
            ]
        );

        var post = table.create(
            'post', 
            [
            ],
            {
                read: function(reader, ttf) {
                    // 读取表头
                    var tbl = new Posthead(this.offset).read(reader, ttf);

                    // format2
                    if(tbl.format == 2) {
                        var numberOfGlyphs = ttf.maxp.numGlyphs;

                        var glyphNameIndex = [];
                        for(var i = 0; i < numberOfGlyphs; ++i) {
                            glyphNameIndex.push(reader.readUint16());
                        }

                        tbl.glyphNameIndex = glyphNameIndex;

                        var pascalStringOffset = reader.offset;
                        var pascalStringLength = ttf.tables.post.length - (pascalStringOffset - this.offset);
                        var pascalStringBytes = reader.readBytes(reader.offset, pascalStringLength);
                        tbl.names = string.readPascalString(pascalStringBytes);
                    }

                    return tbl;
                }
            }
        );

        return post;
    }
);