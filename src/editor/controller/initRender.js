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


        /**
         * 右键点击处理
         */
        function onContextMenu(e) {
            this.contextMenu.hide();
            if (e.command == 'add_referenceline') {
                var pos = e.pos;
                this.execCommand('addreferenceline', pos.x, pos.y);
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

                if(me.mode === modeSupport.bound) {
                    me.setMode('point');
                }
                else if(me.mode === modeSupport.point){
                    me.setMode();
                }
                else {
                    me.setMode('point');
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

                // 撤销
                if (e.keyCode == 90 && e.ctrlKey) {
                    me.execCommand('undo');
                }
                // 恢复
                else if (e.keyCode == 89 && e.ctrlKey) {
                    me.execCommand('redo');
                }
                // esc键，重置model
                else if (e.key == 'esc' && !me.mode.keyup) {
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
                
                me.mode.keydown && me.mode.keydown.call(me, e);
            });
        }

        return initRender;
    }
);
