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
        var commandList = require('../menu/command');
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

            var coverLayer = this.render.getLayer('cover');
            var fontLayer = this.render.getLayer('font');
            var command = e.command;
            var shape = this.currentGroup.shapes[0];

            if (command == 'add') {
                this.setMode('addshape');
            }
            else if (command == 'remove') {

                this.currentGroup.shapes.forEach(function(shape) {
                    fontLayer.removeShape(shape);
                });
                
                fontLayer.refresh();
                this.setMode();
            }
            else if (command == 'reverse') {
                shape.points = shape.points.reverse();
                fontLayer.refresh();
            }
            else if (command == 'top') {
                var index = fontLayer.shapes.indexOf(shape);
                fontLayer.shapes.splice(index, 1);
                fontLayer.shapes.push(shape);
            }
            else if (command == 'bottom') {
                var index = fontLayer.shapes.indexOf(shape);
                fontLayer.shapes.splice(index, 1);
                fontLayer.shapes.unshift(shape);
            }
            else if (command == 'up') {
                var index = fontLayer.shapes.indexOf(shape);
                fontLayer.shapes.splice(index, 1);
                fontLayer.shapes.splice(index + 1, 0, shape);
            }
            else if (command == 'down') {
                var index = fontLayer.shapes.indexOf(shape);
                fontLayer.shapes.splice(index, 1);
                fontLayer.shapes.splice(index - 1, 0, shape);
            }
        }


        var mode = {

            name: 'shapes',

            /**
             * 按下事件
             */
            down: function(e) {
                var render = this.render;
                var camera = this.render.camera;
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
             * 开始模式
             */
            begin: function(shapes) {
                var me = this;
                var coverLayer = me.render.getLayer('cover');

                this.currentGroup = new ShapesGroup(shapes, this.render);
                this.currentGroup.refresh();

                // 注册鼠标样式
                me.render.capture.on('move', me.__moveEvent = function (e) {
                    var shapes = coverLayer.getShapeIn(e);
                    if(shapes) {
                        me.render.setCursor(POS_CUSOR[me.currentGroup.mode][shapes[0].pos] || 'default');
                    }
                    else {
                        me.render.setCursor('default');
                    }
                });

                // 右键菜单
                me.render.capture.on('rightdown', me.__contextEvent = function (e) {
                    // 对单个shape进行操作
                    if (me.currentGroup) {
                        me.contextMenu.onClick = lang.bind(onContextMenu, me);
                        me.contextMenu.show(e, 
                            me.currentGroup.shapes.length > 1
                            ? commandList.shapes
                            : commandList.shape
                        );
                    }
                });

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

                this.render.capture.un('move', this.__moveEvent);
                this.render.capture.un('rightdown', this.__contextEvent);
                this.render.setCursor('default');
            }
        };

        return mode;
    }
);
