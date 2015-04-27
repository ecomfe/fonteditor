/**
 * @file 轮廓操作模式
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {

        var guid = require('render/util/guid');
        var ShapesGroup = require('../group/ShapesGroup');
        var lang = require('common/lang');
        var selectShape = require('render/util/selectShape');
        var commandList = require('../menu/commandList');
        var POS_CUSOR = require('../util/cursor');

        // 移动步频
        var stepMap = {
            left: [-1, 0],
            right: [1, 0],
            up: [0, -1],
            down: [0, 1]
        };


        function onContextMenu(e) {

            if (!this.currentGroup.shapes.length) {
                return;
            }

            this.contextMenu.hide();

            var command = e.command;
            var args = e.args;
            var shapes = this.currentGroup.shapes;

            switch (command) {
                case 'topshape':
                case 'bottomshape':
                case 'upshape':
                case 'downshape':
                    this.execCommand(command, shapes[0]);
                    break;
                case 'joinshapes':
                case 'intersectshapes':
                case 'tangencyshapes':
                case 'rotateleft':
                case 'rotateright':
                case 'flipshapes':
                case 'mirrorshapes':
                case 'cutshapes':
                case 'copyshapes':
                case 'removeshapes':
                case 'reversepoints':
                    this.execCommand(command, shapes);
                    break;
                case 'alignshapes':
                case 'verticalalignshapes':
                case 'horizontalalignshapes':
                    this.execCommand(command, shapes, args.align);
                    break;
                case 'addreferenceline':
                    var bound = this.currentGroup.getBound();
                    if (bound) {
                        this.execCommand(command, bound.x, bound.y);
                        this.execCommand(command, bound.x + bound.width, bound.y + bound.height);
                    }
                    break;
                default:
                    // 是否编辑器支持
                    if (this.supportCommand(command)) {
                        this.execCommand(command, e);
                    }
            }
        }


        var mode = {


            down: function (e) {
                var render = this.render;
                var result = render.getLayer('cover').getShapeIn(e);

                if (result) {
                    this.currentPoint = lang.clone(result[0]);
                }
                else {

                    this.currentPoint = null;

                    result = render.getLayer('font').getShapeIn(e);

                    if (result) {
                        var shape = result[0];
                        if (result.length > 1) {
                            shape = selectShape(result, e);
                        }

                        var shapeIndex = this.currentGroup.shapes.indexOf(shape);
                        if (shapeIndex >= 0) {

                            // ctl多选，点选2次, !altKey 防止复制冲突
                            if (e.ctrlKey && !e.altKey) {
                                this.currentGroup.shapes.splice(shapeIndex, 1);
                                this.refreshSelected(this.currentGroup.shapes.slice(0));
                                this.clicked = false;
                            }

                            return;
                        }

                        var shapes = [shape];
                        // 多选
                        if (e.ctrlKey) {
                            shapes = shapes.concat(this.currentGroup.shapes);
                        }

                        this.currentGroup.setMode('scale');
                        this.refreshSelected(shapes);
                        this.clicked = false;
                        return;
                    }

                    // 框选模式
                    this.setMode('range');
                }
            },


            dragstart: function (e) {

                // 点拖动模式
                if (this.currentPoint) {
                    this.currentGroup.beginTransform(this.currentPoint, this.render.camera, e);
                }
                else {
                    // 复制模式
                    if (e.ctrlKey && e.altKey) {
                        var shapes = lang.clone(this.currentGroup.shapes);
                        var fontLayer = this.fontLayer;
                        shapes.forEach(function (shape) {
                            shape.id = guid('shape');
                            fontLayer.addShape(shape);
                        });
                        this.currentGroup.setShapes(shapes);
                    }
                    // 移动
                    this.currentGroup.setMode('move');
                    this.currentGroup.beginTransform(this.currentPoint, this.render.camera, e);
                }

            },


            drag: function (e) {
                if (this.currentGroup) {
                    this.currentGroup.transform(this.currentPoint, this.render.camera, e);
                }
            },


            dragend: function (e) {

                if (this.currentPoint) {
                    this.currentGroup.finishTransform(this.currentPoint, this.render.camera, e);
                    this.currentPoint = null;
                    this.fire('change');
                }
                else if (this.currentGroup.mode === 'move') {
                    this.currentGroup.finishTransform(this.currentPoint, this.render.camera, e);
                    this.currentGroup.setMode('scale');
                    this.fire('change');
                }

                this.render.setCursor('default');
            },


            move: function (e) {

                var shapes = this.coverLayer.getShapeIn(e);
                var mode = this.currentGroup.mode;

                if (shapes && mode !== 'move') {
                    this.render.setCursor(POS_CUSOR[this.currentGroup.mode][shapes[0].pos] || 'default');
                }
                else {
                    this.render.setCursor('default');
                }
            },


            rightdown: function (e) {
                // 对单个shape进行操作
                this.contextMenu.onClick = lang.bind(onContextMenu, this);
                this.contextMenu.show(e,
                    this.currentGroup.shapes.length > 1
                    ? commandList.shapes
                    : commandList.shape
                );
            },

            click: function (e) {
                if (this.clicked) {
                    // 变换编辑模式
                    var mode = this.currentGroup.mode;
                    this.currentGroup.setMode(mode === 'scale' ? 'rotate' : 'scale');
                    this.currentGroup.refresh();
                }
                this.clicked = true;
            },


            keyup: function (e) {
                // esc键，重置model
                if (e.key === 'delete') {
                    this.execCommand('removeshapes', this.currentGroup.shapes);
                    this.setMode();
                }
                // 全选
                else if (e.keyCode === 65 && e.ctrlKey) {
                    this.currentGroup.setShapes(this.fontLayer.shapes.slice());
                    this.currentGroup.refresh();
                }
                // 移动
                else if (stepMap[e.key]) {
                    this.fire('change');
                }
                else if (e.key === 'esc') {
                    this.setMode();
                }
            },


            keydown: function (e) {
                // 剪切
                if (e.keyCode === 88 && e.ctrlKey) {
                    if (this.currentGroup.shapes.length) {
                        this.execCommand('cutshapes', this.currentGroup.shapes);
                    }
                }
                // 复制
                else if (e.keyCode === 67 && e.ctrlKey) {
                    if (this.currentGroup.shapes.length) {
                        this.execCommand('copyshapes', this.currentGroup.shapes);
                    }
                }

                // 移动
                if (stepMap[e.key]) {
                    this.currentGroup.move(stepMap[e.key][0], stepMap[e.key][1]);
                }
            },


            begin: function (shapes, prevMode) {

                this.currentGroup = new ShapesGroup(shapes, this);
                this.currentGroup.refresh();
                this.currentGroup.setMode('scale');

                if (prevMode === 'bound' || prevMode === 'addpath') {
                    this.clicked = false;
                }
                else {
                    this.clicked = true;
                }

                this.fire('selection:change', {
                    shapes: shapes
                });
            },


            end: function () {
                this.currentPoint = null;
                this.currentGroup.dispose();
                this.currentGroup = null;
                this.render.setCursor('default');
                this.fire('selection:change');
            }
        };

        return mode;
    }
);
