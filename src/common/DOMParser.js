/**
 * @file DOM解析器，兼容node端和浏览器端
 * @author mengke01(kekee000@gmail.com)
 */

if (typeof exports !== 'undefined') {
    module.exports = exports = require('xmldom').DOMParser;
}
else {
    define(
        function (require) {
            return window.DOMParser;
        }
    );
}
