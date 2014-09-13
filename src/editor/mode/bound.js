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
                var render = this.render;
                var camera = this.render.camera;

                var result = render.getLayer('font').getShapeIn(e);
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
