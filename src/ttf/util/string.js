/**
 * @file string.js
 * @author mengke01
 * @date 
 * @description
 * string工具箱
 * 
 * see svg2ttf @ github
 */

define(
    function(require) {


        var string = {
            
            /**
             * 转换成utf8的字节数组
             * 
             * @param {string} str 字符串
             * @return {Array.<byte>} 字节数组
             */
            toUTF8Bytes: function(str) {
                var byteArray = [];
                for (var i = 0; i < str.length; i++) {
                    if (str.charCodeAt(i) <= 0x7F) {
                        byteArray.push(str.charCodeAt(i));
                    }
                    else {
                        var h = encodeURIComponent(str.charAt(i)).substr(1).split('%');
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
             * 读取poststring
             * 
             * @param {Array.<byte>} byteArray byte数组
             * @return {Array.<string>} 读取后的字符串数组
             */
            readPascalString: function (byteArray) {
                var strArray = [];
                var i = 0;
                var l = byteArray.length;
                while(i < l) {
                    var strLength = byteArray[i];
                    var str = '';
                    while(strLength-- >= 0 && i < l) {
                        str += String.fromCharCode(byteArray[++i]);
                    }
                    strArray.push(str);
                }
                return strArray;
            }

        };

        return string;
    }
);