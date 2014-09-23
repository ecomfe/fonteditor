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
            if(this.currentGroup.shapes.length !== 1) {
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
                this.execCommand('reversepoint', shape);
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
            else if (command == 'rotate_left') {
                this.execCommand('rotateleft', shapes);
                this.currentGroup.refresh();
            }
            else if (command == 'rotate_right') {
                this.execCommand('rotateright', shapes);
                this.currentGroup.refresh();
            }
            else if (command == 'reverse_shapes') {
                this.execCommand('reverseshapes', shapes);
            }
            else if (command == 'mirror_shapes') {
                this.execCommand('mirrorshapes', shapes);
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
                    if (this.currentGroup) {
                        this.currentPoint = lang.clone(result[0]);
                    }
                }
                else {

                    if (this.currentGroup) {
                        result = render.getLayer('font').getShapeIn(e);
                        if(result) {
                            var shape = result[0];
                            if (result.length > 1) {
                                shape = selectShape(result);
                            }
                            
                            if(this.currentGroup.shapes.indexOf(shape) >=0) {
                                return;
                            }
                            else {
                                this.currentGroup.setShapes([shape]);
                                this.currentGroup.setMode('scale');
                                this.currentGroup.refresh();
                                return;
                            }
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


                if (this.currentGroup) {

                    // 点拖动模式
                    if (this.currentPoint) {
                        this.currentGroup.beginTransform(this.currentPoint);
                    }
                    // 复制模式
                    else if (e.ctrlKey && e.altKey) {
                        var shapes = lang.clone(this.currentGroup.shapes);
                        var fontLayer = this.fontLayer;
                        shapes.forEach(function(shape) {
                            shape.id = guid('shape');
                            fontLayer.addShape(shape);
                        });
                        
                        this.currentGroup.setShapes(shapes);
                    }

                }
            },

            /**
             * 拖动事件
             */
            drag: function(e) {
                var render = this.render;
                var camera = render.camera;
                if(this.currentGroup) {
                    if (this.currentPoint) {
                        this.currentGroup.transform(this.currentPoint, camera);
                    }
                    else {
                        this.currentGroup.move(camera.mx, camera.my);
                    }
                }
            },

            /**
             * 拖动结束事件
             */
            dragend: function(e) {
                if (this.currentGroup) {
                    if (this.currentPoint) {
                        this.currentGroup.finishTransform(this.currentPoint);
                        this.currentPoint = null;
                    }
                    this.fire('change');
                }
            },

            /**
             * 点击
             */
            click: function(e) {
                // 变换编辑模式
                if (e.time > 400 && this.currentGroup && !this.currentPoint) {
                    this.currentGroup.setMode(this.currentGroup.mode == 'scale' ? 'rotate' : 'scale');
                    this.currentGroup.refresh();
                }
                else {
                    this.currentPoint = null;
                }
            },

            /**
             * 移动
             */
            move: function(e) {
                var shapes = this.coverLayer.getShapeIn(e);
                if(shapes) {
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
                if (this.currentGroup) {
                    this.contextMenu.onClick = lang.bind(onContextMenu, this);
                    this.contextMenu.show(e, 
                        this.currentGroup.shapes.length > 1
                        ? commandList.shapes
                        : commandList.shape
                    );
                }
            },

            /**
             * 按键
             */
            keyup: function(e) {
                // esc键，重置model
                if (e.key == 'delete' && this.currentGroup) {
                    this.execCommand('removeshapes', this.currentGroup.shapes);
                    this.setMode();
                    this.fire('change');
                }
                else if(e.keyCode == 65 && e.ctrlKey && this.currentGroup) {
                    this.currentGroup.setShapes(this.fontLayer.shapes.slice());
                    this.currentGroup.refresh();
                }
                // 剪切
                else if (e.keyCode == 88 && e.ctrlKey && this.currentGroup) {
                    this.execCommand('cutshapes', this.currentGroup.shapes);
                    this.setMode();
                    this.fire('change');
                }
                // 复制
                else if (e.keyCode == 67 && e.ctrlKey && this.currentGroup) {
                    this.execCommand('copyshapes', this.currentGroup.shapes);
                }
                // 移动
                else if(stepMap[e.key] && this.currentGroup) {
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
                // 移动
                if(stepMap[e.key] && this.currentGroup) {
                    this.currentGroup.move(stepMap[e.key][0], stepMap[e.key][1]);
                }
            },

            /**
             * 开始模式
             */
            begin: function(shapes) {
                this.currentGroup = new ShapesGroup(shapes, this);
                this.currentGroup.refresh();
            },


            /**
             * 结束模式
             */
            end: function() {

                if (this.currentGroup) {
                    if (this.currentPoint) {
                        this.currentGroup.finishTransform(this.currentPoint);
                        this.currentPoint = null;
                    }
                    this.currentGroup.dispose();
                    this.currentGroup = null;
                }

                this.render.setCursor('default');
            }
        };

        return mode;
    }
);
