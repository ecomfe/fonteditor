/**
 * @file name.js
 * @author mengke01
 * @date 
 * @description
 * name表
 */
define(
    function(require) {
        var table = require('./table');
        var struct = require('./struct');
        var name = table.create(
            'name', 
            [], {

                read: function(reader, ttf) {
                    var offset = this.offset;
                    reader.seek(offset);

                    var nameTbl = {};
                    nameTbl.format = reader.readUint16();
                    nameTbl.count = reader.readUint16();
                    nameTbl.stringOffset = reader.readUint16();

                    var nameRecordTbl = [];
                    var count = nameTbl.count;
                    for (var i = 0; i < count; ++i) {
                        var nameRecord = {};
                        nameRecord.platformID = reader.readUint16();
                        nameRecord.platformSpecificID = reader.readUint16();
                        nameRecord.languageID = reader.readUint16();
                        nameRecord.nameID = reader.readUint16();
                        nameRecord.length = reader.readUint16();
                        nameRecord.offset = reader.readUint16();
                        nameRecordTbl.push(nameRecord);
                    };


                    //nameTbl.name = reader.readString(reader.offset, nameTbl.stringOffset);

                    offset = offset + nameTbl.stringOffset;
                    // 读取字符名字
                    for (var i = 0; i < count; ++i) {
                        var nameRecord = nameRecordTbl[i];
                        nameRecord.name = reader.readString(offset + nameRecord.offset, nameRecord.length);
                    }

                    nameTbl.nameRecord = nameRecordTbl;
                    return nameTbl;
                }
            }
        );

        return name;
    }
);