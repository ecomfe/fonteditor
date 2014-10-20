/**
 * @file string.js
 * @author mengke01
 * @date 
 * @description
 * string 工具箱
 * 
 * references:
 * 1. svg2ttf @ github
 */

define(
    function(require) {

        var postName = require('../enum/postName');

        /**
         * 将unicode编码转换成js内部编码
         * 
         * @param {string} str str字符串
         * @return {string} 转换后字符串
         */
        function stringify(str) {
            return decodeURIComponent(encodeURIComponent(str).replace(/%00([\x00-\x7f])/g, '$1'));
        }

        var string = {

            stringify: stringify,

            /**
             * 获取unicode的名字值
             * 
             * @param {number} unicode unicode
             * @return {string} 名字
             */
            getUnicodeName: function(unicode) {
                if (unicode === 0 || unicode === 1 || unicode === 2) {
                    return postName[unicode];
                }
                else {
                    return unicode - 29 < 258 ? postName[unicode - 29] : 'uni' + unicode.toString(16).toUpperCase();
                }
            },

            /**
             * 转换成utf8的字节数组
             * 
             * @param {string} str 字符串
             * @return {Array.<byte>} 字节数组
             */
            toUTF8Bytes: function(str) {
                str = stringify(str);
                var byteArray = [];
                for (var i = 0; i < str.length; i++) {
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
            toUCS2Bytes: function(str) {
                str = stringify(str);
                // Code is taken here:
                // http://stackoverflow.com/questions/6226189/how-to-convert-a-string-to-bytearray
                var byteArray = [];
                var ch;

                for (var i = 0; i < str.length; ++i) {
                    ch = str.charCodeAt(i);
                    byteArray.push(ch >> 8);
                    byteArray.push(ch & 0xFF);
                }

                return byteArray;
            },
            
            /**
             * 读取 pascal string
             * 
             * @param {Array.<byte>} byteArray byte数组
             * @return {Array.<string>} 读取后的字符串数组
             */
            readPascalString: function (byteArray) {
                var strArray = [];
                var i = 0;
                var l = byteArray.length;
                while(i < l) {
                    var strLength = byteArray[i++];
                    var str = '';
                    while(strLength-- > 0 && i < l) {
                        str += String.fromCharCode(byteArray[i++]);
                    }
                    // 这里需要将unicode转换成js编码
                    str = stringify(str);
                    strArray.push(str);
                }

                return strArray;
            },

            /**
             * 获取pascal string 字节数组
             * 
             * @return {Array.<byte>} byteArray byte数组
             */
            getPascalStringBytes: function(str) {
                var bytes = [];
                var length = str ? (str.length < 256 ? str.length : 255) : 0;
                bytes.push(length);
                for (var i = 0; i < length; i ++) {
                    var c = str.charCodeAt(i);
                    bytes.push(c < 128 ? c : 42); //non-ASCII characters are substituted with '*'
                }
              return bytes;
            }

        };

        return string;
    }
);