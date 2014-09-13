/**
 * @file Font.js
 * @author mengke01
 * @date 
 * @description
 * font字体绘制
 */


define(
    function(require) {
        var ShapeConstructor = require('./Shape');
        var glyfDraw = require('../glyf/draw');
        var isInsidePath = require('../../graphics/isInsidePath');
        var pathAdjust = require('graphics/pathAdjust');
        var drawPath = require('../util/drawPath');
        var computeBoundingBox = require('graphics/computeBoundingBox');

        var proto = {
            
            type: 'font',

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
                var contours = shape.contours;
                for (var i = 0, l = contours.length; i < l; i++) {
                    pathAdjust(contours[i], ratio, ratio, -x, -x);
                    pathAdjust(contours[i], 1, 1, x, x);
                };

                return shape;

            },

            /**
             * 移动指定位置
             * 
             * @return {Object} shape对象
             */
            move: function(shape, mx, my) {
                var contours = shape.contours;
                for (var i = 0, l = contours.length; i < l; i++) {
                    pathAdjust(contours[i], 1, 1, mx, my);
                }
                return shape;
            },

            /**
             * 获取shape的矩形区域
             * 
             * @param {Object} shape shape数据
             * @param {Object} 矩形区域
             */
            getRect: function(shape) {
                return computeBoundingBox.computePath.apply(null, shape.contours);
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
                var bound = computeBoundingBox.computePath.apply(null, shape.contours);
                if(
                    x <= bound.x + bound.width 
                    && x >= bound.x
                    && y <= bound.y + bound.height
                    && y >= bound.y
                ) {
                    var contours = shape.contours;
                    for (var i = 0, l = contours.length; i < l; i++) {
                        if(isInsidePath(contours[i], {
                            x: x, 
                            y: y
                        })) {
                            return true;
                        }
                    }
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
                var contours = shape.contours;
                for (var i = 0, l = contours.length; i < l; i++) {
                    drawPath(ctx, contours[i]);
                }
            }
        };



        return ShapeConstructor.derive(proto);
    }
);
