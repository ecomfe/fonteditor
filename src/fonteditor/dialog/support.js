/**
 * @file 支持的设置项目
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {
        return {
            'unicode': require('../dialog/setting-unicode'),
            'name': require('../dialog/setting-name'),
            'adjust-pos': require('../dialog/setting-adjust-pos'),
            'adjust-glyf': require('../dialog/setting-adjust-glyf'),
            'metrics': require('../dialog/setting-metrics'),
            'online': require('../dialog/font-online'),
            'url': require('../dialog/font-url'),
            'glyf': require('../dialog/setting-glyf'),
            'editor': require('../dialog/setting-editor'),
            'find-glyf': require('../dialog/setting-find-glyf'),
            'ie': require('../dialog/setting-ie'),
            'import-pic': require('../dialog/setting-import-pic'),
            'sync': require('../dialog/setting-sync'),
            'glyf-download': require('../dialog/glyf-download')
        };
    }
);
