/**
 * @file error.js
 * @author mengke01
 * @date 
 * @description
 * ttf 相关错误号定义
 */


define(
    function(require) {

        var error = {
            10001: '错误的ttf文件',
            10002: '错误的woff文件',
            10003: '错误的svg文件',
            10004: '读取ttf文件错误',
            10005: '读取woff文件错误',
            10006: '读取svg文件错误',
            10007: '写入ttf文件错误',
            10008: '写入woff文件错误',
            10009: '写入svg文件错误',

            10010: '重复的unicode代码点',
        };

        error.throw = function(number) {
            throw new Error(number, error[number]);
        };

        return error;
    }
);
