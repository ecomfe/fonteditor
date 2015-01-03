/**
 * @file ScriptList.js
 * @author mengke01
 * @date
 * @description
 * 脚本表
 * 仅完成语言系统解析
 * http://www.microsoft.com/typography/otspec/chapter2.htm
 */


define(
    function (require) {
        var table = require('./table');

        var scriptList = table.create(
            'ScriptList',
            [],
            {

                read: function (reader) {
                    reader.seek(this.offset);
                    var ScriptCount = reader.readUint16();

                    // script records
                    var records = [];
                    var record;
                    var i;
                    var j;
                    var l;

                    for (i = 0, l = ScriptCount; i < l; i++) {
                        record = {
                            ScriptTag: reader.readUint32(),
                            Offset: reader.readUint16()
                        };
                        records.push(record);
                    }

                    // script table
                    var offset = this.offset;
                    for (i = 0, l = records.length; i < l; i++) {
                        record = records[i];
                        reader.seek(offset + record.Offset);
                        record.DefaultLangSys = reader.readUint16();
                        var LangSysCount = reader.readUint16();
                        record.LangSysRecord = [];

                        // 此处解析语言系统
                        for (j = 0, l = LangSysCount; j < l; j++) {
                            var langSysRecord = {
                                LangSysTag: reader.readUint32(),
                                LangSys: reader.readUint16()
                            };
                            record.LangSysRecord.push(langSysRecord);
                        }
                    }

                    return records;
                }
            }
        );

        return scriptList;
    }
);
