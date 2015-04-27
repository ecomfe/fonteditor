/**
 * @file 多选区模式
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        var computeBoundingBox = require('graphics/computeBoundingBox');
        var isBoundingBoxCross = require('graphics/isBoundingBoxCross');

        /**
         * 根据bound选择shapes
         * @param {Object} bound 边界对象
         * @return {Array|boolean} shapes数组或者`false`
         */
        function selectShapes(bound) {
            var shapes = this.fontLayer.shapes;
            var selectedShapes = [];

            shapes.forEach(function (shape) {
                var sb = computeBoundingBox.computePath(shape.points);
                // 包含
                if (3 === isBoundingBoxCross(bound, sb)) {
                    selectedShapes.push(shape);
                }
            });

            return selectedShapes.length ? selectedShapes : false;
        }


        var mode = {


            down: function (e) {
                if (1 === e.which) {
                    mode.begin.call(this, e);
                }
            },


            drag: function (e) {
                if (1 === e.which) {
                    if (this.selectionBox) {
                        var camera = this.render.camera;
                        this.selectionBox.width = camera.x - this.selectionBox.x;
                        this.selectionBox.height = camera.y - this.selectionBox.y;
                        this.coverLayer.refresh();
                    }
                }
            },


            up: function (e) {
                if (1 === e.which) {
                    if (this.selectionBox) {
                        var bound = {
                            x: Math.min(this.selectionBox.x, this.selectionBox.x + this.selectionBox.width),
                            y: Math.min(this.selectionBox.y, this.selectionBox.y + this.selectionBox.height),
                            width: Math.abs(this.selectionBox.width),
                            height: Math.abs(this.selectionBox.height)
                        };

                        // 对shape进行多选
                        if (bound.width >= 20 && bound.height >= 20) {
                            var shapes;
                            if ((shapes = selectShapes.call(this, bound))) {
                                this.setMode('shapes', shapes, 'range');
                                return;
                            }
                        }
                    }

                    this.setMode();
                }
            },


            begin: function () {
                var camera = this.render.camera;
                this.selectionBox = {
                    type: 'rect',
                    dashed: true,
                    x: camera.x,
                    y: camera.y
                };
                this.coverLayer.addShape(this.selectionBox);
            },


            end: function () {
                this.selectionBox = null;
                this.coverLayer.clearShapes();
                this.coverLayer.refresh();
            }
        };

        return mode;
    }
);
