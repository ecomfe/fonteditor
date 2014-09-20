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
            'addshape': require('./addshape'),
            'addrect': require('./addrect'),
            'addcircle': require('./addcircle'),
            'referenceline': require('./referenceline')
        };
    }
);
