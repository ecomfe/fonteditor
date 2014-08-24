/**
 * @file support.js
 * @author mengke01
 * @date 
 * @description
 * 列举支持的表
 */


define(
    function(require) {

        var support = {
            'head': require('./head'),
            'maxp': require('./maxp'),
            'loca': require('./loca'),
            'glyf': require('./glyf'),
            'cmap': require('./cmap'),
            'name': require('./name'),
            'gasp': require('./gasp'),
            'hhea': require('./hhea'),
            'hmtx': require('./hhea'),
            'post': require('./post')
        };

        return support;
    }
);
