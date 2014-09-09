/**
 * @file Editor.js
 * @author mengke01
 * @date 
 * @description
 * 字体编辑控制器
 */


define(
    function(require) {
        var lang = require('common/lang');
        var selectShape = require('render/util/selectShape');
        var computeBoundingBox = require('graphics/computeBoundingBox');
        var pathAdjust = require('render/util/pathAdjust');
        var glyf2path = require('ttf/util/glyf2path');
        var ShapeGroup = require('./ShapeGroup');

        /**
         * 初始化
         */
        function initRender() {
            var me = this;
            var render = this.render;

            render.capture.on('wheel', function(e) {
                var defaultRatio = render.options.defaultRatio || 1.2;
                var ratio = e.delta > 0 ?  defaultRatio : 1 / defaultRatio;

                render.camera.ratio = ratio;
                render.camera.center.x = e.x;
                render.camera.center.y = e.y;
                render.camera.scale *= ratio;

                render.painter.refresh();
                render.camera.ratio = 1;

            });

            render.capture.on('down', function(e) {

                var result = render.getLayer('cover').getShapeIn(e);

                if(result) {
                    if (me.currentGroup) {
                        me.currentPoint = lang.clone(result[0]);
                        me.currentGroup.beginTransform(me.currentPoint);
                    }
                }
                else {

                    if (me.currentGroup) {
                        me.currentGroup.dispose();
                        me.currentGroup = null;
                    }

                    result = render.getLayer('font').getShapeIn(e);
                    
                    if(result) {
                        var shape = result[0];
                        if (result.length > 1) {
                            shape = selectShape(result);
                        }
                        me.currentGroup = new ShapeGroup(shape, render);
                    }
                }

                render.camera.startx = e.x;
                render.camera.starty = e.y;
                render.camera.x = e.x;
                render.camera.y = e.y;
            });

            render.capture.on('drag', function(e) {

                if(me.currentGroup) {

                    var mx = render.camera.x;
                    var my = render.camera.y;

                    render.camera.x = e.x;
                    render.camera.y = e.y;

                    if (me.currentPoint) {
                        me.currentGroup.transform(me.currentPoint, render.camera);
                    }
                    else {
                        me.currentGroup.move(e.x - mx, e.y - my);
                    }
                }
            });

            render.capture.on('dragend', function(e) {
                if (me.currentGroup) {
                    if (me.currentPoint) {
                        me.currentGroup.finishTransform(me.currentPoint);
                        me.currentPoint = null;
                    }
                }
  
            });
        }

        function initLayer() {
            this.render.addLayer('cover', {
                level: 30,
                stroke: true,
                strokeColor: 'green'
            });
            this.render.addLayer('font', {
                level: 20
            });
            this.render.addLayer('axis', {
                level: 10,
                stroke: true
            });
        }

        /**
         * Render控制器
         * @param {Object} options 参数
         * @constructor
         */
        function Editor(options) {
            this.options = options || {};
        }

        /**
         * 设置渲染器
         */
        Editor.prototype.setRender = function(render) {
            this.render = render;
            initRender.call(this);
            initLayer.call(this);
            return this;
        };

        /**
         * 设置渲染器
         */
        Editor.prototype.setFont = function(font) {
            var paths = glyf2path(font);

            var width = this.render.painter.width;
            var height = this.render.painter.height;
            var offsetX = (width - (font.xMax - font.xMin)) / 2;
            var offsetY = (height - (font.yMax - font.yMin)) / 2;

            // 构造形状集合
            var shapes = paths.map(function(path) {
                var shape = {};
                var bound = computeBoundingBox.computePath(path);

                shape.points = pathAdjust(path, 1, -bound.x, -bound.y);
                shape.x = bound.x + offsetX;
                shape.y = bound.y + offsetY;
                shape.width = bound.width;
                shape.height = bound.height;
                return shape;
            });

            this.shapes = shapes;
            this.font = font;

            // 渲染形状
            this.render.reset();
            
            var fontLayer = this.render.painter.getLayer('font');

            this.shapes.forEach(function(shape) {
                fontLayer.addShape('path', shape);
            });
            
            this.render.refresh();

            return this;
        };

        /**
         * 刷新编辑器组件
         */
        Editor.prototype.refresh = function() {
            this.render.refresh();
            return this;
        };

        /**
         * 注销
         */
        Editor.prototype.dispose = function() {
            this.render && this.render.dispose();
            this.options = this.render = null;
        };

        return Editor;
    }
);
