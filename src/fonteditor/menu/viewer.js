/**
 * @file glyph列表相关命令
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {
        var ei18n = require('editor/i18n/i18n');
        var i18n = require('../i18n/i18n');
        return [
            {
                name: 'copy',
                title: ei18n.lang.copy,
                quickKey: 'C',
                disabled: true
            },
            {
                name: 'cut',
                title: ei18n.lang.cut,
                quickKey: 'X'
            },
            {
                name: 'paste',
                title: ei18n.lang.paste,
                quickKey: 'V'
            },
            {
                name: 'del',
                title: ei18n.lang.del,
                quickKey: 'D',
                disabled: true
            },
            {
                type: 'split'
            },
            {
                name: 'adjust-pos',
                title: ei18n.lang.adjustpos
            },
            {
                name: 'adjust-glyph',
                title: ei18n.lang.adjustglyph
            },
            {
                name: 'setting-font',
                title: ei18n.lang.fontsetting,
                disabled: true
            },
            {
                type: 'split'
            },
            {
                name: 'find-glyph',
                title: i18n.lang.findglyph
            },
            {
                name: 'download-glyph',
                title: i18n.lang.downloadglyph
            },
            {
                type: 'split'
            },
            {
                name: 'setting-unicode',
                title: i18n.lang.setunicode
            },
            {
                name: 'setting-sync',
                title: i18n.lang.syncfont
            }
        ];
    }
);
