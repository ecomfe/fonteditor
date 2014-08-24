/**
 * @file pad.js
 * @author mengke01
 * @date 
 * @description
 * 使用指定字符填充
 */


define(
    function(require) {

        /**
         * 使用指定字符填充字符串,默认`0`
         * 
         * @param {string} str 字符串
         * @param {number} size 填充到的大小
         * @param {string=} ch 填充字符
         * @return {string} 字符串
         */
        function pad(str, size, ch) {
            if(str.length > size) {
                return str.slice(str.length - size);
            }
            return new Array(size - str.length + 1).join(ch || '0') + str;
        }

        return pad;
    }
);
