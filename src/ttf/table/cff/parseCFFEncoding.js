/**
 * @file 解析cff编码
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {


        /**
         * 解析cff encoding数据
         * See Adobe TN #5176 chapter 12, "Encodings".
         * @param  {Object} reader 读取器
         * @param  {number=} start  偏移
         * @return {Object}        编码表
         */
        function parseCFFEncoding(reader, start) {
            if (null != start) {
                reader.seek(start);
            }

            var i;
            var code;
            var encoding = {};
            var format = reader.readUint8();

            if (format === 0) {
                var nCodes = reader.readUint8();
                for (i = 0; i < nCodes; i += 1) {
                    code = reader.readUint8();
                    encoding[code] = i;
                }
            }
            else if (format === 1) {
                var nRanges = reader.readUint8();
                code = 1;
                for (i = 0; i < nRanges; i += 1) {
                    var first = reader.readUint8();
                    var nLeft = reader.readUint8();
                    for (var j = first; j <= first + nLeft; j += 1) {
                        encoding[j] = code;
                        code += 1;
                    }
                }
            }
            else {
                console.warn('unknown encoding format:' + format);
            }

            return encoding;
        }

        return parseCFFEncoding;
    }
);
