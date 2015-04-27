/**
 * @file 编辑器支持的模式集合
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {
        return {
            'point': require('./point'),
            'range': require('./range'),
            'pan': require('./pan'),
            'default': require('./bound'),
            'shapes': require('./shapes'),
            'addshapes': require('./addshapes'),
            'addpath': require('./addpath'),
            'split': require('./split'),
            'referenceline': require('./referenceline')
        };
    }
);
