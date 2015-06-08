/**
 * @file 导入和导出设置
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {

        var setting = {

            'saveSetting': true, // 是否保存setting

            // 导入
            'import': {
                combinePath: true // 导入svg文件时合并`path`标签
            },

            // 导出
            'export': {
                saveWithGlyfName: true // 导出字体时保存字形的名字
            }
        };

        return setting;
    }
);
