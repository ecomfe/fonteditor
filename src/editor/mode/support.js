/**
 * @file support.js
 * @author mengke01
 * @date 
 * @description
 * 编辑器模式集合
 */


define(
    function(require) {
        return {
            'point': require('./point'),
            'range': require('./range'),
            'default': require('./bound'),
            'shapes': require('./shapes'),
            'addshapes': require('./addshapes'),
            'addpath': require('./addpath'),
            'referenceline': require('./referenceline')
        };
    }
);
