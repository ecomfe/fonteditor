/**
 * @file pan.js
 * @author mengke01
 * @date
 * @description
 * 区域查看模式
 */


define(
    function(require) {

        var mode = {

            /**
             * 拖动事件
             */
            drag: function(e) {
                if (1 == e.which) {
                    var camera = this.render.camera;
                    this.render.move(camera.mx, camera.my);
                    this.render.refresh();
                }
            },

            /**
             * 按键
             */
            keyup: function(e) {
                if(e.keyCode == 32) {
                    this.setMode('bound');
                }
            },

            /**
             * 开始模式
             */
            begin: function() {
                this.render.setCursor('pointer');
            },

            /**
             * 结束模式
             */
            end: function() {
                this.render.setCursor('default');
            }
        };

        return mode;
    }
);
