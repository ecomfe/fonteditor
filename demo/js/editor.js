/**
 * @file render.js
 * @author mengke01
 * @date 
 * @description
 * editor 组件测试
 */

define(
    function(require) {

        var editor = require('editor/main');
        var shape_baidu = require('./shape-baidu');

        var currentEditor;

        var entry = {

            /**
             * 初始化
             */
            init: function () {
                currentEditor = editor.create($('#render-view').get(0));
                currentEditor.setFont(shape_baidu);
                //currentEditor.blur();
                
            }
        };

        entry.init();
        
        return entry;
    }
);
