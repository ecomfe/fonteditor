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
                // 虚线框
                this.controls = [
                    {
                        type: 'polygon',
                        dashed: true,
                        selectable: false
                    }, 
                    {}, {}, {}, {}, {}, {}, {}, {}
                ];
            }

            var points = [

                {
                    points: [
                        {x: bound.x,y:bound.y},
                        {x: bound.x + bound.width, y:bound.y},
                        {x: bound.x + bound.width, y:bound.y + bound.height},
                        {x: bound.x, y:bound.y + bound.height}
                    ]
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
                {x: bound.x, y: bound.y + bound.height / 2, pos: 8}
            ];

            var mode = this.mode;
            var controls = this.controls;
            points.forEach(function(p, i) {
                lang.extend(controls[i], p);
                if (i > 0) {
                    if (mode == 'rotate' && i <= 4) {
                        controls[i].type = 'cpoint';
                        controls[i].size = 3;
                    }
                    else {
                        controls[i].type = 'point';
                        controls[i].size = 6;
                    }
                }
            });

            var coverLayer = this.editor.coverLayer;
            coverLayer.clearShapes();
            controls.forEach(function(shape) {
                coverLayer.addShape(shape);
            });
        }


        return updateControls;
    }
);
