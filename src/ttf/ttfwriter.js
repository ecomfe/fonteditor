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

        // 支持写的表, 注意表顺序
        var supportTables = [
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
         */
        function resolve() {
            var ttf = this.ttf;
            ttf.numTables = supportTables.length;
            ttf.entrySelector = Math.floor(Math.log(supportTables.length)/Math.LN2);
            ttf.searchRange = Math.pow(2, ttf.entrySelector) * 16;
            ttf.rangeShift = supportTables.length * 16 - ttf.searchRange;
            ttf.tables = supportTables.map(function(table) {
                return {
                    name: table,
                    checkSum: 0,
                    offset: 0,
                    length: 10
                };
            });
        }


        /**
         * 写ttf文件
         */
        function write() {
            var ttf = this.ttf;
            var buffer = {};

            // 写头部
            var headSize = 20 + ttf.numTables * 16;
            var writer = new Writer(new ArrayBuffer(headSize));
            writer.writeFixed(ttf.version);
            writer.writeUint16(ttf.numTables);
            writer.writeUint16(ttf.searchRange);
            writer.writeUint16(ttf.entrySelector);
            writer.writeUint16(ttf.rangeShift);

            !new Directory(writer.offset).write(writer, ttf);

            buffer.tables = writer.getBuffer();

            return buffer.tables;
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
            this.ttf = ttf;
            resolve.call(this);
            var buffer = write.call(this);
            return buffer;
        };

        return TTFWriter;
    }
);
