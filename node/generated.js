var string = require('../common/string');
var error = {
    10001: '\u8D85\u51FA\u8BFB\u53D6\u8303\u56F4\uFF1A${0}, ${1}',
    10002: '\u8D85\u51FA\u5199\u5165\u8303\u56F4\uFF1A${0}, ${1}',
    10003: '\u672A\u77E5\u6570\u636E\u7C7B\u578B\uFF1A${0}, ${1}',
    10004: '\u4E0D\u652F\u6301svg\u89E3\u6790',
    10101: '\u9519\u8BEF\u7684ttf\u6587\u4EF6',
    10102: '\u9519\u8BEF\u7684woff\u6587\u4EF6',
    10103: '\u9519\u8BEF\u7684svg\u6587\u4EF6',
    10104: '\u8BFB\u53D6ttf\u6587\u4EF6\u9519\u8BEF',
    10105: '\u8BFB\u53D6woff\u6587\u4EF6\u9519\u8BEF',
    10106: '\u8BFB\u53D6svg\u6587\u4EF6\u9519\u8BEF',
    10107: '\u5199\u5165ttf\u6587\u4EF6\u9519\u8BEF',
    10108: '\u5199\u5165woff\u6587\u4EF6\u9519\u8BEF',
    10109: '\u5199\u5165svg\u6587\u4EF6\u9519\u8BEF',
    10110: '\u8BFB\u53D6eot\u6587\u4EF6\u9519\u8BEF',
    10111: '\u8BFB\u53D6eot\u5B57\u4F53\u9519\u8BEF',
    10200: '\u91CD\u590D\u7684unicode\u4EE3\u7801\u70B9\uFF0C\u5B57\u5F62\u5E8F\u53F7\uFF1A${0}',
    10201: '\u5B57\u5F62\u8F6E\u5ED3\u6570\u636E\u4E3A\u7A7A',
    10202: '\u4E0D\u652F\u6301\u6807\u5FD7\u4F4D\uFF1AARGS_ARE_XY_VALUES',
    10203: '\u672A\u627E\u5230\u8868\uFF1A${0}',
    10204: '\u8BFB\u53D6\u8868\u9519\u8BEF',
    10205: '\u672A\u627E\u5230\u89E3\u538B\u51FD\u6570'
};
error.raise = function (number) {
    var message = error[number];
    if (arguments.length > 1) {
        var args = typeof arguments[1] === 'object' ? arguments[1] : Array.prototype.slice.call(arguments, 1);
        message = string.format(message, args);
    }
    var e = new Error(message);
    e.number = number;
    throw e;
};
module.exports = error;