/**
 * @file editorMode.js
 * @author mengke01
 * @date 
 * @description
 * 编辑器模式集合
 */


define(
    function(require) {
        return {
            'bound': require('./bound'),
            'point': require('./point'),
            'range': require('./range'),
            'default': require('./bound')
        };
    }
);
