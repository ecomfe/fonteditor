/**
 * @file ScriptList.js
 * @author mengke01
 * @date 
 * @description
 * 脚本表
 * 仅完成语言系统解析
 * 
 * http://www.microsoft.com/typography/otspec/chapter2.htm
 */


define(
    function(require) {
        var table = require('./table');

        var GSUB = table.create(
            'GSUB', 
            [],
            {
                /**
                 * 解析GSUB表
                 */
                read: function(reader, ttf) {
                    reader.seek(this.offset);
                    var ScriptCount = reader.readUint16();

                    // script records
                    var records = [];
                    for(var i = 0, l = ScriptCount; i < l; i++) {
                        var record = {
                            ScriptTag: reader.readUint32(),
                            Offset: reader.readUint16()
                        };
                        records.push(record);
                    }

                    // script table
                    var offset = this.offset;
                    for(var i = 0, l = records.length; i < l; i++) {
                        var record = records[i];
                        reader.seek(offset + record.Offset);
                        record.DefaultLangSys = reader.readUint16();
                        var LangSysCount = reader.readUint16();
                        record.LangSysRecord = [];

                        // 此处解析语言系统
                        for(var j = 0, l = LangSysCount; j < l; j++) {
                            var LangSysRecord = {
                                LangSysTag: reader.readUint32(),
                                LangSys: reader.readUint16()
                            };
                            record.LangSysRecord.push(LangSysRecord);
                        }
                    }

                    return records;
                }
            }
        );

        return GSUB;
    }
);
