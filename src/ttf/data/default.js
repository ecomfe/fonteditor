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
                version: 'Version 1.0 ; FontEditor (v0.0.1) -l 8 -r 50 -G 200 -x 14 -w \"G\" -f -s',
                postScriptName: 'fonteditor'
            }
        };

        return config;
    }
);
