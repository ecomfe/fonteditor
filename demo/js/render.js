/**
 * @file render.js
 * @author mengke01
 * @date 
 * @description
 * render 组件测试
 */

define(
    function(require) {

        var render = require('render/main');
        var shape_baidu = require('./shape-baidu');
        var shape_bdjk = require('./shape-bdjk');
        var glyfAdjust = require('ttf/util/glyfAdjust');
        var glyf2path = require('ttf/util/glyf2path');
        var lang = require('common/lang');

        var currentRender;

        var entry = {

            /**
             * 初始化
             */
            init: function () {
                currentRender = render.create($('#render-view').get(0));

                var cover = currentRender.addLayer('cover', {
                    level: 20
                });

                cover.options.fill = false;
                cover.options.strokeColor = 'green';

                cover.addShape('circle', {
                    x: 234,
                    y: 213,
                    r: 10
                });

                cover.addShape('circle', {
                    x: 55,
                    y: 464,
                    r: 10
                });

                cover.addShape('circle', {
                    x: 55,
                    y: 212,
                    r: 50
                });

                var shape1 = cover.addShape('rect', {
                    x: 55,
                    y: 464,
                    width: 30,
                    height: 32
                });

                var shape2 = cover.addShape('rect', {
                    x: 344,
                    y: 78,
                    width: 30,
                    height: 42
                });

                var font = currentRender.addLayer('font', {
                    level: 10
                });

                var contourAdjust = require('ttf/util/contourAdjust');

                shape_baidu.contours.forEach(function(contour) {
                    var shape = {};
                    shape.points = contour;
                    shape.points = contourAdjust(contour, 1, 1, 100, 400);
                    font.addShape('path', shape);
                });
                
                currentRender.refresh();
            }
        };

        entry.init();
        
        return entry;
    }
);
