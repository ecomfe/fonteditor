/**
 * @file ttfwriter.js
 * @author mengke01
 * @date
 * @description
 * 写ttf文件
 */


define(
    function (require) {

        var Writer = require('./writer');
        var Directory = require('./table/directory');
        var supportTables = require('./table/support');
        var checkSum = require('./util/checkSum');
        var error = require('./error');

        var reduceGlyf = require('./util/reduceGlyf');
        var pathCeil = require('graphics/pathCeil');

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
            ttf.version = ttf.version || 0x1;
            ttf.numTables = tableList.length;
            ttf.entrySelector = Math.floor(Math.log(tableList.length) / Math.LN2);
            ttf.searchRange = Math.pow(2, ttf.entrySelector) * 16;
            ttf.rangeShift = tableList.length * 16 - ttf.searchRange;

            // 重置校验码
            ttf.head.checkSumAdjustment = 0;
            ttf.head.magickNumber = 0x5F0F3CF5;

            if (typeof ttf.head.created === 'string') {
                ttf.head.created = /^\d+$/.test(ttf.head.created) ? +ttf.head.created : Date.parse(ttf.head.created);
            }

            ttf.head.modified = Date.now();

            if (!ttf.glyf || ttf.glyf.length === 0) {
                error.raise(10201);
            }

            var checkUnicodeRepeat = {}; // 检查是否有重复代码点

            // 将glyf的代码点按小到大排序
            ttf.glyf.forEach(function (glyf, index) {
                if (glyf.unicode) {
                    glyf.unicode = glyf.unicode.sort();

                    glyf.unicode.forEach(function (u) {
                        if (checkUnicodeRepeat[u]) {
                            error.raise(10200, index);
                        }
                        else {
                            checkUnicodeRepeat[u] = true;
                        }
                    });

                }

                if (!glyf.compound && glyf.contours) {

                    // 整数化
                    glyf.contours.forEach(function (contour) {
                        pathCeil(contour);
                    });

                    // 缩减glyf
                    reduceGlyf(glyf);
                }

                // 整数化
                glyf.xMin = Math.round(glyf.xMin || 0);
                glyf.xMax = Math.round(glyf.xMax || 0);
                glyf.yMin = Math.round(glyf.yMin || 0);
                glyf.yMax = Math.round(glyf.yMax || 0);
                glyf.leftSideBearing = Math.round(glyf.leftSideBearing || 0);
                glyf.advanceWidth = Math.round(glyf.advanceWidth || 0);

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
            tableList.forEach(function (tableName) {
                var offset = ttfSize;
                var tableSize = new supportTables[tableName]().size(ttf); // 原始的表大小
                var size = tableSize; // 对齐后的表大小

                if (tableName === 'head') {
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
            ttf.support.tables.forEach(function (table) {

                var tableStart = writer.offset;
                !new supportTables[table.name]().write(writer, ttf);

                if (table.length % 4) {
                    // 对齐字节
                    writer.writeEmpty(4 - table.length % 4);
                }

                // 计算校验和
                table.checkSum = checkSum(writer.getBuffer(), tableStart, table.size);

            });

            // 重新写入每个表校验和
            ttf.support.tables.forEach(function (table, index) {
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
         * @param {Object} ttf ttf数据结构
         * @return {ArrayBuffer} 缓冲数组
         */
        TTFWriter.prototype.write = function (ttf) {
            resolve.call(this, ttf);
            var buffer = write.call(this, ttf);
            return buffer;
        };

        /**
         * 注销
         */
        TTFWriter.prototype.dispose = function () {
        };

        return TTFWriter;
    }
);
