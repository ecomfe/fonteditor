/**
 * @file 默认的ttf字体配置
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        var config = {

            // 默认的字体编码
            fontId: 'fonteditor',

            // 默认的名字集合
            name: {
                // 默认的字体家族
                fontFamily: 'fonteditor',
                fontSubFamily: 'Medium',
                uniqueSubFamily: 'FontEditor 1.0 : fonteditor',
                version: 'Version 1.0; FontEditor (v1.0)',
                postScriptName: 'fonteditor'
            }
        };

        return config;
    }
);
