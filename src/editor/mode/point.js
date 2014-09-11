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
        var lang = require('common/lang');

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
                    this.currentPoint.reserved = lang.clone(this.currentPoint);
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
                    var current = this.currentPoint;
                    var reserved = current.reserved;

                    if(camera.event.altKey) {
                        current.x = reserved.x;
                        current._point.x = reserved._point.x;
                    }
                    else {
                        current.x = reserved.x + camera.event.deltaX;
                        current._point.x = reserved._point.x + camera.event.deltaX;
                    }

                    if(camera.event.shiftKey) {
                        current.y = reserved.y;
                        current._point.y = reserved._point.y;
                    }
                    else {
                        current.y = reserved.y + camera.event.deltaY;
                        current._point.y = reserved._point.y + camera.event.deltaY;
                    }

                    render.getLayer('cover').refresh();
                    render.getLayer('font').refresh();

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
                                x: p0.x,
                                y: p0.y,
                                _point: p0,
                                _shape: shape.id
                            });
                        }
                        else if (c == 'Q') {
                            controls.push({
                                type: 'cpoint',
                                x: p1.x,
                                y: p1.y,
                                _point: p1,
                                _shape: shape.id
                            });
                            controls.push({
                                type: 'point',
                                x: p2.x,
                                y: p2.y,
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
