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
        var computeBoundingBox = require('graphics/computeBoundingBox');
        var pathAdjust = require('render/util/pathAdjust');
        var editorMode = require('./mode/editorMode');
        var ContextMenu = require('./menu/ContextMenu');

        /**
         * 初始化
         */
        function initRender() {
            var me = this;
            var render = this.render;

            function setCamera(e) {
                render.camera.x = e.x;
                render.camera.y = e.y;
                render.camera.event = e;
            }

            render.capture.on('wheel', function(e) {

                if (me.contextMenu.visible()) {
                    return;
                }

                var defaultRatio = render.options.defaultRatio || 1.2;
                var ratio = e.delta > 0 ?  defaultRatio : 1 / defaultRatio;

                if (render.camera.scale * ratio < 0.1) {
                    return;
                }

                render.camera.ratio = ratio;
                render.camera.center.x = e.x;
                render.camera.center.y = e.y;
                render.camera.scale *= ratio;
                render.painter.refresh();
                render.camera.ratio = 1;

            });

            render.capture.on('down', function(e) {

                if (me.contextMenu.visible()) {
                    return;
                }

                render.camera.startx = e.x;
                render.camera.starty = e.y;
                setCamera(e);

                me.mode.down && me.mode.down.call(me, e);
            });

            render.capture.on('dragstart', function(e) {

                if (me.contextMenu.visible()) {
                    return;
                }
                setCamera(e);
                me.mode.dragstart && me.mode.dragstart.call(me, e);
            });

            render.capture.on('drag', function(e) {

                if (me.contextMenu.visible()) {
                    return;
                }

                render.camera.mx = e.x - render.camera.x;
                render.camera.my = e.y - render.camera.y;
                setCamera(e);

                me.mode.drag && me.mode.drag.call(me, e);
            });

            render.capture.on('dragend', function(e) {

                if (me.contextMenu.visible()) {
                    return;
                }
                setCamera(e);

                me.mode.dragend && me.mode.dragend.call(me, e);
            });

            render.capture.on('up', function(e) {

                if (me.contextMenu.visible()) {
                    return;
                }

                setCamera(e);

                me.mode.up && me.mode.up.call(me, e);
            });

            render.capture.on('dblclick', function(e) {

                if (me.contextMenu.visible()) {
                    return;
                }

                if(me.mode === editorMode.bound) {
                    me.setMode('point');
                }
                else if(me.mode === editorMode.point){
                    me.setMode('bound');
                }
                else {
                    me.setMode('point');
                }
            });

        }

        function initLayer() {

            this.render.addLayer('cover', {
                level: 30,
                fill: false,
                strokeColor: 'green',
                fillColor: 'white',
            });

            this.render.addLayer('font', {
                level: 20,
                lineWidth: 2,
                strokeColor: 'red'
            });

            this.render.addLayer('axis', {
                level: 10,
                fill: false,
                strokeColor: '#A6A6FF'
            });
        }

        function initAxis() {
            // 将坐标原点翻转
            var center = this.render.camera.center;

            // 绘制轴线
            this.axis = {
                type: 'axis',
                x: center.x,
                y: center.y,
                width: 100,
                unitsPerEm: this.options.unitsPerEm,
                metrics: this.options.metrics,
                selectable: false
            };
            this.render.getLayer('axis').addShape(this.axis);
        }

        /**
         * Render控制器
         * @param {Object} options 参数
         * @constructor
         */
        function Editor(main, options) {
            this.options = lang.extend({
                unitsPerEm: 512,
                // 字体测量规格
                metrics: {
                    WinAscent: 480,
                    WinDecent: -33,
                    'x-Height': 256,
                    'CapHeight': 358
                },
                contextMenu: {}
            }, options);

            this.contextMenu = new ContextMenu(main, this.options.contextMenu);
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

            var contours = font.contours;

            var width = this.render.painter.width;
            var height = this.render.painter.height;
            var options = this.options;

            // 坐标原点位置，基线原点
            var offsetX = (width - options.unitsPerEm) / 2;
            var offsetY = (height + (options.unitsPerEm + options.metrics.WinDecent)) / 2;

            // 构造形状集合
            var shapes = contours.map(function(path) {
                var shape = {};
                var bound = computeBoundingBox.computePath(path);
                path = pathAdjust(path, 1, -1);
                shape.points = pathAdjust(path, 1, 1, offsetX, offsetY);
                return shape;
            });

            this.font = font;

            // 渲染形状
            this.render.reset();

            // 设置坐标原点
            var camera = this.render.camera;
            camera.center.x = offsetX;
            camera.center.y = offsetY;

            initAxis.call(this);

            var fontLayer = this.render.painter.getLayer('font');

            shapes.forEach(function(shape) {
                fontLayer.addShape('path', shape);
            });
            
            this.render.refresh();

            this.setMode();

            return this;
        };

        /**
         * 切换编辑模式
         * 
         * @param {string} modeName 模式名称
         * @return {Editor} 本对象
         */
        Editor.prototype.setMode = function(modeName) {

            if (this.mode) {
                this.mode.end.call(this);
            }
            this.mode = editorMode[modeName] || editorMode['default'];

            var args = Array.prototype.slice.call(arguments, 1);
            this.mode.begin.apply(this, args);
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
            this.contextMenu.dispose();
            this.render && this.render.dispose();
            this.options = this.contextMenu = this.render = null;
        };

        return Editor;
    }
);
