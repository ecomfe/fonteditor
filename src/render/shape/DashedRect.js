/**
 * @file DashedRect.js
 * @author mengke01
 * @date 
 * @description
 * 绘制虚线矩形
 */


define(
    function(require) {

        var dashedLineTo = require('../util/dashedLineTo');

        var proto = {
            
            type: 'dashedrect',

            /**
             * 获取shape的矩形区域
             * 
             * @param {Object} shape shape数据
             * @param {Object} 矩形区域
             */
            getRect: function(shape) {
                return shape;
            },

            /**
             * 判断点是否在shape内部
             * 
             * @param {Object} shape shape数据
             * @param {number} x x偏移
             * @param {number} y y偏移
             * @param {boolean} 是否
             */
            isIn: function(shape, x, y) {
                var w = shape.width;
                var h = shape.height;
                return x <= shape.x + w
                    && x >= shape.x
                    && y <= shape.y + h
                    && y >= shape.y;
            },

            /**
             * 绘制一个shape对象
             * 
             * @param {CanvasContext} ctx canvas的context
             * @param {Object} shape shape数据
             */
            draw: function(ctx, shape) {
                var w = shape.width;
                var h = shape.height;
                dashedLineTo(ctx, shape.x, shape.y, shape.x + w, shape.y);
                dashedLineTo(ctx, shape.x + w, shape.y, shape.x + w, shape.y + h);
                dashedLineTo(ctx, shape.x + w, shape.y + h, shape.x, shape.y + h);
                dashedLineTo(ctx, shape.x, shape.y + h, shape.x, shape.y);
            }
        };



        return require('./Shape').derive(proto);
    }
);
