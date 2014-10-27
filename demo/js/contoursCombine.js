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
        var shape_baidu = require('./contours-1');
        var isPathCross = require('graphics/isPathCross');
        var pathJoin = require('graphics/pathJoin');
        var util = require('graphics/util');
        
        var currentEditor;

        var entry = {

            /**
             * 初始化
             */
            init: function () {
                var clonedShape = lang.clone(shape_baidu);
                //clonedShape.contours[1].reverse();


                window.editor = currentEditor = editor.create($('#render-view').get(0));
                currentEditor.setFont(clonedShape);

                // var jointLayer = currentEditor.fontLayer;

                // var paths = currentEditor.fontLayer.shapes.map(function(shape) {
                //     return shape.points;
                // });

                // // var result = isPathCross(path0, path1);

               

                // // if (result && result.length) {
                // //     result.forEach(function(p, index){
                // //         jointLayer.addShape({
                // //             type: 'point',
                // //             x: p.x,
                // //             y: p.y,
                // //             style: {
                // //                 fill: true,
                // //                 fillColor: 'red'
                // //             }
                // //         });
                // //     });

                // //     jointLayer.refresh();
                // // }


                // var newPaths = pathJoin(paths, 4);

                // newPaths.forEach(function(p, index) {
                //     jointLayer.addShape('path', {
                //         points: lang.clone(p),
                //         style: {
                //             lineWidth: 2,
                //             fill:true,
                //             fillColor: index % 2 ? 'red' : 'blue'
                //         }
                //     });
                // });

                // jointLayer.refresh();

            }
        };

        entry.init();
        
        return entry;
    }
);