/**
 * @file ShapeGroup.js
 * @author mengke01
 * @date 
 * @description
 * 形状编辑组
 */


define(
    function(require) {

        var pathAdjust = require('render/util/pathAdjust');
        var boundAdjust = require('render/util/boundAdjust');
        var lang = require('common/lang');
        var computeBoundingBox = require('../../graphics/computeBoundingBox');

        /**
         * 获取bound边界
         */
        function updateControls(bound) {

            if (!this.controls) {
                this.controls = [{
                    type: 'dashedrect',
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

        /**
         * 选择组控制器
         */
        function Group(shape, render) {
            this.shape = shape;
            this.render = render;
            updateControls.call(this, computeBoundingBox.computePath(this.shape.points));
            this.render.getLayer('cover').refresh();
        }

        /**
         * 根据控制点做图形变换
         */
        Group.prototype.beginTransform = function(point) {
            this.bound = computeBoundingBox.computePath(this.shape.points);
            this.originShape = lang.clone(this.shape);
            var coverLayer = this.render.getLayer('cover');
            coverLayer.clearShapes();
        };

        /**
         * 根据控制点做图形变换
         */
        Group.prototype.transform = function(point, camera) {

            var bound = this.bound;
            // x, y, xscale 相对符号, yscale 相对符号
            var matrix = [
                0, 
                0, 
                1,
                1
            ];
            
            // 是否需要等比例缩放
            var ctrlKey = camera.event && camera.event.ctrlKey;

            switch (point.pos) {
                case 1:
                    matrix[0] = bound.x + bound.width;
                    matrix[1] = bound.y + bound.height;
                    matrix[2] = -(camera.x - matrix[0]) / bound.width;
                    matrix[3] = -(camera.y - matrix[1]) / bound.height;
                    break;
                case 2:
                    matrix[0] = bound.x;
                    matrix[1] = bound.y + bound.height;
                    matrix[2] = (camera.x - matrix[0]) / bound.width;
                    matrix[3] = -(camera.y - matrix[1]) / bound.height;
                    break;

                case 3:
                    matrix[0] = bound.x;
                    matrix[1] = bound.y;
                    matrix[2] = (camera.x - matrix[0]) / bound.width;
                    matrix[3] = (camera.y - matrix[1]) / bound.height;
                    break;

                case 4:
                    matrix[0] = bound.x + bound.width;
                    matrix[1] = bound.y;
                    matrix[2] = -(camera.x - matrix[0]) / bound.width;
                    matrix[3] = (camera.y - matrix[1]) / bound.height;
                    break;

                case 5:
                    matrix[1] = bound.y + bound.height;
                    matrix[2] = 1;
                    matrix[3] = -(camera.y - matrix[1]) / bound.height;
                    break;

                case 7:
                    matrix[1] = bound.y;
                    matrix[3] = (camera.y - matrix[1]) / bound.height;
                    break;

                case 6:
                    matrix[0] = bound.x;
                    matrix[2] = (camera.x - matrix[0]) / bound.width;
                    break;

                case 8: 
                    matrix[0] = bound.x + bound.width;
                    matrix[2] = -(camera.x - matrix[0]) / bound.width;
                    break;
            };

            // 等比缩放
            if (camera.event.ctrlKey && [1, 2, 3, 4].indexOf(point.pos) >= 0) {
                var scale = Math.max(Math.abs(matrix[2]), Math.abs(matrix[3]));
                matrix[2] = matrix[2] >= 0 ? scale : -scale;
                matrix[3] = matrix[3] >= 0 ? scale : -scale;
            }


            // 更新shape
            var shape = lang.clone(this.originShape);

            pathAdjust(shape.points, matrix[2], matrix[3], -matrix[0], -matrix[1]);
            pathAdjust(shape.points, 1, 1, matrix[0], matrix[1]);

            lang.extend(this.shape, shape);
            this.render.getLayer('font').refresh();

            // 更新边界
            var coverLayer = this.render.getLayer('cover');
            if(!coverLayer.getShape('bound')) {
                coverLayer.addShape({
                    type: 'dashedrect',
                    id: 'bound'
                });
            }

            var bound = boundAdjust(lang.clone(this.bound), matrix[2], matrix[3], -matrix[0], -matrix[1]);
            boundAdjust(bound, 1, 1, matrix[0], matrix[1]);
            lang.extend(coverLayer.getShape('bound'), bound);
            coverLayer.refresh();

        };

        /**
         * 刷新group信息
         */
        Group.prototype.finishTransform = function() {
            delete this.originShape;
            updateControls.call(this, computeBoundingBox.computePath(this.shape.points));
            this.render.getLayer('cover').refresh();
        };

        /**
         * 移动到指定位置
         */
        Group.prototype.move = function(x, y) {

            var fontLayer = this.render.painter.getLayer(this.shape.layerId);
            fontLayer.move(x, y, this.shape)
            fontLayer.refresh();

            var coverLayer = this.render.getLayer('cover');
            coverLayer.move(x, y);
            coverLayer.refresh();
        };

        /**
         * 注销
         */
        Group.prototype.dispose = function() {
            var coverLayer = this.render.getLayer('cover');
            coverLayer.clearShapes();
            coverLayer.refresh();
            this.shape = this.controls = this.render = null;
        };

        return Group;
    }
)