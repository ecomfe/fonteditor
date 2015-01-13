/**
 * @file support.js
 * @author mengke01
 * @description
 * 支持的setting集合
 */


define(
    function (require) {

        var support = {
            editor: require('./editor'),
            ie: require('./ie')
        };

        return support;
    }
);
