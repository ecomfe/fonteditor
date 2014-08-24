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
        var posthead = table.create(
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

        /**
         * 读取poststring
         * 
         * @param {Array.<byte>} byteArray byte数组
         * @return {Array.<string>} 读取后的字符串数组
         */
        function readPascalString(byteArray) {
            var strArray = [];
            var i = 0;
            var l = byteArray.length;
            while(i < l) {
                var strLength = byteArray[i];
                var str = '';
                while(strLength-- >= 0 && i < l) {
                    str += String.fromCharCode(byteArray[++i]);
                }
                strArray.push(str);
            }
            return strArray;
        }

        var post = table.create(
            'post', 
            [
            ],
            {
                read: function(reader, ttf) {
                    // 读取表头
                    var tbl = new posthead(this.offset).read(reader, ttf);
                    var offset = reader.offset;

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
                        tbl.names = readPascalString(pascalStringBytes);
                    }

                    return tbl;
                }
            }
        );

        return post;
    }
);