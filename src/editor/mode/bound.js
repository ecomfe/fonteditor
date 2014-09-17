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

        var POS_CUSOR = require('./cursor');

        var mode = {

            name: 'bound',

            /**
             * 按下事件
             */
            down: function(e) {
                if (1 === e.which) {
                    var camera = this.render.camera;
                    var result = this.fontLayer.getShapeIn(e);
                    if(result) {
                        var shape = result[0];
                        if (result.length > 1) {
                            shape = selectShape(result);
                        }
                        this.setMode('shapes', [shape]);
                    }
                    // 框选模式
                    else {
                        this.setMode('range');
                    }                    
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
