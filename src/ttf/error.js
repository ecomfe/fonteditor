/**
 * @file ttf 相关错误号定义
 * @author mengke01(kekee000@gmail.com)
 */

define(function (require) {

    var string = require('common/string');

    var error = require('./i18n').lang;

    /**
     * 抛出一个异常
     *
     * @param  {number} number 异常号
     */
    error.raise = function (number) {

        var message = error[number];

        if (arguments.length > 1) {
            var args = typeof arguments[1] === 'object'
                ? arguments[1]
                : Array.prototype.slice.call(arguments, 1);
            message = string.format(message, args);
        }

        var e = new Error(message);
        e.number = number;

        throw e;
    };

    return error;
});
