/**
 * @file woff2ttf.js
 * @author mengke01
 * @date 
 * @description
 * woff转换ttf
 */


define(
    function(require) {

        var Reader = require('./reader');
        var Writer = require('./writer');

        /**
         * 写空数据
         * 
         * @param {Writer} writer writer对象
         * @param {number} length 大小
         * @return {Writer}
         */
        function writeEmpty(writer, length) {
            while (length-- > 0) {
                writer.writeUint8(0);
            }
            return writer;
        }

        /**
         * woff格式转换成ttf字体格式
         * 
         * @param {ArrayBuffer} woffBuffer ttf缓冲数组
         * @param {Object} options 选项
         * @param {Object} options.inflate 解压相关函数
         * 
         * @return {ArrayBuffer} woff格式byte流
         */
        function woff2ttf(woffBuffer, options) {
            options = options || {};

            var reader = new Reader(woffBuffer);
            var signature = reader.readUint32(0);
            var flavor = reader.readUint32(4);

            if (signature !== 0x774F4646 || flavor !== 0x10000) {
                reader.dispose();
                throw 'not a ttf sfnt format!';
            }

            var numTables = reader.readUint16(12);
            var ttfSize =  reader.readUint32(16);
            var tableEntries = [];

            // 读取woff表索引信息
            for (var i = 0; i < numTables; ++i) {
                reader.seek(44 + i * 20);
                var tableEntry = {
                    tag: reader.readString(reader.offset, 4),
                    offset: reader.readUint32(),
                    compLength: reader.readUint32(),
                    length: reader.readUint32(),
                    checkSum: reader.readUint32()
                };

                // ttf 表数据
                var deflateData = reader.readBytes(tableEntry.offset, tableEntry.compLength);
                // 需要解压
                if (deflateData.length < tableEntry.length) {
                    if (!options.inflate) {
                        reader.dispose();
                        throw 'no inflate function!';
                    }
                    tableEntry.data = options.inflate(deflateData);
                }
                else {
                    tableEntry.data = deflateData;
                }
                tableEntry.length = tableEntry.data.length;

                tableEntries.push(tableEntry);
            }


            var writer = new Writer(new ArrayBuffer(ttfSize));
            // 写头部
            var entrySelector = Math.floor(Math.log(numTables)/Math.LN2);
            var searchRange = Math.pow(2, entrySelector) * 16;
            var rangeShift = numTables * 16 - searchRange;
            writer.writeFixed(1);
            writer.writeUint16(numTables);
            writer.writeUint16(searchRange);
            writer.writeUint16(entrySelector);
            writer.writeUint16(rangeShift);

            // 写ttf表索引
            var tblOffset = 12 + 16 * tableEntries.length;
            for (var i = 0, l = tableEntries.length; i < l; ++i) {
                var tableEntry = tableEntries[i];
                writer.writeString(tableEntry.tag);
                writer.writeUint32(tableEntry.checkSum);
                writer.writeUint32(tblOffset);
                writer.writeUint32(tableEntry.length);
                tblOffset += tableEntry.length + (tableEntry.length % 4 ? 4 - tableEntry.length % 4 : 0)
            }

            // 写ttf表数据
            for (var i = 0, l = tableEntries.length; i < l; ++i) {
                var tableEntry = tableEntries[i];
                writer.writeBytes(tableEntry.data);
                if (tableEntry.length % 4) {
                    writeEmpty(writer, 4 - tableEntry.length % 4);
                }
            }

            return writer.getBuffer();
        }


        return woff2ttf;
    }
);
