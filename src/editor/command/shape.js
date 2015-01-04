/**
 * @file shape.js
 * @author mengke01
 * @date
 * @description
 * 形状相关命令
 */


define(
    function (require) {

        var computeBoundingBox = require('graphics/computeBoundingBox');
        var pathAdjust = require('graphics/pathAdjust');



        return {

            /**
             * 移除shape
             *
             * @param {Array} shapes 形状集合
             */
            removeshapes: function (shapes) {

                var fontLayer = this.fontLayer;
                shapes.forEach(function (shape) {
                    fontLayer.removeShape(shape);
                });
                fontLayer.refresh();
                this.refreshSelected([]);
                this.setMode();
            },

            /**
             * 反转shape
             *
             * @param {Array} shapes 形状集合
             */
            reversepoints: function (shapes) {
                shapes.forEach(function (shape) {
                    shape.points = shape.points.reverse();
                });

                this.fontLayer.refresh();
            },

            /**
             * 设置shape到顶层
             *
             * @param {Array} shape 形状
             */
            topshape: function (shape) {
                var index = this.fontLayer.shapes.indexOf(shape);
                this.fontLayer.shapes.splice(index, 1);
                this.fontLayer.shapes.push(shape);
            },

            /**
             * 设置shape到底层
             *
             * @param {Array} shape 形状
             */
            bottomshape: function (shape) {
                var index = this.fontLayer.shapes.indexOf(shape);
                this.fontLayer.shapes.splice(index, 1);
                this.fontLayer.shapes.unshift(shape);
            },

            /**
             * 提升shape层级
             *
             * @param {Array} shape 形状
             */
            upshape: function (shape) {
                var index = this.fontLayer.shapes.indexOf(shape);
                this.fontLayer.shapes.splice(index, 1);
                this.fontLayer.shapes.splice(index + 1, 0, shape);
            },

            /**
             * 降低shape层级
             *
             * @param {Array} shape 形状
             */
            downshape: function (shape) {
                var index = this.fontLayer.shapes.indexOf(shape);
                this.fontLayer.shapes.splice(index, 1);
                this.fontLayer.shapes.splice(index - 1, 0, shape);
            },

            /**
             * 剪切shapes
             *
             * @param {Array} shapes 形状集合
             */
            cutshapes: function (shapes) {
                var cutedShapes = this.getShapes(shapes);
                this.setClipBoard(cutedShapes);
                var fontLayer = this.fontLayer;
                shapes.forEach(function (shape) {
                    fontLayer.removeShape(shape);
                });
                fontLayer.refresh();
                this.refreshSelected([]);
            },

            /**
             * 复制shapes
             *
             * @param {Array} shapes 形状集合
             */
            copyshapes: function (shapes) {
                shapes = this.getShapes(shapes);
                this.setClipBoard(shapes);
            },

            /**
             * 粘贴shapes
             *
             * @param {Array} shapes 形状集合
             * @param {Object=} pos 指定的位置
             * @return {boolean} `false`或者`undefined`
             */
            pasteshapes: function (shapes, pos) {

                if (!shapes || !shapes.length) {
                    return false;
                }

                if (pos) {
                    var bound = computeBoundingBox.computePath.apply(null,
                        shapes.map(function (shape) {
                            return shape.points;
                        })
                    );
                    // 需要根据坐标原点以及缩放换算成鼠标位置移动
                    var origin = this.axis;
                    var scale = this.render.camera.scale;
                    var x = (pos.x - origin.x) / scale;
                    var y = (origin.y - pos.y) / scale;

                    shapes.forEach(function (shape) {
                        pathAdjust(shape.points, 1, 1, x - bound.x, y - bound.y - bound.height);
                    });
                }


                this.setShapes(shapes);
                this.setMode('shapes', shapes);
            },

            /**
             * 增加shapes
             *
             * @param {Array} shapes 形状集合
             */
            addshapes: function (shapes) {
                this.setShapes(shapes);
                this.fontLayer.refresh();
            }
        };
    }
);
