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
        var Directory = require('./table/directory');
        var supportTables = require('./table/support');
        var Reader = require('./reader');
        var postName = require('./enum/postName');

        /**
         * 初始化
         */
        function read() {
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

            ttf.tables = new Directory(reader.offset).read(reader, ttf);

            // 读取支持的表数据
            Object.keys(supportTables).forEach(function(tableName) {
                // console.log(tableName);
                if (ttf.tables[tableName]) {
                    var offset = ttf.tables[tableName].offset;
                    ttf[tableName] = new supportTables[tableName](offset).read(reader, ttf);
                }
            });

        }

        /**
         * 关联glyf相关的信息
         */
        function resolveGlyf(ttf) {
            var codes = ttf.cmap;
            var glyf = ttf.glyf;

            // unicode
            Object.keys(codes).forEach(function(c) {
                var i = codes[c];
                if (!glyf[i].unicode) {
                    glyf[i].unicode = [];
                }
                glyf[i].unicode.push(+c);
            });

            // advanceWidth
            ttf.hmtx.forEach(function(item, i) {
                glyf[i].advanceWidth = item.advanceWidth;
                glyf[i].leftSideBearing = item.leftSideBearing;
            });

            //name 
            if (ttf.post && 2 == ttf.post.format) {
                var nameIndex = ttf.post.glyphNameIndex;
                var names = ttf.post.names;
                nameIndex.forEach(function(nameIndex, i) {
                    if (nameIndex <= 257) {
                        glyf[i].name = postName[nameIndex];
                    }
                    else {
                        glyf[i].name = names[nameIndex - 258] || '';
                    }
                });
            }
        }

        /**
         * 清除非必须的表
         */
        function cleanTables(ttf) {
            delete ttf.tables;
            delete ttf.DSIG;
            delete ttf.GDEF;
            delete ttf.GPOS;
            delete ttf.GSUB;
            delete ttf.gasp;
            delete ttf.hmtx;
            delete ttf.loca;
            delete ttf.post;
            delete ttf.maxp;
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
            this.reader = new Reader(buffer, 0, buffer.byteLength, false);
            this.ttf = {};
            read.call(this);
            return this.ttf;
        };

        /**
         * 对ttf文件做进一步解析处理
         * 
         * @param {Object} ttf ttf格式文件
         * 
         * @return {Object} 解析后的格式
         */
        TTFReader.prototype.resolve = function(ttf) {
            ttf = ttf || this.ttf;
            resolveGlyf.call(this, ttf);
            //cleanTables.call(this, ttf);
            return ttf;
        };


        return TTFReader;
    }
);
