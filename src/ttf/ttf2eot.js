/**
 * @file ttf转eot
 * @author mengke01(kekee000@gmail.com)
 *
 * reference:
 * http://www.w3.org/Submission/EOT/
 * https://github.com/fontello/ttf2eot/blob/master/index.js
 */


define(
    function (require) {
        var Reader = require('./reader');
        var Writer = require('./writer');
        var string = require('./util/string');
        var error = require('./error');
        var table = require('./table/table');
        var struct =  require('./table/struct');
        var NameTbl =  require('./table/name');

        var EotHead = table.create(
            'head',
            [
                ['EOTSize', struct.Uint32],
                ['FontDataSize', struct.Uint32],
                ['Version', struct.Uint32],
                ['Flags', struct.Uint32],
                ['PANOSE', struct.Bytes, 10],
                ['Charset', struct.Uint8],
                ['Italic', struct.Uint8],
                ['Weight', struct.Uint32],
                ['fsType', struct.Uint16],
                ['MagicNumber', struct.Uint16],
                ['UnicodeRange', struct.Bytes, 16],
                ['CodePageRange', struct.Bytes, 8],
                ['CheckSumAdjustment', struct.Uint32],
                ['Reserved', struct.Bytes, 16],
                ['Padding1', struct.Uint16]
            ]
        );

        /**
         * ttf格式转换成eot字体格式
         *
         * @param {ArrayBuffer} ttfBuffer ttf缓冲数组
         * @param {Object} options 选项
         * @return {ArrayBuffer} eot格式byte流
         */
        function ttf2eot(ttfBuffer, options) {
            options = options || {};
            // 构造eot头部
            var eotHead = new EotHead();
            var eotHeaderSize = eotHead.size();
            var eot = {};
            eot.head = eotHead.read(new Reader(new ArrayBuffer(eotHeaderSize)));

            // set fields
            eot.head.FontDataSize = ttfBuffer.byteLength || ttfBuffer.length;
            eot.head.Version = 0x20001;
            eot.head.Flags = 0;
            eot.head.Charset = 0x1;
            eot.head.MagicNumber = 0x504C;
            eot.head.Padding1 = 0;

            var ttfReader = new Reader(ttfBuffer);
            // 读取ttf表个数
            var numTables = ttfReader.readUint16(4);

            if (numTables <= 0 || numTables > 100) {
                error.raise(10101);
            }

            // 读取ttf表索引信息
            ttfReader.seek(12);
            // 需要读取3个表内容，设置3个byte
            var tblReaded = 0;
            for (var i = 0; i < numTables && tblReaded !== 0x7; ++i) {

                var tableEntry = {
                    tag: ttfReader.readString(ttfReader.offset, 4),
                    checkSum: ttfReader.readUint32(),
                    offset: ttfReader.readUint32(),
                    length: ttfReader.readUint32()
                };

                var entryOffset = ttfReader.offset;

                if (tableEntry.tag === 'head') {
                    eot.head.CheckSumAdjustment = ttfReader.readUint32(tableEntry.offset + 8);
                    tblReaded += 0x1;
                }
                else if (tableEntry.tag === 'OS/2') {
                    eot.head.PANOSE = ttfReader.readBytes(tableEntry.offset + 32, 10);
                    eot.head.Italic = ttfReader.readUint16(tableEntry.offset + 62);
                    eot.head.Weight = ttfReader.readUint16(tableEntry.offset + 4);
                    eot.head.fsType = ttfReader.readUint16(tableEntry.offset + 8);
                    eot.head.UnicodeRange = ttfReader.readBytes(tableEntry.offset + 42, 16);
                    eot.head.CodePageRange = ttfReader.readBytes(tableEntry.offset + 78, 8);
                    tblReaded += 0x2;
                }

                // 设置名字信息
                else if (tableEntry.tag === 'name') {
                    var names = new NameTbl(tableEntry.offset).read(ttfReader);

                    eot.FamilyName = string.toUCS2Bytes(names.fontFamily || '');
                    eot.FamilyNameSize = eot.FamilyName.length;

                    eot.StyleName = string.toUCS2Bytes(names.fontStyle || '');
                    eot.StyleNameSize = eot.StyleName.length;

                    eot.VersionName = string.toUCS2Bytes(names.version || '');
                    eot.VersionNameSize = eot.VersionName.length;

                    eot.FullName = string.toUCS2Bytes(names.fullName || '');
                    eot.FullNameSize = eot.FullName.length;

                    tblReaded += 0x3;
                }

                ttfReader.seek(entryOffset);
            }

            // 计算size
            eot.head.EOTSize = eotHeaderSize
                + 4 + eot.FamilyNameSize
                + 4 + eot.StyleNameSize
                + 4 + eot.VersionNameSize
                + 4 + eot.FullNameSize
                + 2
                + eot.head.FontDataSize;

            // 这里用小尾方式写入
            var eotWriter = new Writer(new ArrayBuffer(eot.head.EOTSize), 0, eot.head.EOTSize, true);

            // write head
            eotHead.write(eotWriter, eot);

            // write names
            eotWriter.writeUint16(eot.FamilyNameSize);
            eotWriter.writeBytes(eot.FamilyName, eot.FamilyNameSize);
            eotWriter.writeUint16(0);

            eotWriter.writeUint16(eot.StyleNameSize);
            eotWriter.writeBytes(eot.StyleName, eot.StyleNameSize);
            eotWriter.writeUint16(0);

            eotWriter.writeUint16(eot.VersionNameSize);
            eotWriter.writeBytes(eot.VersionName, eot.VersionNameSize);
            eotWriter.writeUint16(0);

            eotWriter.writeUint16(eot.FullNameSize);
            eotWriter.writeBytes(eot.FullName, eot.FullNameSize);
            eotWriter.writeUint16(0);

            // write rootstring
            eotWriter.writeUint16(0);

            eotWriter.writeBytes(ttfBuffer, eot.head.FontDataSize);

            return eotWriter.getBuffer();
        }

        return ttf2eot;
    }
);
