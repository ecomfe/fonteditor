/**
 * @file ttfwriter.js
 * @author mengke01
 * @date 
 * @description
 * ttfwriter 入口
 */

define(
    function(require) {

        var Writer = require('ttf/writer');
        var Reader = require('ttf/reader');
        var ttf2base64 = require('ttf/ttf2base64');

        var entry = {

            /**
             * 初始化
             */
            init: function () {

                var buffer = new ArrayBuffer(100);
                var writer = new Writer(buffer, 0, 100);

                // 基本类型
                writer.writeInt8(10);
                writer.writeInt16(10);
                writer.writeInt32(10);
                writer.writeUint8(10);
                writer.writeUint16(10);
                writer.writeUint32(10);

                // 扩展类型
                writer.writeString('baidu');
                writer.writeFixed(12.36);
                writer.writeLongDateTime(new Date());

                // 测试seek
                writer.seek(50);
                writer.writeFixed(12.36);
                writer.head();
                writer.writeFixed(12.36);
                writer.writeBytes([3, 4, 5]);

                var reader = new Reader(buffer, 0, 100);


                console.log(reader.readInt8());
                console.log(reader.readInt16());
                console.log(reader.readInt32());
                console.log(reader.readUint8());
                console.log(reader.readUint16());
                console.log(reader.readUint32());

                console.log(reader.readString(reader.offset, 5));
                console.log(reader.readFixed());
                console.log(reader.readLongDateTime());

                console.log(reader.readFixed());
                console.log(reader.readBytes(3));
                console.log(reader.readFixed(50));

                var base64str = 'data:font/ttf;charset=utf-8;base64,' + ttf2base64(buffer.slice(0, 54));

                var saveBtn = $('.saveas');
                saveBtn.attr('href', base64str);
                saveBtn.attr('download', 'save.ttf');

            }
        };

        entry.init();
        
        return entry;
    }
);