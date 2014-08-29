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
        var struct = require('./struct');
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
                }
            }
        );

        return directory;
    }
);