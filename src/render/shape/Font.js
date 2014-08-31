/**
 * @file Font.js
 * @author mengke01
 * @date 
 * @description
 * font字体绘制
 */


define(
    function(require) {

        var glyfDraw = require('../glyf/draw');

        var proto = {
            
            type: 'circle',

            /**
             * 获取shape的矩形区域
             * 
             * @param {Object} shape shape数据
             * @param {Object} 矩形区域
             */
            getRect: function(shape) {
                return {
                    x: shape.x,
                    y: shape.y,
                    width: shape.width,
                    height:shape.height,
                };
            },

            /**
             * 判断点是否在font内部，此处只检测边缘
             * 
             * @param {Object} shape shape数据
             * @param {number} x x偏移
             * @param {number} y y偏移
             * @param {boolean} 是否
             */
            isIn: function(shape, x, y) {
                return x <= shape.x + shape.width 
                    && x >= shape.x - shape.width
                    && y <= shape.y + shape.height
                    && y >= shape.y - shape.height;
            },

            /**
             * 绘制一个shape对象
             * 
             * @param {CanvasContext} ctx canvas的context
             * @param {Object} shape shape数据
             */
            draw: function(ctx, shape) {
                glyfDraw(ctx, shape);
            }
        };



        return require('./Shape').derive(proto);
    }
);
