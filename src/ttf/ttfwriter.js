/**
 * @file ttfwriter.js
 * @author mengke01
 * @date 
 * @description
 * 写ttf文件
 */


define(
    function(require) {

        var Writer = require('./writer');
        var Directory = require('./table/directory');
        var supportTables = require('./table/support');
        var checkSum = require('./util/checkSum');

        var reduceGlyf = require('./util/reduceGlyf');

        // 支持写的表, 注意表顺序
        var tableList = [
            'OS/2',
            'cmap',
            'glyf',
            'head',
            'hhea',
            'hmtx',
            'loca',
            'maxp',
            'name',
            'post'
        ];


        /**
         * 处理ttf结构，以便于写
         * 
         * @param {ttfObject} ttf ttf数据结构
         */
        function resolve(ttf) {

            // 头部信息
            ttf.numTables = tableList.length;
            ttf.entrySelector = Math.floor(Math.log(tableList.length)/Math.LN2);
            ttf.searchRange = Math.pow(2, ttf.entrySelector) * 16;
            ttf.rangeShift = tableList.length * 16 - ttf.searchRange;

            // 重置校验码
            ttf.head.checkSumAdjustment = 0;
            ttf.head.magickNumber = 0x5F0F3CF5;
            
            if (typeof(ttf.head.created) == 'string') {
                ttf.head.created = /^\d+$/.test(ttf.head.created) ? +ttf.head.created : Date.parse(ttf.head.created);
            }

            ttf.head.modified = Date.now();

            if (!ttf.glyf) {
                error.raise(10201);
            }

            // 将glyf的代码点按小到大排序
            ttf.glyf.forEach(function(glyf) {
                if (glyf.unicode) {
                    glyf.unicode = glyf.unicode.sort();
                }

                if (!glyf.compound && glyf.contours) {
                    reduceGlyf(glyf);
                }
            });

        }


        /**
         * 写ttf文件
         * 
         * @param {ttfObject} ttf ttf数据结构
         * @return {ArrayBuffer} 字节流
         */
        function write(ttf) {

            // 用来做写入缓存的对象，用完后删掉
            ttf.support = {};

            // head + directory
            var ttfSize = 12 + tableList.length * 16;
            var ttfHeadOffset = 0; // 记录head的偏移
            // 构造tables
            ttf.support.tables = [];
            tableList.forEach(function(tableName) {
                var offset = ttfSize;
                var tableSize = new supportTables[tableName]().size(ttf); // 原始的表大小
                var size = tableSize; // 对对齐后的表大小

                if (tableName == 'head') {
                    ttfHeadOffset = offset;
                }

                // 4字节对齐
                if (size % 4) {
                    size += 4 - size % 4;
                }

                ttf.support.tables.push({
                    name: tableName,
                    checkSum: 0,
                    offset: offset,
                    length: tableSize,
                    size: size
                });

                ttfSize += size;
            });

            var writer = new Writer(new ArrayBuffer(ttfSize));

            // 写头部
            writer.writeFixed(ttf.version);
            writer.writeUint16(ttf.numTables);
            writer.writeUint16(ttf.searchRange);
            writer.writeUint16(ttf.entrySelector);
            writer.writeUint16(ttf.rangeShift);

            // 写表偏移
            !new Directory().write(writer, ttf);

            // 写支持的表数据
            ttf.support.tables.forEach(function(table) {

                var tableStart = writer.offset;
                !new supportTables[table.name]().write(writer, ttf);
                
                if (table.length % 4) {
                    // 对齐字节
                    for (var i = 0, l = 4 - table.length % 4; i < l; i++) {
                        writer.writeUint8(0);
                    }
                }

                // 计算校验和
                table.checkSum = checkSum(writer.getBuffer(), tableStart, table.size);

            });

            // 重新写入每个表校验和
            ttf.support.tables.forEach(function(table, index) {
                var offset = 12 + index * 16 + 4;
                writer.writeUint32(table.checkSum, offset);
            });

            // 写入总校验和
            var ttfCheckSum = (0xB1B0AFBA - checkSum(writer.getBuffer()) + 0x100000000) % 0x100000000;
            writer.writeUint32(ttfCheckSum, ttfHeadOffset + 8);

            delete ttf.support;

            var buffer = writer.getBuffer();
            writer.dispose();

            return buffer;
        }


        /**
         * TTFWriter的构造函数
         * 
         * @constructor
         */
        function TTFWriter() {
        }

        /**
         * 写一个ttf字体结构
         * 
         * @return {ArrayBuffer} 缓冲数组
         */
        TTFWriter.prototype.write = function(ttf) {
            resolve.call(this, ttf);
            var buffer = write.call(this, ttf);
            return buffer;
        };

        /**
         * 注销
         */
        TTFWriter.prototype.dispose = function() {
        };

        return TTFWriter;
    }
);
