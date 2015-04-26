/**
 * @file otf字体格式支持的表
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {

        var support = {
            'head': require('./head'),
            'maxp': require('./maxp'),
            'cmap': require('./cmap'),
            'name': require('./name'),
            'hhea': require('./hhea'),
            'hmtx': require('./hmtx'),
            'post': require('./post'),
            'OS/2': require('./OS2'),
            'CFF': require('./CFF')
        };

        return support;
    }
);
