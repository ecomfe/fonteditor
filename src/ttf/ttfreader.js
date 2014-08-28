/**
 * @file ttfreader.js
 * @author mengke01
 * @date 
 * @description
 * ttf定义
 * 
 * thanks to：
 * ynakajima/ttf.js
 * https://github.com/ynakajima/ttf.js
 */


define(
    function(require) {

        var supportTables = require('./table/support');
        var reader = require('./reader');


        /**
         * 读取ttf表偏移量
         * 
         */
        function readTableOffset() {
            var tables = {};
            var numTables = this.ttf.numTables;
            var offset = this.reader.offset;
            var reader = this.reader;
            for (var i = offset, l = numTables * 16; i < l; i += 16) {

                var name = reader.readString(i, 4);
                var checkSum = reader.readUint32(i + 4);
                var tblOffset = reader.readUint32(i + 8);
                var length = reader.readUint32(i + 12);

                tables[name] = {
                    name : name,
                    checkSum : checkSum,
                    offset : tblOffset,
                    length : length,
                };
            }

            return tables;
        }


        /**
         * 初始化
         */
        function init() {
            var reader = this.reader;
            var ttf = this.ttf;

            // version
            ttf.version = reader.readFixed(0);

            // num tables
            ttf.numTables = reader.readUint16();

            // searchRenge
            ttf.searchRenge = reader.readUint16();

            // entrySelector
            ttf.entrySelector = reader.readUint16();

            // rengeShift
            ttf.rengeShift = reader.readUint16();

            ttf.tables = readTableOffset.call(this);

            // 读取支持的表数据
            Object.keys(supportTables).forEach(function(tableName) {
                // console.log(tableName);
                var offset = ttf.tables[tableName].offset;
                ttf[tableName] = new supportTables[tableName](offset).read(reader, ttf);
            });
        }

        /**
         * TTF的构造函数
         * 
         * @constructor
         */
        function TTFReader() {
        }

        /**
         * 获取解析后的ttf文档
         * 
         * @return {Object} ttf文档
         */
        TTFReader.prototype.read = function(buffer) {
            this.reader = new reader(buffer, 0, buffer.byteLength, false);
            this.ttf = {};
            init.call(this);
            return this.ttf;
        };

        return TTFReader;
    }
);
