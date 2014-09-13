/**
 * @file point.js
 * @author mengke01
 * @date 
 * @description
 * 点编辑模式
 */


define(
    function(require) {

        var computeBoundingBox = require('graphics/computeBoundingBox');
        var pathAdjust = require('graphics/pathAdjust');
        var lang = require('common/lang');


        /**
         * 处理右键菜单
         * 
         * @param {string} command 命令
         */
        function onContextMenu(e) {

            if(!this.currentPoint) {
                return;
            }

            var coverLayer = this.render.getLayer('cover');
            var fontLayer = this.render.getLayer('font');
            var command = e.command;
            var shape = fontLayer.getShape(this.currentPoint.shapeId);
            var points = shape.points;
            var pointId = +this.currentPoint.pointId;

            if (command == 'add') {
                var cur = points[pointId];
                var next = points[pointId == points.length - 1 ? 0 : pointId + 1];
                var p = {
                    x: (cur.x + next.x) / 2,
                    y: (cur.y + next.y) / 2,
                    onCurve: true
                }

                points.splice(pointId + 1, 0, p);
            }
            else if (command == 'remove') {
                points.splice(pointId, 1);
            }
            else if (command == 'onCurve') {
                points[pointId].onCurve = true;
            }
            else if (command == 'offCurve') {
                delete points[pointId].onCurve;
            }
            else if (command == 'asStart') {
                shape.points = points.slice(pointId).concat(points.slice(0, pointId));
            }

            refreshControlPoints.call(this);

            this.currentPoint = null;
            fontLayer.refresh();
            this.contextMenu.hide();
        }

        // 刷新控制点
        function refreshControlPoints() {
            var controls = [];
            var shapes = this.render.getLayer('font').shapes;
            shapes.forEach(function(shape) {
                var last = shape.points.length - 1;
                shape.points.forEach(function(p, index) {
                    var cpoint = {
                        type: p.onCurve ? 'point' : 'cpoint',
                        x: p.x,
                        y: p.y,
                        point: p,
                        pointId: index,
                        shapeId: shape.id
                    };

                    if (index == 0) {
                        cpoint.style = {
                            fillColor: 'green',
                            strokeWidth: 2
                        };
                    }
                    else if (index == last) {
                        cpoint.style = {
                            fillColor: 'red',
                            strokeWidth: 2
                        };
                    }

                    controls.push(cpoint);
                });
            });

            var coverLayer = this.render.getLayer('cover');
            coverLayer.clearShapes();
            controls.forEach(function(shape){
                coverLayer.addShape(shape);
            });
            coverLayer.refresh();
        }


        var mode = {
            name: 'point',

            /**
             * 按下事件
             */
            down: function(e) {

                if (this.currentPoint) {
                    this.currentPoint.style = this.currentPointReserved.style;
                    this.currentPoint = this.currentPointReserved = null;
                }

                var render = this.render;
                var result = render.getLayer('cover').getShapeIn(e);

                if(result) {

                    this.currentPoint = result[0];
                    this.currentPointReserved = lang.clone(this.currentPoint);
                    this.currentPoint.style = lang.extend(
                        this.currentPoint.style || {}, 
                        {
                            fillColor: 'blue'
                        }
                    );

                    render.getLayer('cover').refresh();
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
                    var reserved = this.currentPointReserved;

                    if(camera.event.altKey) {
                        current.x = reserved.x;
                        current.point.x = reserved.point.x;
                    }
                    else {
                        current.x = reserved.x + camera.event.deltaX;
                        current.point.x = reserved.point.x + camera.event.deltaX;
                    }

                    if(camera.event.shiftKey) {
                        current.y = reserved.y;
                        current.point.y = reserved.point.y;
                    }
                    else {
                        current.y = reserved.y + camera.event.deltaY;
                        current.point.y = reserved.point.y + camera.event.deltaY;
                    }

                    render.getLayer('cover').refresh();
                    render.getLayer('font').refresh();

                }
            },

            /**
             * 拖动结束事件
             */
            dragend: function(e) {

                if(this.currentPoint) {
                    this.currentPoint.style = this.currentPointReserved.style;
                    this.currentPointReserved = null;
                    this.currentPoint = null;
                }
            },

            begin: function() {

                var me = this;
                var coverLayer = this.render.getLayer('cover');
                coverLayer.options.fill = true;

                refreshControlPoints.call(me);

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

                // 右键菜单
                me.render.capture.on('rightdown', me.__contextEvent = function (e) {
                    if (me.currentPoint) {
                        me.contextMenu.onClick = lang.bind(onContextMenu, me);
                        me.contextMenu.show(e, require('../menu/command').point);
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
                this.render.capture.un('move', this.__contextEvent);

                this.render.setCursor('default');
            }
        };

        return mode;
    }
);
