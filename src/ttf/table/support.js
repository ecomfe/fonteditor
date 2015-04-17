/**
 * @file support.js
 * @author mengke01
 * @date
 * @description
 * 列举支持的表
 */


define(
    function (require) {

        var support = {
            'head': require('./head'),
            'maxp': require('./maxp'),
            'loca': require('./loca'),
            'glyf': require('./glyf'),
            'cmap': require('./cmap'),
            'name': require('./name'),
            'hhea': require('./hhea'),
            'hmtx': require('./hmtx'),
            'post': require('./post'),
            'OS/2': require('./OS2'),
            'fpgm': require('./fpgm'),
            'cvt': require('./cvt'),
            'prep': require('./prep'),
            'gasp': require('./gasp')
        };

        return support;
    }
);
