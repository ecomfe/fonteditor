/**
 * @file test-define.js
 * @author mengke01(kekee000@gmail.com)
 */


// 测试define函数
define(
    function(require) {

        return require('common/test').test({
            test1: 'test1',
            test2: 'test2'
        });
    }
);


// 测试 string

define(
    function(require) {
        return 'test string';
    }
);


// 测试commonjs wrapper

define('test-module', ['test-module'],
    function(require) {
        return {
            test1: 'test1',
            test2: 'test2'
        };
    }
);




// 测试object

define('test-module', {
    test1: 'test1',
    test2: 'test2'
});


// 测试多return
define(
    function(require) {

        var string = require('common/string');

        if (string.pad) {
            return string.pad;
        }
        else {
            return function (str) {
                return function () {
                    str;
                };
            };
        }
    }
);


// 测试 nodejs兼容写法

if (typeof exports !== 'undefined') {
    module.exports = exports = require('xmldom').DOMParser;
}
else {
    define(
        function (require) {
            return window.DOMParser;
        }
    );
}
