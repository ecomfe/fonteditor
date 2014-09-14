/**
 * @file Path.js
 * @author mengke01
 * @date 
 * @description
 * 绘制一段路径
 */


define(
    function(require) {
        var ShapeConstructor = require('./Shape');
        var isInsidePath = require('../../graphics/isInsidePath');
        var pathAdjust = require('graphics/pathAdjust');
        var drawPath = require('../util/drawPath');
        var computeBoundingBox = require('graphics/computeBoundingBox');
        var proto = {
            
            type: 'path',


            /**
             * 对形状进行缩放平移调整
             * 
             * @param {Object} shape shape对象
             * @param {Object} camera camera对象
             * @return {Object} shape对象
             */
            adjust: function(shape, camera) {
                var ratio = camera.ratio;
                var x = camera.center.x;
                var y = camera.center.y;
                pathAdjust(shape.points, ratio, ratio, -x, -y);
                pathAdjust(shape.points, 1, 1, x, y);
            },

            /**
             * 移动指定位置
             * 
             * @return {Object} shape对象
             */
            move: function(shape, mx, my) {
                pathAdjust(shape.points, 1, 1, mx, my);
                return shape;
            },


            /**
             * 获取shape的矩形区域
             * 
             * @param {Object} shape shape数据
             * @param {Object} 矩形区域
             */
            getRect: function(shape) {
                return computeBoundingBox.computePath(shape.points);
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
                var bound = computeBoundingBox.computePath(shape.points);
                if(
                    x <= bound.x + bound.width 
                    && x >= bound.x
                    && y <= bound.y + bound.height
                    && y >= bound.y
                ) {

                    return isInsidePath(shape.points, {
                        x: x, 
                        y: y
                    });
                }
                return false;
            },

            /**
             * 绘制一个shape对象
             * 
             * @param {CanvasContext} ctx canvas的context
             * @param {Object} shape shape数据
             */
            draw: function(ctx, shape) {
                drawPath(ctx, shape.points);
            }
        };



        return require('./Shape').derive(proto);
    }
);
