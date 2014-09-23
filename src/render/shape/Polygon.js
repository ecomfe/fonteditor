/**
 * @file Rect.js
 * @author mengke01
 * @date 
 * @description
 * 绘制多边形
 */


define(
    function(require) {

        var dashedLineTo = require('../util/dashedLineTo');
        var pathAdjust = require('graphics/pathAdjust');
        var computeBoundingBox = require('graphics/computeBoundingBox');
        var isInsidePolygon = require('graphics/isInsidePolygon');

        var proto = {
            
            type: 'polygon',

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
                return computeBoundingBox.computeBounding(shape.points);
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
                var bound = computeBoundingBox.computeBounding(shape.points);
                if(
                    x <= bound.x + bound.width 
                    && x >= bound.x
                    && y <= bound.y + bound.height
                    && y >= bound.y
                ) {

                    return isInsidePolygon(shape.points, {
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

                var points = shape.points;
                var i = 0, l = points.length;
                if(shape.dashed) {
                    for (; i < l - 1; i++) {
                        dashedLineTo(ctx, 
                            Math.round(points[i].x), Math.round(points[i].y), 
                            Math.round(points[i+1].x), Math.round(points[i+1].y)
                        );
                    }
                    dashedLineTo(ctx, 
                        Math.round(points[l-1].x), Math.round(points[l-1].y), 
                        Math.round(points[0].x), Math.round(points[0].y)
                    );
                }
                else {

                    ctx.moveTo(Math.round(points[0].x), Math.round(points[0].y)); 
                    for (i = 1; i < l; i++) {
                        ctx.lineTo( 
                            Math.round(points[i].x), Math.round(points[i].y)
                        );
                    }
                    ctx.lineTo(
                        Math.round(points[0].x), Math.round(points[0].y)
                    );
                }
                
            }
        };



        return require('./Shape').derive(proto);
    }
);
