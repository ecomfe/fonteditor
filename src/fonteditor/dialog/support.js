/**
 * @file 支持的设置项目
 * @author mengke01(kekee000@gmail.com)
 */

import unicode from '../dialog/setting-unicode';
import name from '../dialog/setting-name';
import adjustpos from '../dialog/setting-adjust-pos';
import adjustglyf from '../dialog/setting-adjust-glyf';
import metrics from '../dialog/setting-metrics';
import online from '../dialog/font-online';
import url from '../dialog/font-url';
import glyf from '../dialog/setting-glyf';
import editor from '../dialog/setting-editor';
import findglyf from '../dialog/setting-find-glyf';
import ie from '../dialog/setting-ie';
import importpic from '../dialog/setting-import-pic';
import sync from '../dialog/setting-sync';
import glyfdownload from '../dialog/glyf-download';

export default {
    unicode,
    name,
    'adjust-pos': adjustpos,
    'adjust-glyf': adjustglyf,
    metrics,
    online,
    url,
    glyf,
    editor,
    'find-glyf': findglyf,
    ie,
    'import-pic': importpic,
    sync,
    'glyf-download': glyfdownload
};
