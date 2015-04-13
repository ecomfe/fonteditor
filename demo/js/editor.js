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
        var shape_baidu = require('demo/../data/contours-1');

        var currentEditor;

        var entry = {

            /**
             * 初始化
             */
            init: function () {
                currentEditor = editor.create($('#render-view').get(0));
                window.editor = currentEditor.setFont(shape_baidu);
                //currentEditor.blur();

            }
        };

        entry.init();

        return entry;
    }
);
