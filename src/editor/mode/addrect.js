/**
 * @file range.js
 * @author mengke01
 * @date 
 * @description
 * 添加矩形模式
 */


define(
    function(require) {

        var mode = {

            /**
             * 按下事件
             */
            down: function(e) {
                if(1 == e.which) {
                    this.selectionBox = {
                        type: 'rect',
                        dashed: true,
                        x: e.x,
                        y: e.y,
                        style: {
                            strokeColor: 'blue'
                        }
                    };
                    this.coverLayer.addShape(this.selectionBox);
                }
            },

            /**
             * 拖动事件
             */
            drag: function(e) {
                if(1 == e.which) {
                    if (this.selectionBox) {
                        var camera = this.render.camera;
                        var width = camera.x - this.selectionBox.x;
                        var height = camera.y - this.selectionBox.y;

                        if (e.shiftKey) {
                            height = width;
                        }

                        this.selectionBox.width = width;
                        this.selectionBox.height = height;
                        this.coverLayer.refresh();
                    }
                }
            },


            /**
             * 鼠标弹起
             */
            dragend: function(e) {
                if(1 == e.which) {
                    if(this.selectionBox) {
                        var box = this.selectionBox;

                        if(box.width >= 10 || box.height >= 10) {
                            var shape = this.fontLayer.addShape('path', {
                                points: [
                                    {x: box.x, y: box.y, onCurve: true},
                                    {x: box.x + box.width, y: box.y, onCurve: true},
                                    {x: box.x + box.width, y: box.y + box.height, onCurve: true},
                                    {x: box.x, y: box.y + box.height, onCurve: true}
                                ]
                            });

                            this.fontLayer.refresh();
                            this.fire('change');
                            this.setMode('shapes', [shape]);
                            return;
                        }
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
                this.selectionBox = null;
                this.coverLayer.clearShapes();
                this.coverLayer.refresh();
                this.render.setCursor('default');
            }
        };

        return mode;
    }
);