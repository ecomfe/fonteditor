/**
 * @file 控制点管理类
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {
        var lang = require('common/lang');

        /**
         * 控制点管理
         *
         * @constructor
         * @param {Layer} layer layer对象
         */
        function BoundControl(layer) {
            this.layer = layer;

            // 虚线框
            this.controls = [
                {
                    id: 'bound-point',
                    type: 'polygon',
                    dashed: true,
                    selectable: false
                },
                {}, {}, {}, {}, {}, {}, {}, {}
            ];
        }

        /**
         * 刷新控制点
         *
         * @param {Object} bound bound对象
         * @param {string} mode 模式
         */
        BoundControl.prototype.refresh = function (bound, mode) {
            var points = [

                {
                    points: [
                        {x: bound.x, y: bound.y},
                        {x: bound.x + bound.width, y: bound.y},
                        {x: bound.x + bound.width, y: bound.y + bound.height},
                        {x: bound.x, y: bound.y + bound.height}
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

            var controls = this.controls;

            points.forEach(function (p, i) {
                if (i > 0) {
                    if (mode === 'rotate' && i <= 4) {
                        p.type = 'cpoint';
                        p.size = 3;
                    }
                    else {
                        p.type = 'point';
                        p.size = 6;
                    }
                }
                lang.extend(controls[i], p);
            });

            this.show();
        };

        /**
         * 显示控制点
         */
        BoundControl.prototype.show = function () {
            var layer = this.layer;
            if (!layer.getShape('bound-point')) {
                this.controls.forEach(function (shape) {
                    layer.addShape(shape);
                });
            }
            layer.refresh();
        };

        /**
         * 隐藏控制点
         */
        BoundControl.prototype.hide = function () {
            var layer = this.layer;
            if (layer.getShape('bound-point')) {
                this.controls.forEach(function (shape) {
                    layer.removeShape(shape);
                });
            }
            layer.refresh();
        };

        /**
         * 注销
         */
        BoundControl.prototype.dispose = function () {
            this.hide();
            this.layer.refresh();
            this.controls.length = 0;
            this.controls = this.layer = null;
        };

        return BoundControl;
    }
);
