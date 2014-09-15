/**
 * @file shapes.js
 * @author mengke01
 * @date 
 * @description
 * 轮廓模式处理事件
 */


define(
    function(require) {

        var ShapesGroup = require('../group/ShapesGroup');
        var lang = require('common/lang');
        var selectShape = require('render/util/selectShape');
        var commandList = require('../menu/commandList');
        var POS_CUSOR = require('./cursor');


        /**
         * 处理右键菜单
         * 
         * @param {string} command 命令
         */
        function onContextMenu(e) {
            if(!this.currentGroup.shapes.length == 1) {
                return;
            }

            this.fire('command', e);
            if(e.returnValue == false) {
                return;
            }

            this.contextMenu.hide();

            var command = e.command;
            // 是否编辑器支持
            if(this.supportCommand(command)) {
                this.execCommand(command);
                return;
            }

            var shape = this.currentGroup.shapes[0];

            if (command == 'remove') {
                this.execCommand('removeshapes', this.currentGroup.shapes);
                this.setMode();
            }
            else if (command == 'reverse') {
                this.execCommand('reverseshape', shape);
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
        }


        var mode = {

            name: 'shapes',

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
                if (this.currentGroup && this.currentPoint) {
                    this.currentGroup.beginTransform(this.currentPoint);
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
                }
                else if (e.key == 'esc') {
                    this.setMode();
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
