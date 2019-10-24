/**
 * @file 语言相关函数
 * @author mengke01(kekee000@gmail.com)
 */

import {
    clone,
    overwrite,
    debounce,
    throttle,
    equals
} from 'fonteditor-core/common/lang';

export default {
    clone,
    overwrite,
    debounce,
    throttle,
    equals,
    parseQuery(querystring) {
        let query = querystring.split('&')
            .map(function (item) {
                item = item.split('=');
                return [item[0], decodeURIComponent(item[1])];
            })
            .reduce(function (query, item) {
                query[item[0]] = item[1];
                return query;
            }, {});
        return query;
    }
};
