
define(
    function (require) {

        var Writer = require('ttf/writer');
        var Reader = require('ttf/reader');

        describe('写基本数据', function () {

            var buffer = new ArrayBuffer(100);

            it('test write basic datatype', function () {
                var writer = new Writer(buffer, 0, 100);

                // 基本类型
                writer.writeInt8(10);
                writer.writeInt16(2442);
                writer.writeInt32(-10);
                writer.writeUint8(10);
                writer.writeUint16(2442);
                writer.writeUint32(5375673);

                var reader = new Reader(buffer, 0, 100);

                expect(reader.readInt8()).toBe(10);
                expect(reader.readInt16()).toBe(2442);
                expect(reader.readInt32()).toBe(-10);
                expect(reader.readUint8()).toBe(10);
                expect(reader.readUint16()).toBe(2442);
                expect(reader.readUint32()).toBe(5375673);
            });


            it('test write extend datatype', function () {
                var writer = new Writer(buffer, 0, 100);
                var now = Math.round(new Date().getTime() / 1000) * 1000;

                // 扩展类型
                writer.writeString('baidu');
                writer.writeFixed(12.36);
                writer.writeLongDateTime(now);
                writer.writeBytes([3, 4, 5]);

                var reader = new Reader(buffer, 0, 100);

                expect(reader.readString(0, 5)).toEqual('baidu');
                expect(reader.readFixed()).toBeCloseTo(12.36, 2);
                expect(reader.readLongDateTime().getTime()).toEqual(now);
                expect(reader.readBytes(3)).toEqual([3, 4, 5]);
            });

            it('test seek', function () {
                var writer = new Writer(buffer, 0, 100);
                // 测试seek
                writer.seek(50);
                writer.writeFixed(12.36);

                var reader = new Reader(buffer, 0, 100);
                reader.seek(50);
                expect(reader.readFixed()).toBeCloseTo(12.36, 2);
            });
        });

        describe('读数据', function () {
            var buffer = new ArrayBuffer(100);
            var writer = new Writer(buffer, 0, 100);
            var now = Math.round(new Date().getTime() / 1000) * 1000;

            // 基本类型
            writer.writeInt8(10);
            writer.writeInt16(2442);
            writer.writeInt32(-10);
            writer.writeUint8(10);
            writer.writeUint16(2442);
            writer.writeUint32(5375673);
            // 扩展类型
            writer.writeString('baidu');
            writer.writeFixed(12.36);
            writer.writeLongDateTime(now);
            writer.writeBytes([3, 4, 5]);



            it('test read basic datatype', function () {
                var reader = new Reader(buffer, 0, 100);
                expect(reader.readInt8()).toBe(10);
                expect(reader.readInt16()).toBe(2442);
                expect(reader.readInt32()).toBe(-10);
                expect(reader.readUint8()).toBe(10);
                expect(reader.readUint16()).toBe(2442);
                expect(reader.readUint32()).toBe(5375673);
            });

            it('test read extend datatype', function () {
                var reader = new Reader(buffer, 0, 100);
                reader.seek(14);
                expect(reader.readString(5)).toEqual('baidu');
                expect(reader.readFixed()).toBeCloseTo(12.36, 2);
                expect(reader.readLongDateTime().getTime()).toEqual(now);
                expect(reader.readBytes(3)).toEqual([3, 4, 5]);
            });

        });

    }
);
