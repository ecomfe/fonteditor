/**
 * @file ie.js
 * @author mengke01
 * @date
 * @description
 * 导入和导出设置
 */

define(
    function (require) {

        var setting = {

            'saveSetting': true, // 是否保存setting

            // 导入
            'import': {
                combinePath: false // 导入svg文件时合并`path`标签
            },

            // 导出
            'export': {
            }
        };

        return setting;
    }
);
