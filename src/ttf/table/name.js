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
        var nameId = require('../enum/nameId');
        var string = require('../util/string');

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
                    }

                    offset = offset + nameTbl.stringOffset;
                    // 读取字符名字
                    for (var i = 0; i < count; ++i) {
                        var nameRecord = nameRecordTbl[i];
                        nameRecord.name = reader.readString(offset + nameRecord.offset, nameRecord.length);
                    }

                    var names = {};
                    
                    // 读取windows下的name records
                    var platformID = 3;
                    var platformSpecificID = 1;

                    for (var i = 0; i < count; ++i) {
                        var nameRecord = nameRecordTbl[i];
                        if (nameRecord.platformID == platformID
                            && nameRecord.platformSpecificID == platformSpecificID
                            && nameId[nameRecord.nameID]) {
                            names[nameId[nameRecord.nameID]] = decodeURIComponent(nameRecord.name);
                        }
                    }

                    return names;
                },

                write: function(writer, ttf) {
                    var nameRecordTbl = ttf.support.name;

                    writer.writeUint16(0); // format
                    writer.writeUint16(nameRecordTbl.length); // count
                    writer.writeUint16(6 + nameRecordTbl.length * 12); // string offset

                    // write name tbl header
                    var offset = 0;
                    nameRecordTbl.forEach(function(nameRecord) {
                        writer.writeUint16(nameRecord.platformID);
                        writer.writeUint16(nameRecord.platformSpecificID);
                        writer.writeUint16(nameRecord.languageID); 
                        writer.writeUint16(nameRecord.nameID);
                        writer.writeUint16(nameRecord.name.length);
                        writer.writeUint16(offset); // offset
                        offset += nameRecord.name.length;
                    });

                    // write name tbl strings
                    nameRecordTbl.forEach(function(nameRecord) {
                        writer.writeString(nameRecord.name);
                    });

                    return writer;
                },

                size: function(ttf) {
                    var names = ttf.name;
                    var nameRecordTbl = [];

                    // 写入name信息
                    // 这里为了简化书写，仅支持英文编码字符，
                    // 中文编码字符将被转化成url encode
                    var size = 6;
                    Object.keys(names).forEach(function(name) {
                        var id = nameId.names[name];
                        var nameStr = encodeURIComponent(names[name] || '').replace(/%00/g, '');
                        if (undefined !== id) {
                            // mac
                            nameRecordTbl.push({
                                nameID: id,
                                platformID: 1,
                                platformSpecificID: 0,
                                languageID: 0,
                                name: nameStr
                            });

                            // windows  
                            nameRecordTbl.push({
                                nameID: id,
                                platformID: 3,
                                platformSpecificID: 1,
                                languageID: 0, //
                                name: nameStr
                            });

                            // 子表大小
                            size += 12 * 2 + nameStr.length * 2;
                        }
                    });

                    // 保存预处理信息
                    ttf.support.name = nameRecordTbl;

                    return size;
                }
            }
        );

        return name;
    }
);