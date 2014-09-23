/**
 * @file bound.js
 * @author mengke01
 * @date 
 * @description
 * 轮廓模式处理事件
 */


define(
    function(require) {

        var lang = require('common/lang');
        var selectShape = require('render/util/selectShape');
        var referenceline = require('./referenceline');
        var POS_CUSOR = require('./cursor');

        var mode = {
            
            /**
             * 按下事件
             */
            down: function(e) {
                if (1 === e.which) {

                    // 是否在边界拉出参考线
                    if (e.x <= 20 || e.y <= 20) {
                        this.setMode('referenceline', referenceline.newLine, e.x, e.y);
                        return;
                    }


                    var camera = this.render.camera;

                    // 字体模式
                    var result = this.fontLayer.getShapeIn(e);
                    if(result) {
                        var shape = result[0];
                        if (result.length > 1) {
                            shape = selectShape(result);
                        }
                        this.setMode('shapes', [shape]);
                        return;
                    }

                    // 参考线模式

                    var result = this.axisLayer.getShapeIn(e);
                    if(result) {
                        var line = result[0];
                        this.setMode('referenceline', referenceline.dragLine, line, e);
                        return;
                    }

                    // 框选模式
                    this.setMode('range');
                }
            },

            /**
             * 按键
             */
            keyup: function(e) {
                if(e.keyCode == 65 && e.ctrlKey) {
                    this.setMode('shapes', this.fontLayer.shapes.slice());
                }
            },

            /**
             * 开始模式
             */
            begin: function() {
            },

            /**
             * 结束模式
             */
            end: function() {
            }
        };

        return mode;
    }
);
