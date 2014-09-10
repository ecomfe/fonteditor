/**
 * @file point.js
 * @author mengke01
 * @date 
 * @description
 * 点编辑模式
 */


define(
    function(require) {

        var pathIterator = require('render/util/pathIterator');
        var computeBoundingBox = require('graphics/computeBoundingBox');
        var pathAdjust = require('render/util/pathAdjust');

        var pointMode = {
            name: 'point',

            /**
             * 按下事件
             */
            down: function(e) {

                var render = this.render;
                var result = render.getLayer('cover').getShapeIn(e);

                if(result) {
                    this.currentPoint = result[0];
                    this.currentPoint.style = {
                        fillColor: 'red'
                    };
                }
            },

            /**
             * 拖动事件
             */
            drag: function(e) {
                var render = this.render;
                var camera = render.camera;
                if(this.currentPoint) {

                    this.currentPoint.x  += camera.mx;
                    this.currentPoint.y  += camera.my;

                    this.currentPoint._point.x += camera.mx;
                    this.currentPoint._point.y += camera.my;

                    render.getLayer('cover').refresh();
                    render.getLayer('font').refresh();

                    this.modifiedShape[this.currentPoint._shape] = true;
                }
            },

            /**
             * 拖动结束事件
             */
            dragend: function(e) {
                if (this.currentPoint) {
                    delete this.currentPoint.style;
                }
                this.currentPoint = null;
            },

            begin: function() {

                var controls = [];
                var shapes = this.render.getLayer('font').shapes;

                shapes.forEach(function(shape) {
                    pathIterator(shape.points, function(c, i, p0, p1, p2) {
                        if(c == 'M' || c == 'L') {
                            controls.push({
                                type: 'point',
                                x: shape.x + p0.x,
                                y: shape.y + p0.y,
                                _point: p0,
                                _shape: shape.id
                            });
                        }
                        else if (c == 'Q') {
                            controls.push({
                                type: 'cpoint',
                                x: shape.x + p1.x,
                                y: shape.y + p1.y,
                                _point: p1,
                                _shape: shape.id
                            });
                            controls.push({
                                type: 'point',
                                x: shape.x + p2.x,
                                y: shape.y + p2.y,
                                _point: p2,
                                _shape: shape.id
                            });
                        }
                    });
                });

                var coverLayer = this.render.getLayer('cover');
                coverLayer.options.fill = true;

                controls.forEach(function(shape){
                    coverLayer.addShape(shape);
                });
                coverLayer.refresh();

                var me = this;
                // 注册鼠标样式
                me.render.capture.on('move', me.__moveEvent = function (e) {
                    var shape = coverLayer.getShapeIn(e);
                    if(shape) {
                        me.render.setCursor('pointer');
                    }
                    else {
                        me.render.setCursor('default');
                    }
                });

                this.modifiedShape = {};
            },

            end: function() {

                // 重新调整shape大小和位置
                var shapes = Object.keys(this.modifiedShape);
                if(shapes.length) {
                    var fontLayer = this.render.getLayer('font');
                    shapes.forEach(function(shapeId) {
                        var shape = fontLayer.getShape(shapeId);
                        var bound = computeBoundingBox.computePath(shape.points);
                        shape.width = bound.width;
                        shape.height = bound.height;
                        shape.x = shape.x + bound.x;
                        shape.y = shape.y + bound.y;
                        shape.points = pathAdjust(shape.points, 1, -bound.x, -bound.y);
                    });
                    fontLayer.refresh();
                }

                this.modifiedShape = null;

                var coverLayer = this.render.getLayer('cover');
                coverLayer.options.fill = false;
                coverLayer.clearShapes();
                coverLayer.refresh();

                this.render.capture.un('move', this.__moveEvent);
                this.render.setCursor('default');
            }
        };

        return pointMode;
    }
);
