/**
 * @file render.js
 * @author mengke01
 * @date 
 * @description
 * render 组件测试
 */

define(
    function(require) {

        var render = require('render/render');
        var shape_baidu = require('./shape-baidu');
        var shape_bdjk = require('./shape-bdjk');
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

                cover.options.stroke = 1;
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
                
                shape_baidu.x = 50;
                shape_baidu.y = 50;
                shape_baidu.scale = 100 / 512;
                font.addShape('font', shape_baidu);

                shape_bdjk.x = 400;
                shape_bdjk.y = 300;
                shape_bdjk.scale = 100 / 512;
                font.addShape('font', shape_bdjk);

                currentRender.refresh();

                // cover.removeShape(0);
                // cover.removeShape(shape1);
                // cover.removeShape(shape2.id);

                // currentRender.removeLayer('cover');
                // currentRender.removeLayer(font);

                //currentRender.dispose();
            }
        };

        entry.init();
        
        return entry;
    }
);
