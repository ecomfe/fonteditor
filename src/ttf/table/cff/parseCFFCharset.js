/**
 * @file 解析cff字符集
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {
        var getCFFString = require('./getCFFString');

        // Parse the CFF charset table, which contains internal names for all the glyphs.
        // This function will return a list of glyph names.
        // See Adobe TN #5176 chapter 13, "Charsets".
        function parseCFFCharset(reader, start, nGlyphs, strings) {
            if (start) {
                reader.seek(start);
            }

            var i;
            var sid;
            var count;
            // The .notdef glyph is not included, so subtract 1.
            nGlyphs -= 1;
            var charset = ['.notdef'];

            var format = reader.readUint8();
            if (format === 0) {
                for (i = 0; i < nGlyphs; i += 1) {
                    sid = reader.readUint16();
                    charset.push(getCFFString(strings, sid));
                }
            }
            else if (format === 1) {
                while (charset.length <= nGlyphs) {
                    sid = reader.readUint16();
                    count = reader.readUint8();
                    for (i = 0; i <= count; i += 1) {
                        charset.push(getCFFString(strings, sid));
                        sid += 1;
                    }
                }
            }
            else if (format === 2) {
                while (charset.length <= nGlyphs) {
                    sid = reader.readUint16();
                    count = reader.readUint16();
                    for (i = 0; i <= count; i += 1) {
                        charset.push(getCFFString(strings, sid));
                        sid += 1;
                    }
                }
            }
            else {
                throw new Error('Unknown charset format ' + format);
            }

            return charset;
        }

        return parseCFFCharset;
    }
);
