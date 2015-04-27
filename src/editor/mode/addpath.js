/**
 * @file 添加shape模式
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        var mode = {

            down: function (e) {

                var coverLayer = this.coverLayer;
                var result = coverLayer.getShapeIn(e);

                // 闭合路径
                if (result[0] && this.points.length > 1 && result[0] === this.points[0]) {

                    var points = this.points.map(function (p) {
                        var ret = {
                            x: p.x,
                            y: p.y
                        };

                        if (p.onCurve) {
                            ret.onCurve = true;
                        }

                        return ret;
                    });

                    var shape = this.fontLayer.addShape('path', {
                        points: points
                    });
                    this.fontLayer.refresh();
                    this.fire('change');

                    this.setMode('shapes', [shape], 'addpath');

                }
                // 添加控制点
                else {

                    var x = e.x;
                    var y = e.y;

                    if (this.points.length) {
                        var last = this.points[this.points.length - 1];
                        if (e.shiftKey) {
                            y = last.y;
                        }

                        if (e.altKey) {
                            x = last.x;
                        }
                    }

                    var point = coverLayer.addShape({
                        type: 'point',
                        x: x,
                        y: y,
                        onCurve: true
                    });

                    this.points.push(point);

                    if (this.points.length === 1) {
                        point.style = {
                            strokeColor: 'red'
                        };
                    }
                    else {
                        var p0 = this.points[this.points.length - 2];

                        if (p0.onCurve) {
                            coverLayer.addShape({
                                type: 'line',
                                p0: {
                                    x: p0.x,
                                    y: p0.y
                                },
                                p1: {
                                    x: point.x,
                                    y: point.y
                                }
                            });
                        }
                        else {
                            coverLayer.addShape({
                                type: 'beziercurve',
                                points: this.points.slice(this.points.length - 3)
                            });
                        }
                    }

                    this.dashedLine.p0.x = point.x;
                    this.dashedLine.p0.y = point.y;
                    coverLayer.refresh();
                }

                // 标记鼠标按住
                this.downMouse = true;
            },

            up: function (e) {
                this.downMouse = false;
                if (this.curCurve) {
                    this.curCurve = null;
                    // 增加一个悬空的点，用来创建平滑曲线
                    this.points.push({
                        x: e.x,
                        y: e.y,
                        onCurve: false
                    });
                }
            },

            move: function (e) {

                // 检查起始点, 用手型标注
                var point = this.coverLayer.getShapeIn(e);
                if (point[0] && point[0] === this.points[0]) {
                    this.render.setCursor('pointer');
                }
                else {
                    this.render.setCursor('crosshair');
                }

                var points = this.points;
                var x = e.x;
                var y = e.y;
                var last = points[points.length - 1]; // 最后一个点

                // 配合shift和alt键设置水平或者垂直拖拽
                if ((e.shiftKey || e.altKey) && points.length) {
                    if (e.shiftKey) {
                        y = last.y;
                    }

                    if (e.altKey) {
                        x = last.x;
                    }
                }

                // 如果鼠标被按住，则可以拖出bezier曲线
                if (this.downMouse && points.length >= 2) {
                    // 设置倒数第二个点
                    var last2 = points[points.length - 2];
                    // 如果已经创建了曲线，则需要改变曲线形状
                    if (!this.curCurve && last2.onCurve) {

                        points.splice(points.length - 1, 0, {
                            x: 2 * last.x - x,
                            y: 2 * last.y - y,
                            onCurve: false
                        });

                        this.coverLayer.shapes.splice(this.coverLayer.shapes.length - 1, 1);

                        this.curCurve = this.coverLayer.addShape({
                            type: 'beziercurve',
                            points: points.slice(points.length - 3)
                        });
                    }
                    else {
                        last2.x = 2 * last.x - x;
                        last2.y = 2 * last.y - y;
                    }

                    this.dashedLine.disabled = true;
                    this.coverLayer.refresh();
                }
                else if (points.length) {
                    // 更新dashLine
                    this.dashedLine.p1.x = x;
                    this.dashedLine.p1.y = y;
                    this.dashedLine.disabled = false;
                    this.coverLayer.refresh();
                }
            },

            undo: function (e) {
                // 移除上一个控制点
                if (this.points.length) {
                    var points = this.points;
                    var shapes = this.coverLayer.shapes;
                    var last = points[points.length - 1];
                    var last2 = points[points.length - 2];

                    // 如果本段是曲线，并且上一个是悬空点
                    if (last && !last.onCurve) {
                        points.splice(points.length - 3, 3);
                        shapes.splice(shapes.length - 2, 2);
                    }
                    // 如果本段是曲线，并且上一个不是悬空点
                    else if (last2 && !last2.onCurve) {
                        points.splice(points.length - 2, 2);
                        shapes.splice(shapes.length - 2, 2);
                    }
                    else {
                        points.splice(points.length - 1, 1);
                        shapes.splice(shapes.length - 2, 2);
                    }

                    if (points.length) {
                        var point = points[points.length - 1];
                        this.dashedLine.p0.x = point.x;
                        this.dashedLine.p0.y = point.y;
                    }
                    else {
                        this.dashedLine.disabled = true;
                    }

                    this.coverLayer.refresh();
                }
            },

            begin: function () {
                this.coverLayer.clearShapes();
                this.points = [];
                this.dashedLine = this.coverLayer.addShape({
                    type: 'line',
                    dashed: true,
                    disabled: true,
                    selectable: false,
                    p0: {},
                    p1: {}
                });
                this.render.setCursor('crosshair');
            },


            end: function () {
                this.points = this.dashedLine = this.downMouse = this.curCurve = null;
                this.coverLayer.clearShapes();
                this.coverLayer.refresh();
                this.render.setCursor('default');
            }
        };

        return mode;
    }
);
