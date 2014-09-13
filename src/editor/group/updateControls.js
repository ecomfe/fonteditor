/**
 * @file updateControls.js
 * @author mengke01
 * @date 
 * @description
 * 更新控制点集合
 */


define(
    function(require) {

        var lang = require('common/lang');

        /**
         * 获取bound边界
         */
        function updateControls(bound) {

            if (!this.controls) {
                this.controls = [{
                    type: 'rect',
                    dashed: true,
                    selectable: false
                }];
                for (var i = 0; i < 8; i++) {
                    this.controls.push({
                        type: 'point'
                    });
                }
            }

            var points = [
                // 虚线框
                {
                    x: bound.x,
                    y: bound.y,
                    width: bound.width,
                    height: bound.height
                },

                // 控制点
                /*
                  1  5  2
                  8     6
                  4  7  3
                */
                {x: bound.x, y: bound.y, pos: 1},
                {x: bound.x + bound.width, y: bound.y, pos: 2},
                {x: bound.x + bound.width, y: bound.y + bound.height, pos: 3},
                {x: bound.x, y: bound.y + bound.height, pos: 4},
                {x: bound.x + bound.width / 2, y: bound.y, pos: 5},
                {x: bound.x + bound.width, y: bound.y + bound.height / 2, pos: 6},
                {x: bound.x + bound.width / 2, y: bound.y + bound.height, pos: 7},
                {x: bound.x, y: bound.y + bound.height / 2, pos: 8},
            ];

            var controls = this.controls;
            points.forEach(function(p, index) {
                lang.extend(controls[index], p);
            });

            var coverLayer = this.render.getLayer('cover');
            coverLayer.clearShapes();
            controls.forEach(function(shape) {
                coverLayer.addShape(shape);
            });
        }


        return updateControls;
    }
);
