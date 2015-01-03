/**
 * @file unicode2xml.js
 * @author mengke01
 * @date
 * @description
 * unicode 转xml字符
 */

define(
    function (require) {

        var string = require('common/string');

        /**
         * unicode 转xml编码格式
         *
         * @param {Array.<number>} unicodeList unicode字符列表
         * @return {string} xml编码格式
         */
        function unicode2xml(unicodeList) {
            if (typeof unicodeList === 'number') {
                unicodeList = [unicodeList];
            }
            return unicodeList.map(function (u) {
                if (u < 0x20) {
                    return '';
                }
                return u >= 0x20 && u <= 255
                    ? string.encodeHTML(String.fromCharCode(u).toLowerCase())
                    : '&#x' + u.toString(16) + ';';
            }).join('');
        }

        return unicode2xml;
    }
);
