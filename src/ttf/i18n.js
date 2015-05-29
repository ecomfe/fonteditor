/**
 * @file 语言字符串管理
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {
        var I18n = require('common/I18n');

        var zh = {
            // error define
            10001: '超出读取范围：${0}, ${1}',
            10002: '超出写入范围：${0}, ${1}',
            10003: '未知数据类型：${0}, ${1}',
            10004: '不支持svg解析',

            10101: '错误的ttf文件',
            10102: '错误的woff文件',
            10103: '错误的svg文件',
            10104: '读取ttf文件错误',
            10105: '读取woff文件错误',
            10106: '读取svg文件错误',
            10107: '写入ttf文件错误',
            10108: '写入woff文件错误',
            10109: '写入svg文件错误',

            10110: '读取eot文件错误',
            10111: '读取eot字体错误',

            10200: '重复的unicode代码点，字形序号：${0}',
            10201: 'ttf字形轮廓数据为空',
            10202: '不支持标志位：ARGS_ARE_XY_VALUES',
            10203: '未找到表：${0}',
            10204: '读取ttf表错误',
            10205: '未找到解压函数',

            10301: '错误的otf文件',
            10302: '读取otf表错误',
            10303: 'otf字形轮廓数据为空'
        };


        var en = {
            // error define
            10001: 'Reading index out of range: ${0}, ${1}',
            10002: 'Writing index out of range: ${0}, ${1}',
            10003: 'Unknown datatype: ${0}, ${1}',
            10004: 'No svg parser',

            10101: 'ttf file damaged',
            10102: 'woff file damaged',
            10103: 'svg file damaged',
            10104: 'Read ttf error',
            10105: 'Read woff error',
            10106: 'Read svg error',
            10107: 'Write ttf error',
            10108: 'Write woff error',
            10109: 'Write svg error',

            10110: 'Read eot error',
            10111: 'Write eot error',

            10200: 'Repeat unicode, glyph index: ${0}',
            10201: 'ttf `glyph` data is empty',
            10202: 'Not support compound glyph flag: ARGS_ARE_XY_VALUES',
            10203: 'No ttf table: ${0}',
            10204: 'Read ttf table data error',
            10205: 'No zip deflate function',

            10301: 'otf file damaged',
            10302: 'Read otf table error',
            10303: 'otf `glyph` data is empty'
        };


        return new I18n(
            [
                ['zh-cn', zh],
                ['en-us', en]
            ],
            window && window.language
        );
    }
);
