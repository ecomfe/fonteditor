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
            'adjust-glyph': require('../dialog/setting-adjust-glyph'),
            'metrics': require('../dialog/setting-metrics'),
            'online': require('../dialog/font-online'),
            'url': require('../dialog/font-url'),
            'glyph': require('../dialog/setting-glyph'),
            'editor': require('../dialog/setting-editor'),
            'find-glyph': require('../dialog/setting-find-glyph'),
            'ie': require('../dialog/setting-ie'),
            'import-pic': require('../dialog/setting-import-pic'),
            'sync': require('../dialog/setting-sync'),
            'glyph-download': require('../dialog/glyph-download')
        };
    }
);
