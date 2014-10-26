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
        var shape_baidu = require('./contours');
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

                // 插值
                clonedShape.contours[0] = util.interpolate(clonedShape.contours[0]);
                clonedShape.contours[1] = util.interpolate(clonedShape.contours[1]);

                currentEditor = editor.create($('#render-view').get(0));
                currentEditor.setFont(clonedShape);

                var jointLayer = currentEditor.fontLayer;

                var path0 = currentEditor.fontLayer.shapes[0].points;
                var path1 = currentEditor.fontLayer.shapes[1].points;
                var result = isPathCross(path0, path1);

               

                if (result && result.length) {
                    result.forEach(function(p, index){
                        jointLayer.addShape({
                            type: 'point',
                            x: p.x,
                            y: p.y,
                            style: {
                                fill: true,
                                fillColor: 'red'
                            }
                        });
                    });
                    jointLayer.refresh();

                    var paths = pathJoin(path0, path1, 1);

                    paths.forEach(function(p, index) {
                        jointLayer.addShape('path', {
                            points: lang.clone(p),
                            style: {
                                lineWidth: 2,
                                fill:true,
                                fillColor: index % 2 ? 'red' : 'blue'
                            }
                        });
                    });

                    jointLayer.refresh();
                }

            }
        };

        entry.init();
        
        return entry;
    }
);