/**
 * @file addCircle.js
 * @author mengke01
 * @date 
 * @description
 * 添加圆模式
 */


define(
    function(require) {
        var pathAdjust = require('graphics/pathAdjust');
        var circle = require('../shapes/circle');
        var lang = require('common/lang');

        var mode = {

            /**
             * 按下事件
             */
            down: function(e) {
                if(1 == e.which) {
                    this.circle = this.coverLayer.addShape('path', {
                        points:[]
                    });
                }
            },

            /**
             * 拖动事件
             */
            drag: function(e) {
                if(1 == e.which) {
                    if (this.circle) {
                        var x = e.startX;
                        var y = e.startY;
                        var w = e.x - e.startX;
                        var h = e.y - e.startY;
                        // 圆
                        if (e.shiftKey) {
                            var d = Math.max(Math.abs(w), Math.abs(h));
                            w = w > 0 ? d : -d;
                            h = h > 0 ? d : -d;
                        }
                        var points = lang.clone(circle.points);
                        pathAdjust(points, w / circle.xMax, h / circle.yMax);
                        pathAdjust(points, 1, 1, x , y);
                        this.circle.points = points;
                        this.coverLayer.refresh();
                    }
                }
            },

            /**
             * 鼠标弹起
             */
            dragend: function(e) {
                if(1 == e.which) {
                    if(this.circle) {
                        this.fontLayer.addShape(this.circle);
                        this.fontLayer.refresh();
                        this.setMode('shapes', [this.circle]);
                        return;
                    }
                    
                    this.setMode();
                }
            },

            /**
             * 开始模式
             */
            begin: function() {
                this.render.setCursor('crosshair');
            },

            /**
             * 结束模式
             */
            end: function() {
                this.circle = null;
                this.coverLayer.clearShapes();
                this.coverLayer.refresh();
                this.render.setCursor('default');
            }
        };

        return mode;
    }
);
