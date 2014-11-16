/**
 * @file initRender.js
 * @author mengke01
 * @date 
 * @description
 * Editor 的render初始化
 */


define(
    function(require) {

        var commandList = require('../menu/commandList');
        var lang = require('common/lang');
        var modeSupport = require('../mode/support');
        var pathAdjust = require('graphics/pathAdjust');
        var computeBoundingBox = require('graphics/computeBoundingBox');
        var selectShape = require('render/util/selectShape');
        
        /**
         * 右键点击处理
         */
        function onContextMenu(e) {
            this.contextMenu.hide();
            if (e.command == 'add_referenceline') {
                var pos = e.pos;
                this.execCommand('addreferenceline', pos.x, pos.y);
            }
            else if (e.command == 'split') {
                this.setMode('split');
            }
            else if (e.command == 'paste') {
                var shapes = this.getClipBoard();
                if(shapes) {
                    var bound = computeBoundingBox.computePath.apply(null, 
                        shapes.map(function(shape){
                            return shape.points;
                        })
                    );
                    // 需要根据坐标原点以及缩放换算成鼠标位置移动
                    var origin = this.axis;
                    var pos = e.pos;
                    var scale = this.render.camera.scale;
                    var x = (pos.x - origin.x) / scale;
                    var y = (origin.y - pos.y) / scale;

                    shapes.forEach(function(shape) {
                        pathAdjust(shape.points, 1, 1, x - bound.x, y - bound.y - bound.height);
                    });
                    this.setShapes(shapes);
                    this.setMode('shapes', shapes);
                    this.fire('change');
                }
            }
            else if (e.command == 'add_supportshapes') {
                var type = e.args.type;
                this.execCommand('addsupportshapes', type);
            }
            else if (e.command == 'sorption') {
                var selected = e.args.selected;
                this.execCommand('sorption', !selected);
            }
            else {
                this.execCommand(e.command, e);
            }
        }

        /**
         * 初始化渲染器
         */
        function initRender() {
            var me = this;
            var render = this.render;

            function setCamera(e) {
                render.camera.x = e.x;
                render.camera.y = e.y;
                render.camera.event = e;
            }

            render.capture.on('down', function(e) {

                if (me.contextMenu.visible()) {
                    return;
                }

                render.camera.startX = e.x;
                render.camera.startY = e.y;
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

            render.capture.on('move', function(e) {

                if (me.contextMenu.visible()) {
                    return;
                }
                
                // 这里由于canvas绘制导致0.5像素偏差，需要修正一下
                me.graduationMarker.moveTo(e.x - 1, e.y - 1);
                me.mode.move && me.mode.move.call(me, e);
            });

            render.capture.on('up', function(e) {

                if (me.contextMenu.visible()) {
                    return;
                }

                me.mode.up && me.mode.up.call(me, e);
            });

            render.capture.on('click', function(e) {

                if (me.contextMenu.visible()) {
                    return;
                }

                me.mode.click && me.mode.click.call(me, e);
            });


            render.capture.on('dblclick', function(e) {

                if (me.contextMenu.visible()) {
                    return;
                }

                var result = render.getLayer('font').getShapeIn(e);
                if(result) {
                    var shape = selectShape(result, e);
                    me.setMode('point', shape);
                }
                else if(me.mode === modeSupport.point){
                    me.setMode();
                }
            });

            render.capture.on('rightdown', function(e) {

                if (me.mode.rightdown) {
                    me.mode.rightdown.call(me, e);
                }
                else {
                    me.contextMenu.onClick = lang.bind(onContextMenu, me);
                    me.contextMenu.show(e, commandList.editor);
                }
            });

            render.keyCapture.on('keyup', function(e) {
                if (me.contextMenu.visible()) {
                    return;
                }

                // esc键，重置model
                if (e.key == 'esc' && !me.mode.keyup) {
                    me.setMode();
                }
                else {
                    me.mode.keyup && me.mode.keyup.call(me, e);
                }
            });

            render.keyCapture.on('keydown', function(e) {
                if (me.contextMenu.visible()) {
                    return;
                }

                // 保存
                if (e.keyCode == 83 && e.ctrlKey) {
                    me.fire('save', {
                        font: me.getFont()
                    });
                }
                // 粘贴
                else if (e.keyCode == 86 && e.ctrlKey) {
                    var shapes = me.getClipBoard();
                    if(shapes) {
                        me.setShapes(shapes);
                        me.setMode('shapes', shapes);
                        me.fire('change');
                    }
                }
                // 放大
                else if (e.keyCode == 187 && (e.ctrlKey || e.altKey)) {
                    e.originEvent.stopPropagation();
                    e.originEvent.preventDefault();
                    var size = render.getSize();
                    render.scale(1.25, {
                        x: size.width / 2, 
                        y: size.height / 2
                    });
                }
                // 缩小
                else if (e.keyCode == 189 && (e.ctrlKey || e.altKey)) {
                    e.originEvent.stopPropagation();
                    e.originEvent.preventDefault();
                    var size = render.getSize();
                    render.scale(0.8, {
                        x: size.width / 2, 
                        y: size.height / 2
                    });
                }
                // 撤销
                else if (e.keyCode == 90 && e.ctrlKey) {
                    me.execCommand('undo');
                }
                // 恢复
                else if (e.keyCode == 89 && e.ctrlKey) {
                    me.execCommand('redo');
                }

                else {
                    me.mode.keydown && me.mode.keydown.call(me, e);
                }
            });


            render.keyCapture.on('keydown', function(e) {
                if (me.contextMenu.visible()) {
                    return;
                }
                
                me.mode.keydown && me.mode.keydown.call(me, e);
            });


            render.on('resize', function(e) {
                me.render.move(
                    (e.size.width - e.prevSize.width) / 2,
                    (e.size.height - e.prevSize.height) / 2
                );
                me.render.refresh();
            });
        }

        return initRender;
    }
);
