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

            this.fire('command', e);
            if(e.returnValue == false) {
                return;
            }

            this.contextMenu.hide();

            var fontLayer = this.fontLayer;
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
            this.fontLayer.refresh();
        }

        // 刷新控制点
        function refreshControlPoints() {
            var controls = [];
            var shapes = this.fontLayer.shapes;
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

            var coverLayer = this.coverLayer;
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

                var result = this.coverLayer.getShapeIn(e);

                if(result) {

                    this.currentPoint = result[0];
                    this.currentPointReserved = lang.clone(this.currentPoint);
                    this.currentPoint.style = lang.extend(
                        this.currentPoint.style || {}, 
                        {
                            fillColor: 'blue'
                        }
                    );

                    this.coverLayer.refresh();
                }
            },

            /**
             * 拖动事件
             */
            drag: function(e) {

                var camera = this.render.camera;
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

                    this.coverLayer.refresh();
                    this.fontLayer.refresh();

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

            /**
             * 鼠标移动
             */
            move: function(e) {
                var shape = this.coverLayer.getShapeIn(e);
                if(shape) {
                    this.render.setCursor('pointer');
                }
                else {
                    this.render.setCursor('default');
                }
            },

            /**
             * 开始
             */
            begin: function() {

                var me = this;
                var coverLayer = this.coverLayer;
                coverLayer.options.fill = true;
                refreshControlPoints.call(me);

            },

            /**
             * 右键
             */
            rightdown: function(e) {
                if (this.currentPoint) {
                    this.contextMenu.onClick = lang.bind(onContextMenu, this);
                    this.contextMenu.show(e, require('../menu/commandList').point);
                }
            },

            /**
             * 结束
             */
            end: function() {

                this.coverLayer.options.fill = false;
                this.coverLayer.clearShapes();
                this.coverLayer.refresh();
                this.render.setCursor('default');
            }
        };

        return mode;
    }
);
