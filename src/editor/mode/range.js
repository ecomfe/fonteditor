/**
 * @file range.js
 * @author mengke01
 * @date 
 * @description
 * 多选区模式
 */


define(
    function(require) {

        var lang = require('common/lang');
        var selectShape = require('render/util/selectShape');
        var computeBoundingBox = require('graphics/computeBoundingBox');
        var isBoundingBoxCross = require('graphics/isBoundingBoxCross');

        /**
         * 多选shape
         */
        function selectShapes(bound) {
            var shapes = this.fontLayer.shapes;
            var selectedShapes = [];

            shapes.forEach(function(shape) {
                var sb = computeBoundingBox.computePath(shape.points);
                // 包含
                if(3 == isBoundingBoxCross(bound, sb)) {
                    selectedShapes.push(shape);
                }
            });

            return selectedShapes.length ? selectedShapes : false;
        }


        var mode = {

            name: 'range',

            /**
             * 按下事件
             */
            down: function(e) {
                mode.begin.call(this, e);
            },

            /**
             * 拖动事件
             */
            drag: function(e) {
                if (this.selectionBox) {
                    var camera = this.render.camera;
                    this.selectionBox.width = camera.x - this.selectionBox.x;
                    this.selectionBox.height = camera.y - this.selectionBox.y;
                    this.coverLayer.refresh();
                }
            },


            /**
             * 鼠标弹起
             */
            up: function(e) {
                if(this.selectionBox) {

                    // 对shape进行多选
                    if(this.selectionBox.width >= 20 && this.selectionBox.height >= 20) {
                        var shapes;
                        if(shapes = selectShapes.call(this, this.selectionBox)) {
                            this.setMode('shapes', shapes);
                            return;
                        }
                    }

                    this.coverLayer.clearShapes();
                    this.coverLayer.refresh();
                }
                
                this.selectionBox = null;
                this.setMode();
            },

            /**
             * 开始模式
             */
            begin: function() {
                var camera = this.render.camera;
                this.selectionBox = {
                    type: 'rect',
                    dashed: true,
                    x: camera.x,
                    y: camera.y
                };
                this.coverLayer.addShape(this.selectionBox);
            },

            /**
             * 结束模式
             */
            end: function() {
                this.selectionBox = null;
            }
        };

        return mode;
    }
);
