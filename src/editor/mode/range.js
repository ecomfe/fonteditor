/**
 * @file range.js
 * @author mengke01
 * @date 
 * @description
 * 多选区模式
 */


define(
    function(require) {

        var ShapeGroup = require('../group/ShapeGroup');
        var lang = require('common/lang');
        var selectShape = require('render/util/selectShape');

        var POS_CUSOR = require('./cursor');

        var mode = {

            name: 'range',

            /**
             * 按下事件
             */
            down: function(e) {

            },

            /**
             * 开始拖动
             */
            dragstart: function(e) {
                mode.begin.call(this, e);
            },

            /**
             * 拖动事件
             */
            drag: function(e) {
                if (this.selectionBox) {
                    var camera = this.render.camera;
                    this.selectionBox.width = camera.x - this.selectionBox.x;
                    this.selectionBox.height = camera.y - this.selectionBox.y;
                    this.render.getLayer('cover').refresh();
                }
            },

            /**
             * 拖动结束事件
             */
            dragend: function(e) {
                if(this.selectionBox) {
                    this.selectionBox = null;
                    var coverLayer = this.render.getLayer('cover');
                    coverLayer.clearShapes();
                    coverLayer.refresh();
                }
                this.setMode();
            },

            /**
             * 开始模式
             */
            begin: function() {
                var camera = this.render.camera;
                this.selectionBox = {
                    type: 'dashedrect',
                    x: camera.x,
                    y: camera.y
                };
                this.render.getLayer('cover').addShape(this.selectionBox);
            },

            /**
             * 结束模式
             */
            end: function() {
                this.selectionBox = null;
            }
        };

        return mode;
    }
);
