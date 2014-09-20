/**
 * @file referenceline.js
 * @author mengke01
 * @date 
 * @description
 * 参考线操作模式
 */


define(
    function(require) {

        var lang = require('common/lang');

        var mode = {

            /**
             * 按下事件
             */
            down: function(e) {
                if(1 == e.which) {
                }
            },

            /**
             * 拖动事件
             */
            drag: function(e) {
                if(1 == e.which) {
                    if (this.currentLine) {
                        var camera = this.render.camera;
                        var line = this.currentLine;
                        if (undefined !== line.p0.x) {
                            line.p0.x += camera.mx;
                        }
                        else {
                            line.p0.y += camera.my;
                        }
                        this.axisLayer.refresh();
                    }
                }
            },


            /**
             * 鼠标弹起
             */
            up: function(e) {
                if(1 == e.which) {
                    if(this.currentLine) {
                        var line = this.currentLine;

                        // 如果右支撑被移除去了
                        if(line === this.rightSideBearing && line.p0.x < 20) {
                            line.p0.x = this.p0.x;
                            this.axisLayer.refresh();
                        }
                        // 拖出刻度线，代表删除
                        else if (
                            (undefined !== line.p0.x && line.p0.x < 20)
                            || (undefined !== line.p0.y && line.p0.y < 20)

                        ) {
                            this.execCommand('removereferenceline', line);
                        }
                    }
                    this.setMode();
                }
            },

            /**
             * 开始模式
             */
            begin: function(line) {
                if(undefined !== line.p0.x) {
                    this.render.setCursor('e-resize');
                }
                else {
                    this.render.setCursor('n-resize');
                }

                this.currentLine = line;
                this.p0 = lang.clone(line.p0);
            },

            /**
             * 结束模式
             */
            end: function() {
                this.currentLine = this.p0 = null;
                this.render.setCursor('default');
            }
        };

        return mode;
    }
);
