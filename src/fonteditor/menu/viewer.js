/**
 * @file glyf列表相关命令
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
                name: 'adjust-glyf',
                title: ei18n.lang.adjustglyf
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
                name: 'find-glyf',
                title: i18n.lang.findglyf
            },
            {
                name: 'download-glyf',
                title: i18n.lang.downloadglyf
            },
            {
                name: 'batch-download-glyf',
                title: i18n.lang.batchdownloadglyf
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
