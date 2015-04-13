/**
 * @file 获取空的ttf对象
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {
        var lang = require('common/lang');
        var emptyttf = require('./data/empty');
        var config = require('./data/default');


        function getEmpty() {
            var ttf = lang.clone(emptyttf);
            lang.extend(ttf.name, config.name);
            ttf.head.created = Date.now();
            return ttf;
        }

        return getEmpty;
    }
);
