/**
 * @file ShapeGroup.js
 * @author mengke01
 * @date 
 * @description
 * 形状编辑组
 */


define(
    function(require) {
        var adjustShape = require('../util/adjustShape');
        var lang = require('common/lang');

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

            updateControls.call(this, shape);
            this.render.getLayer('cover').refresh();
        }

        /**
         * 根据控制点做图形变换
         */
        Group.prototype.beginTransform = function(point) {
            this.originShape = lang.clone(this.shape);
        };

        /**
         * 根据控制点做图形变换
         */
        Group.prototype.transform = function(point, camera) {
            var bound = this.originShape;
            
            var mx = camera.x - camera.startx;
            var my = camera.y - camera.starty;

            // x, y, xscale, yscale
            var matrix = [
                bound.x, 
                bound.y, 
                1, 1
            ];
            
            // 是否需要等比例缩放
            var ctrlKey = camera.event && camera.event.ctrlKey;

            switch (point.pos) {
                case 1:
                    matrix[2] = (bound.width - mx) / bound.width;
                    matrix[3] = (bound.height - my) / bound.height;
                    
                    if(matrix[2] >= 0 && matrix[3] >= 0) {
                        matrix[0] = camera.x;
                        matrix[1] = camera.y;
                    }
                    else if(matrix[2] < 0 && matrix[3] > 0) {
                        matrix[0] = bound.x + bound.width;
                        matrix[1] = camera.y;
                    }
                    else if(matrix[2] < 0 && matrix[3] < 0) {
                        matrix[0] = bound.x + bound.width;
                        matrix[1] = bound.y + bound.height;
                    }
                    else {
                        matrix[0] = camera.x;
                        matrix[1] = bound.y + bound.height;
                    }

                    if(ctrlKey) {
                        var scale = Math.max(Math.abs(matrix[2]), Math.abs(matrix[3]));
                        matrix[2] = matrix[2] > 0 ? scale : -scale;
                        matrix[3] = matrix[3] > 0 ? scale : -scale;
                        matrix[0] = Math.min(bound.x + bound.width,
                            bound.x + bound.width - bound.width * matrix[2]);
                        matrix[1] = Math.min(bound.y + bound.height, 
                            bound.y + bound.height - bound.height * matrix[3]);
                    }

                    break;

                case 2:
                    matrix[2] = (bound.width + mx) / bound.width;
                    matrix[3] = (bound.height - my) / bound.height;

                    if(matrix[2] >= 0 && matrix[3] >= 0) {
                        matrix[0] = bound.x;
                        matrix[1] = camera.y;
                    }
                    else if(matrix[2] < 0 && matrix[3] > 0) {
                        matrix[0] = camera.x;
                        matrix[1] = camera.y;
                    }
                    else if(matrix[2] < 0 && matrix[3] < 0) {
                        matrix[0] = camera.x;
                        matrix[1] = bound.y + bound.height;
                    }
                    else {
                        matrix[0] = bound.x;
                        matrix[1] = bound.y + bound.height;
                    }
                    if(ctrlKey) {
                        var scale = Math.max(Math.abs(matrix[2]), Math.abs(matrix[3]));
                        matrix[2] = matrix[2] > 0 ? scale : -scale;
                        matrix[3] = matrix[3] > 0 ? scale : -scale;
                        matrix[0] = Math.min(bound.x, bound.x + bound.width * matrix[2]);
                        matrix[1] = Math.min(bound.y + bound.height, 
                            bound.y + bound.height - bound.height * matrix[3]);
                    }
                    break;

                case 3:
                    matrix[2] = (bound.width + mx) / bound.width;
                    matrix[3] = (bound.height + my) / bound.height;
                    matrix[0] = Math.min(bound.x, camera.x);
                    matrix[1] = Math.min(bound.y, camera.y);
                    if(ctrlKey) {
                        var scale = Math.max(Math.abs(matrix[2]), Math.abs(matrix[3]));
                        matrix[2] = matrix[2] > 0 ? scale : -scale;
                        matrix[3] = matrix[3] > 0 ? scale : -scale;
                        matrix[0] = Math.min(bound.x, bound.x + bound.width * matrix[2]);
                        matrix[1] = Math.min(bound.y, bound.y + bound.height * matrix[3]);
                    }
                    break;

                case 4:
                    matrix[2] = (bound.width - mx) / bound.width;
                    matrix[3] = (bound.height + my) / bound.height;

                    if(matrix[2] >= 0 && matrix[3] >= 0) {
                        matrix[0] = camera.x;
                        matrix[1] = bound.y;
                    }
                    else if(matrix[2] < 0 && matrix[3] > 0) {
                        matrix[0] = bound.x + bound.width;
                        matrix[1] = bound.y;
                    }
                    else if(matrix[2] < 0 && matrix[3] < 0) {
                        matrix[0] = bound.x + bound.width;
                        matrix[1] = camera.y;
                    }
                    else {
                        matrix[0] = camera.x;
                        matrix[1] = camera.y;
                    }
                    if(ctrlKey) {
                        var scale = Math.max(Math.abs(matrix[2]), Math.abs(matrix[3]));
                        matrix[2] = matrix[2] > 0 ? scale : -scale;
                        matrix[3] = matrix[3] > 0 ? scale : -scale;
                        matrix[0] = Math.min(bound.x + bound.width, 
                            bound.x + bound.width - bound.width * matrix[2]);
                        matrix[1] = Math.min(bound.y, bound.y + bound.height * matrix[3]);
                    }
                    break;

                case 5: 
                    matrix[3] = (bound.height - my) / bound.height;
                    matrix[0] = bound.x;
                    matrix[1] = matrix[3] > 0 ? camera.y : bound.y + bound.height;
                    break;

                case 7:
                    matrix[3] = (bound.height + my) / bound.height;
                    matrix[0] = bound.x;
                    matrix[1] = matrix[3] > 0 ? bound.y : camera.y;
                    break;

                case 6:
                    matrix[2] = (bound.width + mx) / bound.width;
                    matrix[0] = matrix[2] > 0 ? bound.x : camera.x;
                    matrix[1] = bound.y;
                    break;

                case 8: 
                    matrix[2] = (bound.width - mx) / bound.width;
                    matrix[0] = matrix[2] > 0 ? camera.x : bound.x + bound.width;
                    matrix[1] = bound.y;
                    break;
            };

            var shape = adjustShape(lang.clone(this.originShape), matrix);

            lang.extend(this.shape, shape);

            this.render.getLayer('font').refresh();
            var coverLayer = this.render.getLayer('cover');
            coverLayer.clearShapes();
            coverLayer.addShape({
                type: 'dashedrect',
                x: shape.x,
                y: shape.y,
                width: shape.width,
                height: shape.height
            });
            coverLayer.refresh();
        };

        /**
         * 刷新group信息
         */
        Group.prototype.finishTransform = function() {
            delete this.originShape;
            updateControls.call(this, this.shape);
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
            coverLayer.move(x, y)
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