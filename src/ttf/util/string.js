/**
 * @file ttf字符串相关函数
 * @author mengke01(kekee000@gmail.com)
 *
 * references:
 * 1. svg2ttf @ github
 */

define(
    function (require) {

        var unicodeName = require('../enum/unicodeName');
        var postName = require('../enum/postName');

        /**
         * 将unicode编码转换成js内部编码，
         * 有时候单子节的字符会编码成类似`\u0020`, 这里还原单字节
         *
         * @param {string} str str字符串
         * @return {string} 转换后字符串
         */
        function stringify(str) {
            if (!str) {
                return str;
            }

            var newStr = '';
            for (var i = 0, l = str.length, ch; i < l; i++) {
                ch = str.charCodeAt(i);
                if (ch === 0) {
                    continue;
                }
                newStr += String.fromCharCode(ch);
            }
            return newStr;
        }

        var string = {

            stringify: stringify,

            /**
             * bytes to string
             * @param  {Array} bytes 字节数组
             * @return {string}       string
             */
            getString: function (bytes) {
                var s = '';
                for (var i = 0, l = bytes.length; i < l; i++) {
                    s += String.fromCharCode(bytes[i]);
                }
                return s;
            },

            /**
             * 获取unicode的名字值
             *
             * @param {number} unicode unicode
             * @return {string} 名字
             */
            getUnicodeName: function (unicode) {
                var unicodeNameIndex = unicodeName[unicode];
                if (undefined !== unicodeNameIndex) {
                    return postName[unicodeNameIndex];
                }

                return 'uni' + unicode.toString(16).toUpperCase();
            },

            /**
             * 转换成utf8的字节数组
             *
             * @param {string} str 字符串
             * @return {Array.<byte>} 字节数组
             */
            toUTF8Bytes: function (str) {
                str = stringify(str);
                var byteArray = [];
                for (var i = 0, l = str.length; i < l; i++) {
                    if (str.charCodeAt(i) <= 0x7F) {
                        byteArray.push(str.charCodeAt(i));
                    }
                    else {
                        var h = encodeURIComponent(str.charAt(i)).slice(1).split('%');
                        for (var j = 0; j < h.length; j++) {
                            byteArray.push(parseInt(h[j], 16));
                        }
                    }
                }
                return byteArray;
            },

            /**
             * 转换成usc2的字节数组
             *
             * @param {string} str 字符串
             * @return {Array.<byte>} 字节数组
             */
            toUCS2Bytes: function (str) {
                str = stringify(str);
                var byteArray = [];

                for (var i = 0, l = str.length, ch; i < l; i++) {
                    ch = str.charCodeAt(i);
                    byteArray.push(ch >> 8);
                    byteArray.push(ch & 0xFF);
                }

                return byteArray;
            },


            /**
             * 获取pascal string 字节数组
             * @param {string} str 字符串
             * @return {Array.<byte>} byteArray byte数组
             */
            toPascalStringBytes: function (str) {
                var bytes = [];
                var length = str ? (str.length < 256 ? str.length : 255) : 0;
                bytes.push(length);

                for (var i = 0, l = str.length; i < l; i++) {
                    var c = str.charCodeAt(i);
                    // non-ASCII characters are substituted with '*'
                    bytes.push(c < 128 ? c : 42);
                }

                return bytes;
            },

            /**
             * utf8字节转字符串
             *
             * @param {Array} bytes 字节
             * @return {string} 字符串
             */
            getUTF8String: function (bytes) {
                var str = '';
                for (var i = 0, l = bytes.length; i < l; i++) {
                    if (bytes[i] < 0x7F) {
                        str += String.fromCharCode(bytes[i]);
                    }
                    else {
                        str += '%' + (256 + bytes[i]).toString(16).slice(1);
                    }
                }
                return decodeURIComponent(str);
            },

            /**
             * ucs2字节转字符串
             *
             * @param {Array} bytes 字节
             * @return {string} 字符串
             */
            getUCS2String: function (bytes) {
                var str = '';
                for (var i = 0, l = bytes.length; i < l; i += 2) {
                    str += String.fromCharCode((bytes[i] << 8) + bytes[i + 1]);
                }
                return str;
            },

            /**
             * 读取 pascal string
             *
             * @param {Array.<byte>} byteArray byte数组
             * @return {Array.<string>} 读取后的字符串数组
             */
            getPascalString: function (byteArray) {
                var strArray = [];
                var i = 0;
                var l = byteArray.length;

                while (i < l) {
                    var strLength = byteArray[i++];
                    var str = '';

                    while (strLength-- > 0 && i < l) {
                        str += String.fromCharCode(byteArray[i++]);
                    }
                    // 这里需要将unicode转换成js编码
                    str = stringify(str);
                    strArray.push(str);
                }

                return strArray;
            }
        };

        return string;
    }
);
