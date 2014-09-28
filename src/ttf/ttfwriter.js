/**
 * @file ttfwriter.js
 * @author mengke01
 * @date 
 * @description
 * 写ttf文件
 */


define(
    function(require) {

        var Reader = require('./reader');
        var Writer = require('./writer');
        var Directory = require('./table/directory');
        var supportTables = require('./table/support');

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
         */
        function resolve() {
            var ttf = this.ttf;
            ttf.numTables = tableList.length;
            ttf.entrySelector = Math.floor(Math.log(tableList.length)/Math.LN2);
            ttf.searchRange = Math.pow(2, ttf.entrySelector) * 16;
            ttf.rangeShift = tableList.length * 16 - ttf.searchRange;
        }


        /**
         * 写ttf文件
         */
        function write() {
            var ttf = this.ttf;

            // 用来做写入缓存的对象，用完后删掉
            ttf.support = {};


            // 写入maxp
            var maxpTbl = new supportTables['maxp']();
            var size = maxpTbl.size(ttf);

            // 写入glyf
            var glyfTbl = new supportTables['glyf']();
            var size = glyfTbl.size(ttf);

            var glyfWriter = new Writer(new ArrayBuffer(size));
            glyfTbl.write(glyfWriter, ttf);

            // 写入loca
            var locaTbl = new supportTables['loca']();
            var locaWriter = new Writer(new ArrayBuffer(locaTbl.size(ttf)));
            locaTbl.write(locaWriter, ttf);



            // 读取测试
            var locaReader = new Reader(locaWriter.getBuffer());
            locaTbl.offset = 0;
            ttf.loca = locaTbl.read(locaReader, ttf);

            var glyfReader = new Reader(glyfWriter.getBuffer());
            glyfTbl.offset = 0;
            ttf.glyfReaded = glyfTbl.read(glyfReader, ttf);

            console.log(ttf.glyfReaded);

            // var ttfSize = 20 + tableList.length * 16;
            // ttf.tables = [];
            // tableList.forEach(function(tableName) {
            //     var size = new supportTables[tableName]().size(ttf);
            //     ttfSize += size;
            //     ttf.tables.push({
            //         name: tableName,
            //         checkSum: 0,
            //         offset: 0,
            //         length: size
            //     });
            // });

            // var writer = new Writer(new ArrayBuffer(ttfSize));
            // writer.writeFixed(ttf.version);
            // writer.writeUint16(ttf.numTables);
            // writer.writeUint16(ttf.searchRange);
            // writer.writeUint16(ttf.entrySelector);
            // writer.writeUint16(ttf.rangeShift);
            // new Directory().write(writer, ttf);

            // // 读取支持的表数据
            // tableList.forEach(function(tableName) {
            //     new supportTables[tableName]().write(writer, ttf);
            // });

            return new ArrayBuffer(10);
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
