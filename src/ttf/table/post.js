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

        var Posthead = table.create(
            'posthead', 
            [
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

                        tbl.glyphNameIndex = glyphNameIndex;

                        var pascalStringOffset = reader.offset;
                        var pascalStringLength = ttf.tables.post.length - (pascalStringOffset - this.offset);
                        var pascalStringBytes = reader.readBytes(reader.offset, pascalStringLength);
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
                    // write header
                    writer.writeFixed(2); // format
                    writer.writeFixed(0); // italicAngle
                    writer.writeUint16(0); // postoints
                    writer.writeInt16(0); // underlinePosition
                    writer.writeInt16(0); // underlineThickness
                    writer.writeUint32(0); // isFixedPitch
                    writer.writeUint32(0); // minMemType42
                    writer.writeUint32(0); // maxMemType42
                    writer.writeUint32(0); // minMemType1
                    writer.writeUint32(numberOfGlyphs); // maxMemType1

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
                    var size = 34 + numberOfGlyphs * 2; // header + nameIndex
                    var nameIndex = 0;
                    // 获取 name的大小
                    for(var i = 0; i < numberOfGlyphs; i++) {
                        var glyf = ttf.glyf[i];
                        
                        // 这里需要注意，"" 有可能是"\3" length不为0，但是是空字符串
                        if (glyf.name && glyf.name.charCodeAt(0) > 31) {


                            if (glyf.name == '.notdef') {
                                nameIndexs.push(0);
                            }
                            else if (glyf.name == '.null') {
                                nameIndexs.push(1);
                            }
                            else if (glyf.name == 'nonmarkingreturn') {
                                nameIndexs.push(2);
                            }
                            // 这里需要注意
                            // unicode如果小于258，并且glyph名字与默认的名字相等，
                            // 则不需要放入name tbl
                            else if (glyf.unicode 
                                && glyf.unicode[0] - 29 < 258
                                && postName[glyf.unicode[0] - 29] == glyf.name
                            )
                            {
                                nameIndexs.push(glyf.unicode[0] - 29);
                            }
                            else {
                                nameIndexs.push(258 + nameIndex++);
                                var str = encodeURIComponent(ttf.glyf[i].name).replace(/%00/g, '');
                                var bytes = string.getPascalStringBytes(str); //pascal string bytes
                                glyphNames.push(bytes);
                                size += bytes.length;
                            }

                        }
                        // 如果代码点有名字，则按默认的名字
                        else if (glyf.unicode && glyf.unicode[0] - 29 < 258) {
                            nameIndexs.push(glyf.unicode[0] - 29);
                        }
                        // 否则命名为 .notdef
                        else {
                            nameIndexs.push(0);
                        }
                    }

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