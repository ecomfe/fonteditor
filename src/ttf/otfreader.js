/**
 * @file otf字体读取
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {
        var Directory = require('./table/directory');
        var supportTables = require('./table/support-otf');
        var Reader = require('./reader');
        var error = require('./error');


        /**
         * 初始化
         *
         * @param {ArrayBuffer} buffer buffer对象
         * @return {Object} ttf对象
         */
        function read(buffer) {

            var reader = new Reader(buffer, 0, buffer.byteLength, false);

            var font = {};

            // version
            font.version = reader.readString(0, 4);

            if (font.version !== 'OTTO') {
                error.raise(10301);
            }

            // num tables
            font.numTables = reader.readUint16();

            if (font.numTables <= 0 || font.numTables > 100) {
                error.raise(10302);
            }

            // searchRenge
            font.searchRenge = reader.readUint16();

            // entrySelector
            font.entrySelector = reader.readUint16();

            // rengeShift
            font.rengeShift = reader.readUint16();

            font.tables = new Directory(reader.offset).read(reader, font);

            if (!font.tables.head || !font.tables.cmap || !font.tables.CFF) {
                error.raise(10302);
            }

            font.readOptions = this.options;

            // 读取支持的表数据
            Object.keys(supportTables).forEach(function (tableName) {
                if (font.tables[tableName]) {
                    var offset = font.tables[tableName].offset;
                    font[tableName] = new supportTables[tableName](offset).read(reader, font);
                }
            });

            if (!font.CFF.glyf) {
                error.raise(10303);
            }

            reader.dispose();

            return font;
        }

        /**
         * 关联glyf相关的信息
         * @param {Object} font font对象
         */
        function resolveGlyf(font) {

            var codes = font.cmap;
            var glyf = font.CFF.glyf;

            // unicode
            Object.keys(codes).forEach(function (c) {
                var i = codes[c];
                if (!glyf[i].unicode) {
                    glyf[i].unicode = [];
                }
                glyf[i].unicode.push(+c);
            });

            // leftSideBearing
            font.hmtx.forEach(function (item, i) {
                glyf[i].advanceWidth = glyf[i].advanceWidth || item.advanceWidth || 0;
                glyf[i].leftSideBearing = item.leftSideBearing;
            });

            font.glyf = glyf;
        }


        /**
         * 清除非必须的表
         * @param {Object} font font对象
         */
        function cleanTables(font) {
            delete font.readOptions;
            delete font.tables;
            delete font.hmtx;
            delete font.post.glyphNameIndex;
            delete font.post.names;

            // 删除无用的表
            var cff = font.CFF;
            delete cff.glyf;
            delete cff.charset;
            delete cff.encoding;
            delete cff.gsubrs;
            delete cff.gsubrsBias;
            delete cff.subrs;
            delete cff.subrsBias;
        }

        /**
         * OTF读取函数
         * @param {Object} options 写入参数
         * @constructor
         */
        function OTFReader(options) {
            options = options || {};
            this.options = options;
        }

        /**
         * 获取解析后的ttf文档
         * @param {ArrayBuffer} buffer buffer对象
         *
         * @return {Object} ttf文档
         */
        OTFReader.prototype.read = function (buffer) {
            this.font = read.call(this, buffer);
            resolveGlyf.call(this, this.font);
            cleanTables.call(this, this.font);
            return this.font;
        };

        /**
         * 注销
         */
        OTFReader.prototype.dispose = function () {
            delete this.font;
            delete this.options;
        };

        return OTFReader;
    }
);
