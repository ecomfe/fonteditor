/**
 * @file directory.js
 * @author mengke01
 * @date 
 * @description
 * directory 表, 读取ttf表索引
 */


define(
    function(require) {
        var table = require('./table');

        var directory = table.create(
            'directory', 
            [
            ],
            {
                read: function(reader, ttf) {
                    var tables = {};
                    var numTables = ttf.numTables;
                    var offset = this.offset;

                    for (var i = offset, l = numTables * 16; i < l; i += 16) {
                        var name = reader.readString(i, 4);
                        
                        tables[name] = {
                            name : name,
                            checkSum : reader.readUint32(i + 4),
                            offset : reader.readUint32(i + 8),
                            length : reader.readUint32(i + 12)
                        };
                    }

                    return tables;
                },
                write: function(writer, ttf) {
                    
                    var tables = ttf.tables;
                    for (var i = 0, l = tables.length; i < l; i++) {
                        writer.writeString(tables[i].name);
                        writer.writeUint32(tables[i].checkSum);
                        writer.writeUint32(tables[i].offset);
                        writer.writeUint32(tables[i].length);
                    }

                    return writer;
                }
            }
        );

        return directory;
    }
);