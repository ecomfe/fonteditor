/**
 * @file contoursCombine.js
 * @author mengke01
 * @date
 * @description
 * 路径合并，求交
 */

define(
    function(require) {

        var lang = require('common/lang');
        var editor = require('editor/main');
        var shape_baidu = require('demo/../data/contours-2');
        var isPathCross = require('graphics/isPathCross');
        var util = require('graphics/util');

        var currentEditor;

        var entry = {

            /**
             * 初始化
             */
            init: function () {
                var clonedShape = lang.clone(shape_baidu);

                window.editor = currentEditor = editor.create($('#render-view').get(0));
                currentEditor.setFont(clonedShape);

                var jointLayer = currentEditor.fontLayer;

                var paths = currentEditor.fontLayer.shapes.map(function(shape) {
                    return shape.points;
                });
            }
        };

        entry.init();

        return entry;
    }
);
