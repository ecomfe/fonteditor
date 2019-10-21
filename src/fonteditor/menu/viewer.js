/**
 * @file glyf列表相关命令
 * @author mengke01(kekee000@gmail.com)
 */

import ei18n from 'editor/i18n/i18n';
import i18n from '../i18n/i18n';
export default [
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
