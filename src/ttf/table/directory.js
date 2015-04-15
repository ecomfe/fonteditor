/**
 * @file directory.js
 * @author mengke01
 * @date
 * @description
 * directory 表, 读取ttf表索引
 *
 * https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6.html
 */


define(
    function (require) {
        var table = require('./table');

        var directory = table.create(
            'directory',
            [],
            {
                read: function (reader, ttf) {
                    var tables = {};
                    var numTables = ttf.numTables;
                    var offset = this.offset;

                    for (var i = offset, l = numTables * 16; i < l; i += 16) {
                        var name = reader.readString(i, 4).trim();

                        tables[name] = {
                            name: name,
                            checkSum: reader.readUint32(i + 4),
                            offset: reader.readUint32(i + 8),
                            length: reader.readUint32(i + 12)
                        };
                    }

                    return tables;
                },

                write: function (writer, ttf) {

                    var tables = ttf.support.tables;
                    for (var i = 0, l = tables.length; i < l; i++) {
                        writer.writeString((tables[i].name + '    ').slice(0, 4));
                        writer.writeUint32(tables[i].checkSum);
                        writer.writeUint32(tables[i].offset);
                        writer.writeUint32(tables[i].length);
                    }

                    return writer;
                },

                size: function (ttf) {
                    return ttf.numTables * 16;
                }
            }
        );

        return directory;
    }
);
