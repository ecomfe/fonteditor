/**
 * @file 语言字符串管理
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {
        var I18n = require('common/I18n');

        return new I18n(
            [
                ['zh-cn', require('./zh-cn/menu')],
                ['en-us', require('./en-us/menu')]
            ]
        );
    }
);
