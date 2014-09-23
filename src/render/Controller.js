/**
 * @file Controller.js
 * @author mengke01
 * @date 
 * @description
 * 默认的渲染控制器
 */


define(
    function(require) {

        var selectShape = require('./util/selectShape');
        
        /**
         * 初始化
         */
        function initRender() {
            
            var render = this.render;


            render.capture.on('down', function(e) {
                var result = render.getLayer('cover').getShapeIn(e);

                if(result) {
                    render.selectedShape = result[0];
                }
                else {
                    result = render.getLayer('font').getShapeIn(e);
                    if (result.length > 1) {
                        render.selectedShape = selectShape(result);
                    }
                    else {
                        render.selectedShape = result[0];
                    }
                }


                render.camera.x = e.x;
                render.camera.y = e.y;
            });

            render.capture.on('drag', function(e) {
                var shape = render.selectedShape;
                if(shape) {
                    render.getLayer(shape.layerId)
                        .move(e.x - render.camera.x, e.y - render.camera.y, shape)
                        .refresh();
                }
                else {
                    render.move(e.x - render.camera.x, e.y - render.camera.y)
                        .refresh();
                }
                render.camera.x = e.x;
                render.camera.y = e.y;
            });

            render.capture.on('dragend', function(e) {
                var shape = render.selectedShape;
                if(shape) {
                    render.getLayer(shape.layerId)
                        .move(e.x - render.camera.x, e.y - render.camera.y, shape)
                        .refresh();
                    render.selectedShape = null;
                }
                else {
                    render.painter.refresh();
                }
            });
        }


        /**
         * Render控制器
         * @param {Object} options 参数
         * @constructor
         */
        function Controller(options) {
            this.options = options || {};
        }

        /**
         * 注销
         */
        Controller.prototype.setRender = function(render) {
            this.render = render;
            initRender.call(this);
            return this;
        };

        /**
         * 注销
         */
        Controller.prototype.dispose = function() {
            this.render && this.render.dispose();
            this.options = this.render = null;
        };

        return Controller;
    }
);
