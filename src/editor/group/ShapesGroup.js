/**
 * @file ShapesGroup.js
 * @author mengke01
 * @date 
 * @description
 * 多个形状编辑组
 */


define(
    function(require) {

        var pathAdjust = require('render/util/pathAdjust');
        var boundAdjust = require('render/util/boundAdjust');
        var lang = require('common/lang');
        var computeBoundingBox = require('../../graphics/computeBoundingBox');
        var getTransformMatrix = require('../util/getTransformMatrix');

        var updateControls = require('./updateControls');
        

        /**
         * 获取多个shape的边界
         */
        function getBound(shapes) {
            var points = [];
            shapes.forEach(function(shape) {
                var b = computeBoundingBox.computePath(shape.points);
                points.push(b);
                points.push({
                    x: b.x + b.width,
                    y: b.y + b.height
                });
            });
            return computeBoundingBox.computeBounding(points);
        }

        /**
         * 选择组控制器
         */
        function ShapesGroup(shapes, render, mode) {
            this.render = render;
            this.setShapes(shapes);
            this.setMode(mode);
        }

        /**
         * 根据控制点做图形变换
         */
        ShapesGroup.prototype.beginTransform = function(point) {
            this.bound = getBound(this.shapes);
            this.originShapes = lang.clone(this.shapes);
            var coverLayer = this.render.getLayer('cover');
            coverLayer.clearShapes();
        };

        /**
         * 根据控制点做图形变换
         */
        ShapesGroup.prototype.transform = function(point, camera) {


            var matrix = getTransformMatrix(point.pos, this.bound, camera);

            // 等比缩放
            if (camera.event.shiftKey && [1, 2, 3, 4].indexOf(point.pos) >= 0) {
                var scale = Math.max(Math.abs(matrix[2]), Math.abs(matrix[3]));
                matrix[2] = matrix[2] >= 0 ? scale : -scale;
                matrix[3] = matrix[3] >= 0 ? scale : -scale;
            }


            // 更新shape
            var shapes = this.shapes;

            this.originShapes.forEach(function(originShape, index) {

                var shape = lang.clone(originShape);
                pathAdjust(shape.points, matrix[2], matrix[3], -matrix[0], -matrix[1]);
                pathAdjust(shape.points, 1, 1, matrix[0], matrix[1]);

                if (matrix[2] < 0 && !matrix[3] < 0) {
                    shape.points = shape.points.reverse();
                }

                if (matrix[3] < 0 && !matrix[2] < 0) {
                    shape.points = shape.points.reverse();
                }

                lang.extend(shapes[index], shape);

            });
            
            this.render.getLayer('font').refresh();

            // 更新边界
            var coverLayer = this.render.getLayer('cover');
            var boundShape = coverLayer.getShape('bound');
            if(!boundShape) {
                boundShape = {
                    type: 'rect',
                    dashed: true,
                    id: 'bound'
                };
                coverLayer.addShape(boundShape);
            }

            var bound = boundAdjust(lang.clone(this.bound), matrix[2], matrix[3], -matrix[0], -matrix[1]);
            boundAdjust(bound, 1, 1, matrix[0], matrix[1]);
            lang.extend(boundShape, bound);
            coverLayer.refresh();
        };

        /**
         * 刷新Shapesgroup信息
         */
        ShapesGroup.prototype.finishTransform = function() {
            delete this.originShapes;
            delete this.bound;
            this.refresh();
        };

        /**
         * 移动到指定位置
         */
        ShapesGroup.prototype.move = function(mx, my) {

            this.shapes.forEach(function(shape) {
                pathAdjust(shape.points, 1, 1, mx, my);
            });
            
            var fontLayer = this.render.painter.getLayer('font');
            fontLayer.refresh();

            var coverLayer = this.render.getLayer('cover');
            coverLayer.move(mx, my);
            coverLayer.refresh();
        };

        /**
         * 设置操作的shapes
         */
        ShapesGroup.prototype.setShapes = function(shapes) {
            if(this.shapes) {
                this.shapes.length = 0;
                this.shapes = null;
            }
            this.shapes = shapes;
        };

        /**
         * 设置操作的shapes
         */
        ShapesGroup.prototype.setMode = function(mode) {
            this.mode = mode || 'scale'; // 两种变化模式，scale和rotate
        };


        /**
         * refresh
         */
        ShapesGroup.prototype.refresh = function() {
            updateControls.call(this, getBound(this.shapes));
            this.render.getLayer('cover').refresh();
        };

        /**
         * 注销
         */
        ShapesGroup.prototype.dispose = function() {
            var coverLayer = this.render.getLayer('cover');
            coverLayer.clearShapes();
            coverLayer.refresh();

            this.shapes.length = 0;
            this.controls.length = 0;
            
            this.shapes = this.controls = this.render = null;
        };

        return ShapesGroup;
    }
)