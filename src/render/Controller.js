/**
 * @file Controller.js
 * @author mengke01
 * @date 
 * @description
 * 默认的渲染控制器
 */


define(
    function(require) {
        var lang = require('common/lang');
        var selectShape = require('./util/selectShape');
        
        /**
         * 初始化
         */
        function initRender() {
            
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
                var result = render.painter.getShapeIn(e);

                if(result) {
                    if (result.length > 1) {
                        render.selectedShape = selectShape(result);
                    }
                    else {
                        render.selectedShape = result[0];
                    }
                }
                render.camera.mx = e.x;
                render.camera.my = e.y;
            });

            render.capture.on('drag', function(e) {
                var shape = render.selectedShape;
                if(shape) {
                    render.painter.getLayer(shape.layerId)
                        .move(e.x - render.camera.mx, e.y - render.camera.my, shape)
                        .refresh();
                }
                else {
                    render.painter.move(e.x - render.camera.mx, e.y - render.camera.my)
                        .refresh();
                }
                render.camera.mx = e.x;
                render.camera.my = e.y;
            });

            render.capture.on('dragend', function(e) {
                var shape = render.selectedShape;
                if(shape) {
                    render.painter.getLayer(shape.layerId)
                        .move(e.x - render.camera.mx, e.y - render.camera.my, shape)
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
