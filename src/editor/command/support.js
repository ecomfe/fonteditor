/**
 * @file support.js
 * @author mengke01
 * @date
 * @description
 * editor 支持的命令列表
 */


define(
    function (require) {
        var lang = require('common/lang');
        var support = {};

        lang.extend(support, require('./shape'));
        lang.extend(support, require('./transform'));
        lang.extend(support, require('./align'));
        lang.extend(support, require('./join'));
        lang.extend(support, require('./referenceline'));
        lang.extend(support, require('./editor'));
        return support;
    }
);
