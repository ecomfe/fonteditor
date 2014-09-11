/**
 * @file bound.js
 * @author mengke01
 * @date 
 * @description
 * 轮廓模式处理事件
 */


define(
    function(require) {

        var ShapeGroup = require('../group/ShapeGroup');
        var lang = require('common/lang');
        var selectShape = require('render/util/selectShape');

        var POS_CUSOR = require('./cursor');

        var boundMode = {

            name: 'bound',

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
                        this.currentGroup.dispose();
                        this.currentGroup = null;
                    }

                    result = render.getLayer('font').getShapeIn(e);

                    if(result) {
                        var shape = result[0];
                        if (result.length > 1) {
                            shape = selectShape(result);
                        }
                        this.currentGroup = new ShapeGroup(shape, render);
                    }
                    // 框选模式
                    else {
                        this.selectionBox = {
                            type: 'dashedrect',
                            x: camera.x,
                            y: camera.y
                        };
                        render.getLayer('cover').addShape(this.selectionBox);
                    }
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
                // 框选模式
                else {
                    this.selectionBox.width = camera.x - this.selectionBox.x;
                    this.selectionBox.height = camera.y - this.selectionBox.y;
                    render.getLayer('cover').refresh();
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
                else if(this.selectionBox) {
                    this.selectionBox = null;
                    var coverLayer = this.render.getLayer('cover');
                    coverLayer.clearShapes();
                    coverLayer.refresh();
                }
            },

            /**
             * 开始模式
             */
            begin: function() {
                var me = this;
                var coverLayer = me.render.getLayer('cover');

                // 注册鼠标样式
                me.render.capture.on('move', me.__moveEvent = function (e) {
                    var shapes = coverLayer.getShapeIn(e);
                    if(shapes) {
                        me.render.setCursor(POS_CUSOR[shapes[0].pos] || 'default');
                    }
                    else {
                        me.render.setCursor('default');
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
                this.render.setCursor('default');
            }
        };

        return boundMode;
    }
);
