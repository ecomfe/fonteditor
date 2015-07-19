/**
 * @file test-define.js
 * @author mengke01(kekee000@gmail.com)
 */

/* eslint-disable*/

// 测试define函数


        module.exports = require('../common/test').test({
            test1: 'test1',
            test2: 'test2'
        });



// 测试 string


        module.exports = 'test string';



// 测试commonjs wrapper


        module.exports = {
            test1: 'test1',
            test2: 'test2'
        };





// 测试object

module.exports ={
    test1: 'test1',
    test2: 'test2'
};


// 测试多return


        var string = require('../common/string');

        if (string.pad) {
            module.exports = string.pad;
        }
        else {
            module.exports = function (str) {
                return function () {
                    str;
                };
            };
        }



// 测试 nodejs兼容写法

if (typeof exports !== 'undefined') {
    module.exports = exports = require('xmldom').DOMParser;
}
else {

            module.exports = window.DOMParser;

}
