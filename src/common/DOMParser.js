/**
 * @file DOM解析器，兼容node端和浏览器端
 * @author mengke01(kekee000@gmail.com)
 */

/* eslint-disable no-undef */

if (typeof exports !== 'undefined') {
    module.exports = require('xmldom').DOMParser;
}
else {
    define(
        function (require) {
            return window.DOMParser;
        }
    );
}
