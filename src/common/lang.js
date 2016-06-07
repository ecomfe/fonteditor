/**
 * @file 语言相关函数
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {
        var lang = require('fonteditor-core/common/lang');

        lang.parseQuery = function (querystring) {
            var query = querystring.split('&')
                .map(function (item) {
                    item = item.split('=');
                    return [item[0], decodeURIComponent(item[1])];
                })
                .reduce(function (query, item) {
                    query[item[0]] = item[1];
                    return query;
                }, {});
            return query;
        };
        return lang;
    }
);
