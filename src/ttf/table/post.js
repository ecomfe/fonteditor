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
        var postName = require('../enum/postName');
        var unicodeName = require('../enum/unicodeName');

        var Posthead = table.create(
            'posthead', 
            [
                ['italicAngle', struct.Fixed],
                ['underlinePosition', struct.Int16],
                ['underlineThickness', struct.Int16],
                ['postoints', struct.Int16], // 不知道干嘛用，文档里面没有
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
                    var tbl = null;
                    var format = reader.readFixed(this.offset);

                    // format2
                    if(format == 2) {

                        // 读取表头
                        tbl = new Posthead(reader.offset).read(reader, ttf);
                        tbl.format = format;

                        var numberOfGlyphs = ttf.maxp.numGlyphs;

                        var glyphNameIndex = [];
                        for(var i = 0; i < numberOfGlyphs; ++i) {
                            glyphNameIndex.push(reader.readUint16());
                        }

                        var pascalStringOffset = reader.offset;
                        var pascalStringLength = ttf.tables.post.length - (pascalStringOffset - this.offset);
                        var pascalStringBytes = reader.readBytes(reader.offset, pascalStringLength);

                        tbl.glyphNameIndex = glyphNameIndex;
                        tbl.names = string.readPascalString(pascalStringBytes);
                    }
                    else {
                        tbl = {
                            format: format
                        };
                    }

                    return tbl;
                },
                write: function(writer, ttf) {

                    var numberOfGlyphs = ttf.glyf.length; 
                    var post = ttf.post || {};

                    // write header
                    writer.writeFixed(2); // format
                    writer.writeFixed(post.italicAngle || 0); // italicAngle
                    writer.writeInt16(post.underlinePosition || 0); // underlinePosition
                    writer.writeInt16(post.underlineThickness || 0); // underlineThickness
                    writer.writeUint16(post.postoints || 0); // postoints
                    writer.writeUint32(post.isFixedPitch || 0); // isFixedPitch
                    writer.writeUint32(post.minMemType42 || 0); // minMemType42
                    writer.writeUint32(post.maxMemType42 || 0); // maxMemType42
                    writer.writeUint32(post.minMemType1 || 0); // minMemType1
                    writer.writeUint32(post.maxMemType1 || numberOfGlyphs); // maxMemType1

                    // write glyphNameIndex
                    var nameIndexs = ttf.support.post.nameIndexs;
                    for (var i = 0, l = nameIndexs.length; i < l; i ++) {
                        writer.writeUint16(nameIndexs[i]);
                    }

                    // write names
                    ttf.support.post.glyphNames.forEach(function(name) {
                        writer.writeBytes(name);
                    });
                },
                size: function(ttf) {
                    var numberOfGlyphs = ttf.glyf.length;
                    var glyphNames = [];
                    var nameIndexs = [];
                    var size = 34 + numberOfGlyphs * 2; // header + numberOfGlyphs * 2
                    var nameIndex = 0;

                    // 获取 name的大小
                    for(var i = 0; i < numberOfGlyphs; i++) {
                        // .notdef
                        if (i === 0) {
                            nameIndexs.push(0);
                        }
                        else {
                            var glyf = ttf.glyf[i];
                            var unicode = glyf.unicode ? glyf.unicode[0] : 0;
                            var unicodeNameIndex = unicodeName[unicode];
                            if (undefined !== unicodeNameIndex) {
                                nameIndexs.push(unicodeNameIndex);
                            }
                            else {
                                // 这里需要注意，"" 有可能是"\3" length不为0，但是是空字符串
                                var name = glyf.name;
                                if (!name || name.charCodeAt(0) < 32) {
                                    name = string.getUnicodeName(unicode);
                                }

                                nameIndexs.push(258 + nameIndex++);
                                var bytes = string.getPascalStringBytes(name); //pascal string bytes
                                glyphNames.push(bytes);
                                size += bytes.length;
                            }
                        }
                    }

                    ttf.post = ttf.post || {};
                    ttf.post.maxMemType1 = numberOfGlyphs;

                    ttf.support.post = {
                        nameIndexs: nameIndexs,
                        glyphNames: glyphNames
                    };

                    return size;
                }
            }
        );

        return post;
    }
);