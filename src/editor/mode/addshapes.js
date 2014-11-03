/**
 * @file addshapes.js
 * @author mengke01
 * @date 
 * @description
 * 添加圆模式
 */


define(
    function(require) {
        var pathAdjust = require('graphics/pathAdjust');
        var computeBoundingBox = require('graphics/computeBoundingBox');
        var lang = require('common/lang');

        var mode = {

            /**
             * 按下事件
             */
            down: function(e) {
                if(1 == e.which) {

                    // 初始化空路径
                    this.coverLayer.clearShapes();
                    for (var i = 0, l = this.curShapes.length; i < l; i++) {
                        this.coverLayer.addShape('path', {
                            points:[]
                        });
                    }

                    this.curBound = computeBoundingBox.computePath.apply(
                        null, 
                        this.curShapes
                    );
                }
            },

            /**
             * 拖动事件
             */
            drag: function(e) {
                if(1 == e.which) {
                    if (this.curShapes) {
                        var x = e.startX;
                        var y = e.startY;
                        var w = e.x - e.startX;
                        var h = e.y - e.startY;
                        var xScale = w / this.curBound.width;
                        var yScale = h / this.curBound.height;

                        // 等比缩放
                        if (e.shiftKey) {
                            var scale = Math.min(Math.abs(xScale), Math.abs(yScale));
                            xScale = xScale > 0 ? scale : -scale;
                            yScale = yScale > 0 ? scale : -scale;
                        }

                        // 初始化空路径
                        var shapes = this.curShapes;
                        var coverShapes = this.coverLayer.shapes;
                        for (var i = 0, l = shapes.length; i < l; i++) {
                            var points = lang.clone(shapes[i]);
                            pathAdjust(points, xScale, yScale);
                            pathAdjust(points, 1, 1, x , y);
                            coverShapes[i].points = points;
                        }
                        this.coverLayer.refresh();
                    }
                }
            },

            /**
             * 鼠标弹起
             */
            dragend: function(e) {
                if(1 == e.which) {

                    if(this.curShapes) {
                        var fontLayer = this.fontLayer;
                        var shapes = lang.clone(this.coverLayer.shapes);
                        for (var i = 0, l = shapes.length; i < l ; i++) {
                            fontLayer.addShape(shapes[i]);
                        }
                        fontLayer.refresh();
                        this.fire('change');
                        this.setMode('shapes', shapes);
                        return;
                    }
                    
                    this.setMode();
                }
            },

            /**
             * 开始模式
             */
            begin: function(shapes) {
                this.render.setCursor('crosshair');
                this.curShapes = shapes;
            },

            /**
             * 结束模式
             */
            end: function() {
                this.curShapes = this.curBound = null;
                this.coverLayer.clearShapes();
                this.coverLayer.refresh();
                this.render.setCursor('default');
            }
        };

        return mode;
    }
);
