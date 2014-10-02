/**
 * @file ttfTableWriter.js
 * @author mengke01
 * @date 
 * @description
 * 测试ttf表写
 */

define(
    function(require) {

        var Reader = require('ttf/reader');
        var Writer = require('ttf/writer');
        var Directory = require('ttf/table/directory');
        var supportTables = require('ttf/table/support');


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


        function resolve(ttf) {
            ttf.numTables = tableList.length;
            ttf.entrySelector = Math.floor(Math.log(tableList.length)/Math.LN2);
            ttf.searchRange = Math.pow(2, ttf.entrySelector) * 16;
            ttf.rangeShift = tableList.length * 16 - ttf.searchRange;

            // 将glyf的代码点按小到大排序
            ttf.glyf.forEach(function(glyf) {
                if (glyf.unicode) {
                    glyf.unicode = glyf.unicode.sort();
                }
            });

            return ttf;
        }


        function write(ttf) {

            // 用来做写入缓存的对象，用完后删掉
            ttf.support = {};


            // 写入maxp
            var maxpTbl = new supportTables['maxp']();
            var size = maxpTbl.size(ttf);

            var maxpWriter = new Writer(new ArrayBuffer(size));
            maxpTbl.write(maxpWriter, ttf);

            // 写入glyf
            var glyfTbl = new supportTables['glyf']();
            var size = glyfTbl.size(ttf);

            var glyfWriter = new Writer(new ArrayBuffer(size));
            glyfTbl.write(glyfWriter, ttf);

            // 写入loca
            var locaTbl = new supportTables['loca']();
            var locaWriter = new Writer(new ArrayBuffer(locaTbl.size(ttf)));
            locaTbl.write(locaWriter, ttf);


            // 写入cmap
            var cmapTbl = new supportTables['cmap']();
            var cmapWriter = new Writer(new ArrayBuffer(cmapTbl.size(ttf)));
            cmapTbl.write(cmapWriter, ttf);

            // 写入hmtx
            var hmtxTbl = new supportTables['hmtx']();
            var hmtxWriter = new Writer(new ArrayBuffer(hmtxTbl.size(ttf)));
            hmtxTbl.write(hmtxWriter, ttf);

            // 写入name
            var nameTbl = new supportTables['name']();
            var nameWriter = new Writer(new ArrayBuffer(nameTbl.size(ttf)));
            nameTbl.write(nameWriter, ttf);


            // 写入post
            var postTbl = new supportTables['post']();
            var postWriter = new Writer(new ArrayBuffer(postTbl.size(ttf)));
            postTbl.write(postWriter, ttf);


            // 写入OS2
            var OS2Tbl = new supportTables['OS/2']();
            var OS2Writer = new Writer(new ArrayBuffer(OS2Tbl.size(ttf)));
            OS2Tbl.write(OS2Writer, ttf);


            // 写入hhea
            var hheaTbl = new supportTables['hhea']();
            var hheaWriter = new Writer(new ArrayBuffer(hheaTbl.size(ttf)));
            hheaTbl.write(hheaWriter, ttf);


            // 读取测试

            var maxpReader = new Reader(maxpWriter.getBuffer());
            maxpTbl.offset = 0;
            ttf.maxp = maxpTbl.read(maxpReader, ttf);

            var locaReader = new Reader(locaWriter.getBuffer());
            locaTbl.offset = 0;
            ttf.loca = locaTbl.read(locaReader, ttf);
            console.log('loca readed');
            console.log(ttf.loca);

            var glyfReader = new Reader(glyfWriter.getBuffer());
            glyfTbl.offset = 0;
            var glyf = glyfTbl.read(glyfReader, ttf);
            console.log('glyf readed');
            console.log(glyf);

            var cmapReader = new Reader(cmapWriter.getBuffer());
            cmapTbl.offset = 0;
            var cmap = cmapTbl.read(cmapReader, ttf);
            console.log('cmap readed');
            console.log(cmap);


            var hmtxReader = new Reader(hmtxWriter.getBuffer());
            hmtxTbl.offset = 0;
            var hmtx = hmtxTbl.read(hmtxReader, ttf);
            console.log('hmtx readed');
            console.log(hmtx);


            var nameReader = new Reader(nameWriter.getBuffer());
            nameTbl.offset = 0;
            var name = nameTbl.read(nameReader, ttf);
            console.log('name readed');
            console.log(name);


            var postReader = new Reader(postWriter.getBuffer());
            postTbl.offset = 0;
            ttf.tables = ttf.tables || {};
            ttf.tables.post = {
                length: postWriter.offset
            };
            var post = postTbl.read(postReader, ttf);
            console.log('post readed');
            console.log(post);


            var OS2Reader = new Reader(OS2Writer.getBuffer());
            OS2Tbl.offset = 0;
            var OS2 = OS2Tbl.read(OS2Reader, ttf);
            console.log('OS2 readed');
            console.log(OS2);

            var hheaReader = new Reader(hheaWriter.getBuffer());
            hheaTbl.offset = 0;
            var hhea = hheaTbl.read(hheaReader, ttf);
            console.log('hhea readed');
            console.log(hhea);

            delete ttf.support;
        }



        var entry = {

            init: function () {

                $.getJSON('./js/baiduHealth.json', function(ttf) {
                    resolve(ttf);
                    write(ttf);
                });

            }
        };

        entry.init();
        
        return entry;
    }
);