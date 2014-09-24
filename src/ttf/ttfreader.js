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
                var offset = ttf.tables[tableName].offset;
                ttf[tableName] = new supportTables[tableName](offset).read(reader, ttf);
            });

        }


        /**
         * 读取ttf中windows字符表的字符
         * 
         * @return {Object} 字符字典索引，key：unicode，value：glyf index
         * 
         * @see https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6cmap.html
         */
        function readWindowsAllCodes(ttf) {
            // 读取windows unicode 编码段
            var usc2Arr = ttf.cmap.tables.filter(function(item) {
                return item.platformID == 3 && item.encodingID == 1 && item.format == 4;
            });

            if(usc2Arr.length) {
                // 只取第一个format
                var format4 = usc2Arr[0];
                var segCount = format4.segCountX2 / 2;

                var codes = {};

                // graphIdArray 和idRangeOffset的偏移量
                var graphIdArrayIndexOffset = (format4.glyphIdArrayOffset - format4.idRangeOffsetOffset) / 2;

                for (var i = 0; i < segCount; ++i) {
                    // 读取单个字符
                    for(
                        var start = format4.startCode[i], end = format4.endCode[i];
                        start <= end;
                        ++start
                    ) {
                        // range offset = 0
                        if(format4.idRangeOffset[i] === 0) {
                            codes[start] = (start + format4.idDelta[i]) % 65536;
                        }
                        // rely on to glyphIndexArray
                        else {
                            var index = i + format4.idRangeOffset[i] / 2
                                + (start - format4.startCode[i])
                                - graphIdArrayIndexOffset;

                            var graphId = format4.glyphIdArray[index];
                            if(graphId !== 0) {
                                codes[start] = (graphId + format4.idDelta[i]) % 65536;
                            }
                            else {
                                codes[start] = 0;
                            }

                        }
                    }
                }

                return codes;
            }   
            else {
                return {};
            }
        }

        /**
         * 关联glyf相关的信息
         */
        function resolveGlyf(ttf) {
            var codes = ttf.codes;
            var glyf = ttf.glyf;

            // unicode
            Object.keys(codes).forEach(function(c) {
                var i = codes[c];
                glyf[i].unicode = +c;
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
                nameIndex.forEach(function(name, i) {
                    if (name <= 257) {
                        glyf[i].name = String.fromCharCode(name);
                    }
                    else {
                        glyf[i].name = names[name - 258] || '';
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
            delete ttf.cmap;
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
            ttf.codes = readWindowsAllCodes(ttf);
            resolveGlyf.call(this, ttf);
            cleanTables.call(this, ttf);
            return ttf;
        };


        return TTFReader;
    }
);
