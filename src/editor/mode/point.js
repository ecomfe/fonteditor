/**
 * @file point.js
 * @author mengke01
 * @date
 * @description
 * 点编辑模式
 */


define(
    function (require) {

        var lang = require('common/lang');

        // 移动步频
        var stepMap = {
            left: [-1, 0],
            right: [1, 0],
            up: [0, -1],
            down: [0, 1]
        };


        function onContextMenu(e) {

            if (!this.curPoint) {
                return;
            }

            if (e.returnValue === false) {
                return;
            }

            this.contextMenu.hide();

            var command = e.command;
            var shape = this.curShape;
            var points = shape.points;
            var pointId = +this.curPoint.pointId;

            if (command === 'add') {
                var cur = points[pointId];
                var next = points[pointId === points.length - 1 ? 0 : pointId + 1];
                var p = {
                    x: (cur.x + next.x) / 2,
                    y: (cur.y + next.y) / 2,
                    onCurve: true
                };

                points.splice(pointId + 1, 0, p);
            }
            else if (command === 'remove') {
                points.splice(pointId, 1);
            }
            else if (command === 'onCurve') {
                points[pointId].onCurve = true;
            }
            else if (command === 'offCurve') {
                delete points[pointId].onCurve;
            }
            else if (command === 'asStart') {
                shape.points = points.slice(pointId).concat(points.slice(0, pointId));
            }
            else if (this.supportCommand(command)) {
                this.execCommand(command);
                return;
            }

            refreshControlPoints.call(this, shape);

            delete this.curPoint;
            this.fontLayer.refresh();
            this.fire('change');
        }


        function refreshControlPoints(shape) {
            var controls = [];
            var last = shape.points.length - 1;
            var clonedShape = lang.clone(shape);

            clonedShape.id = 'cover-' + shape.id;
            clonedShape.selectable = false;
            clonedShape.style = {
                strokeColor: 'red'
            };

            clonedShape.points.forEach(function (p, index) {
                var cpoint = {
                    type: p.onCurve ? 'point' : 'cpoint',
                    x: p.x,
                    y: p.y,
                    point: p,
                    pointId: index,
                    style: {
                        fill: true,
                        stroke: true,
                        strokeColor: 'green',
                        fillColor: 'white'
                    }
                };

                if (index === 0) {
                    cpoint.style.strokeColor = 'blue';
                    cpoint.style.fillColor = 'blue';
                    cpoint.style.strokeWidth = 2;
                }
                else if (index === last) {
                    cpoint.style.strokeColor = 'red';
                    cpoint.style.fillColor = 'red';
                    cpoint.style.strokeWidth = 2;
                }

                controls.push(cpoint);
            });

            var coverLayer = this.coverLayer;

            coverLayer.clearShapes();

            // 添加轮廓
            coverLayer.addShape(clonedShape);
            // 添加控制点
            controls.forEach(function (shape) {
                coverLayer.addShape(shape);
            });

            this.curShape = shape;
            coverLayer.refresh();
        }


        var mode = {


            down: function (e) {

                // 恢复原来样式
                if (this.curPoint) {
                    if (this.curPoint._style) {
                        this.curPoint.style = lang.clone(this.curPoint._style);
                    }
                }

                delete this.curPoint;

                var result = this.coverLayer.getShapeIn(e);

                if (result) {
                    this.curPoint = result[0];
                    this.curPoint._style = lang.clone(this.curPoint.style);
                    this.curPoint.style.fillColor = 'green';

                    // 设置吸附选项
                    if (this.sorption.isEnable()) {

                        if (this.sorption.enableShape) {

                            var xAxisArray = [];
                            var yAxisArray = [];

                            // 过滤需要吸附的对象
                            this.curShape.points.forEach(function (p) {
                                xAxisArray.push(p.x);
                                yAxisArray.push(p.y);
                            });

                            // 添加参考线
                            var referenceLines = this.referenceLineLayer.shapes;
                            referenceLines.forEach(function (shape) {
                                if (undefined !== shape.p0.x) {
                                    xAxisArray.push(shape.p0.x);
                                }
                                if (undefined !== shape.p0.y) {
                                    yAxisArray.push(shape.p0.y);
                                }
                            });

                            this.sorption.clear();
                            xAxisArray.length && this.sorption.addXAxis(xAxisArray);
                            yAxisArray.length && this.sorption.addYAxis(yAxisArray);
                        }
                    }

                    this.coverLayer.refresh();
                }
            },


            drag: function (e) {

                var camera = this.render.camera;
                if (this.curPoint) {
                    var current = this.curPoint;
                    var reserved = this.curShape.points[current.pointId];

                    if (camera.event.altKey) {
                        current.x = reserved.x;
                    }
                    else {
                        current.x = reserved.x + camera.event.deltaX;
                    }

                    if (camera.event.shiftKey) {
                        current.y = reserved.y;
                    }
                    else {
                        current.y = reserved.y + camera.event.deltaY;
                    }

                    if (this.sorption.isEnable()) {
                        var result;

                        if (result = this.sorption.detectX(current.x)) {
                            current.x = result.axis;
                        }

                        if (result = this.sorption.detectY(current.y)) {
                            current.y = result.axis;
                        }
                    }

                    current.point.x = current.x;
                    current.point.y = current.y;

                    this.coverLayer.refresh();
                }
            },

            dragend: function () {
                if (this.curPoint) {
                    var reserved = this.curShape.points[this.curPoint.pointId];
                    reserved.x = this.curPoint.x;
                    reserved.y = this.curPoint.y;

                    if (this.sorption.isEnable()) {
                        this.sorption.clear();
                    }

                    this.fontLayer.refresh();
                }
                this.fire('change');
            },


            move: function (e) {
                var shape = this.coverLayer.getShapeIn(e);
                if (shape) {
                    this.render.setCursor('pointer');
                }
                else {
                    this.render.setCursor('default');
                }
            },


            rightdown: function (e) {
                if (this.curPoint) {
                    this.contextMenu.onClick = lang.bind(onContextMenu, this);
                    this.contextMenu.show(e, require('../menu/commandList').point);
                }
            },


            keyup: function (e) {

                // esc键，重置model
                if (e.key === 'delete' && this.curPoint) {
                    onContextMenu.call(this, {
                        command: 'remove'
                    });
                }
                // 移动
                else if (stepMap[e.key] && this.curPoint) {
                    this.fire('change');
                }
                else if (e.key === 'esc') {
                    this.setMode();
                }
            },


            keydown: function (e) {
                // 移动
                if (stepMap[e.key] && this.curPoint) {
                    var step = stepMap[e.key];
                    var current = this.curPoint;

                    if (step[0]) {
                        current.x += step[0];
                    }

                    if (step[1]) {
                        current.y += step[1];
                    }

                    var reserved = this.curShape.points[current.pointId];
                    reserved.x = current.point.x = current.x;
                    reserved.y = current.point.y = current.y;

                    this.coverLayer.refresh();
                    this.fontLayer.refresh();
                }
            },


            begin: function (shape) {
                var me = this;
                refreshControlPoints.call(me, shape);
            },


            end: function () {

                delete this.curPoint;
                delete this.curShape;

                this.coverLayer.clearShapes();
                this.coverLayer.refresh();
                this.render.setCursor('default');
            }
        };

        return mode;
    }
);
