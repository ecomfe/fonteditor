/**
 * @file shapes.js
 * @author mengke01
 * @date 
 * @description
 * 轮廓模式处理事件
 */


define(
    function(require) {

        var guid = require('render/util/guid');
        var ShapesGroup = require('../group/ShapesGroup');
        var lang = require('common/lang');
        var selectShape = require('render/util/selectShape');
        var commandList = require('../menu/commandList');
        var POS_CUSOR = require('./cursor');

        // 移动步频
        var stepMap = {
            'left': [-5, 0],
            'right': [5, 0],
            'up': [0, -5],
            'down': [0, 5]
        };

        /**
         * 处理右键菜单
         * 
         * @param {string} command 命令
         */
        function onContextMenu(e) {
            if(this.currentGroup.shapes.length === 0) {
                return;
            }

            this.fire('command', e);
            if(e.returnValue === false) {
                return;
            }

            this.contextMenu.hide();

            var command = e.command;

            // 是否编辑器支持
            if(this.supportCommand(command)) {
                this.execCommand(command, e);
                return;
            }

            var shapes = this.currentGroup.shapes;
            var shape = shapes[0];

            if (command == 'remove') {
                this.execCommand('removeshapes', shapes);
                this.setMode();
            }
            else if (command == 'reverse_point') {
                this.execCommand('reversepoint', shapes);
            }
            else if (command == 'top') {
                this.execCommand('topshape', shape);
            }
            else if (command == 'bottom') {
                this.execCommand('bottomshape', shape);
            }
            else if (command == 'up') {
                this.execCommand('upshape', shape);
            }
            else if (command == 'down') {
                this.execCommand('downshape', shape);
            }

            // 相交，结合和相切
            else if (command == 'join_shapes') {
                this.execCommand('joinshapes', shapes);
                this.currentGroup.setShapes(shapes);
                this.currentGroup.refresh();
            }
            else if (command == 'intersect_shapes') {
                this.execCommand('intersectshapes', shapes);
                this.currentGroup.setShapes(shapes);
                this.currentGroup.refresh();
            }
            else if (command == 'tangency_shapes') {
                this.execCommand('tangencyshapes', shapes);
                this.currentGroup.setShapes(shapes);
                this.currentGroup.refresh();
            }

            else if (command == 'rotate_left') {
                this.execCommand('rotateleft', shapes);
                this.currentGroup.setShapes(shapes);
                this.currentGroup.refresh();
            }
            else if (command == 'rotate_right') {
                this.execCommand('rotateright', shapes);
                this.currentGroup.setShapes(shapes);
                this.currentGroup.refresh();
            }
            else if (command == 'reverse_shapes') {
                this.execCommand('reverseshapes', shapes);
                this.currentGroup.setShapes(shapes);
                this.currentGroup.refresh();
            }
            else if (command == 'mirror_shapes') {
                this.execCommand('mirrorshapes', shapes);
                this.currentGroup.setShapes(shapes);
                this.currentGroup.refresh();
            }
            else if (command == 'add_referenceline') {
                var bound = this.currentGroup.getBound();
                if(bound) {
                    this.execCommand('addreferenceline', bound.x, bound.y);
                    this.execCommand(
                        'addreferenceline', 
                        bound.x + bound.width, bound.y + bound.height
                    );
                }
            }
            else if (command == 'cut') {
                this.execCommand('cutshapes', shapes);
                this.setMode();
                this.fire('change');
            }
            else if (command == 'copy') {
                this.execCommand('copyshapes', shapes);
            }
            else if (command == 'shapes_align') {
                this.execCommand('align', shapes, e.args.type);
                this.currentGroup.setShapes(shapes);
                this.currentGroup.refresh();
            }
            else if (command == 'shapes_verticalalign') {
                this.execCommand('verticalalign', shapes, e.args.type);
                this.currentGroup.setShapes(shapes);
                this.currentGroup.refresh();
            }
            this.fire('change');
        }


        var mode = {

            /**
             * 按下事件
             */
            down: function(e) {
                var render = this.render;
                var result = render.getLayer('cover').getShapeIn(e);

                if(result) {
                    this.currentPoint = lang.clone(result[0]);
                }
                else {

                    this.currentPoint = null;

                    result = render.getLayer('font').getShapeIn(e);

                    if(result) {
                        var shape = result[0];
                        if (result.length > 1) {
                            shape = selectShape(result, e);
                        }

                        var shapeIndex = this.currentGroup.shapes.indexOf(shape);
                        if(shapeIndex >= 0) {

                            if (e.ctrlKey && !e.altKey) {
                                this.currentGroup.shapes.splice(shapeIndex, 1);
                                this.currentGroup.setShapes(this.currentGroup.shapes);
                                this.currentGroup.refresh();
                                this.clicked = false;
                            }

                            return;
                        }
                        else {
                            var shapes = [shape];
                            if (e.ctrlKey) {
                                shapes = shapes.concat(this.currentGroup.shapes);;
                            }
                            this.currentGroup.setShapes(shapes);
                            this.currentGroup.setMode('scale');
                            this.currentGroup.refresh();
                            this.clicked = false;
                            return;
                        }
                    }

                    // 框选模式
                    this.setMode('range');
                }
            },

            /**
             * 开始拖动
             */
            dragstart: function(e) {

                // 点拖动模式
                if (this.currentPoint) {
                    this.currentGroup.beginTransform(this.currentPoint, this.render.camera, e);
                }
                else {
                    // 复制模式
                    if (e.ctrlKey && e.altKey) {
                        var shapes = lang.clone(this.currentGroup.shapes);
                        var fontLayer = this.fontLayer;
                        shapes.forEach(function(shape) {
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

            /**
             * 拖动事件
             */
            drag: function(e) {
                if(this.currentGroup) {
                    this.currentGroup.transform(this.currentPoint, this.render.camera, e);
                }
            },

            /**
             * 拖动结束事件
             */
            dragend: function(e) {

                if (this.currentPoint) {
                    this.currentGroup.finishTransform(this.currentPoint, this.render.camera, e);
                    this.currentPoint = null;
                    this.fire('change');
                }
                else if (this.currentGroup.mode == 'move') {
                    this.currentGroup.finishTransform(this.currentPoint, this.render.camera, e);
                    this.currentGroup.setMode('scale');
                    this.fire('change');
                }

                this.render.setCursor('default');
            },

            /**
             * 移动
             */
            move: function(e) {

                var shapes = this.coverLayer.getShapeIn(e);
                var mode = this.currentGroup.mode;
                
                if(shapes && mode != 'move' ) {
                    this.render.setCursor(POS_CUSOR[this.currentGroup.mode][shapes[0].pos] || 'default');
                }
                else {
                    this.render.setCursor('default');
                }
            },

            /**
             * 右键
             */
            rightdown: function(e) {
                // 对单个shape进行操作
                this.contextMenu.onClick = lang.bind(onContextMenu, this);
                this.contextMenu.show(e, 
                    this.currentGroup.shapes.length > 1
                    ? commandList.shapes
                    : commandList.shape
                );
            },

            click: function(e) {
                if (this.clicked) {
                    // 变换编辑模式
                    var mode = this.currentGroup.mode;
                    this.currentGroup.setMode(mode == 'scale' ? 'rotate' : 'scale');
                    this.currentGroup.refresh();
                }
                this.clicked = true;
            },

            /**
             * 按键
             */
            keyup: function(e) {
                // esc键，重置model
                if (e.key == 'delete') {
                    this.execCommand('removeshapes', this.currentGroup.shapes);
                    this.setMode();
                    this.fire('change');
                }
                // 全选
                else if(e.keyCode == 65 && e.ctrlKey) {
                    this.currentGroup.setShapes(this.fontLayer.shapes.slice());
                    this.currentGroup.refresh();
                }
                // 移动
                else if(stepMap[e.key]) {
                    this.fire('change');
                }
                else if (e.key == 'esc') {
                    this.setMode();
                }
            },

            /**
             * 按住
             */
            keydown: function(e) {
                // 剪切
                if (e.keyCode == 88 && e.ctrlKey) {
                    if (this.currentGroup.shapes.length) {
                        this.execCommand('cutshapes', this.currentGroup.shapes);
                        this.currentGroup.shapes.length = 0;
                        this.coverLayer.clearShapes();
                        this.coverLayer.refresh();
                        this.fire('change');
                    }
                }
                // 复制
                else if (e.keyCode == 67 && e.ctrlKey) {
                    if (this.currentGroup.shapes.length) {
                        this.execCommand('copyshapes', this.currentGroup.shapes);
                    }
                }
                // 移动
                if(stepMap[e.key]) {
                    this.currentGroup.move(stepMap[e.key][0], stepMap[e.key][1]);
                }
            },

            /**
             * 开始模式
             */
            begin: function(shapes, prevMode) {
                this.currentGroup = new ShapesGroup(shapes, this);
                this.currentGroup.refresh();
                this.currentGroup.setMode('scale');
                if (prevMode == 'bound') {
                    this.clicked = false;
                }
                else {
                    this.clicked = true;
                }
            },


            /**
             * 结束模式
             */
            end: function() {

                this.currentPoint = null;
                this.currentGroup.dispose();
                this.currentGroup = null;

                this.render.setCursor('default');
            }
        };

        return mode;
    }
);
