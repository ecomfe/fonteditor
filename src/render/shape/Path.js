/**
 * @file path.js
 * @author mengke01
 * @date 
 * @description
 * 绘制一段路径
 */


define(
    function(require) {
        var ShapeConstructor = require('./Shape');
        var isInsidePath = require('../../graphics/isInsidePath');
        var pathAdjust = require('../util/pathAdjust');
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
                ShapeConstructor.prototype.adjust.call(this, shape, camera);
                pathAdjust(shape.points, camera.ratio);
            },

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
             * 判断点是否在shape内部
             * 
             * @param {Object} shape shape数据
             * @param {number} x x偏移
             * @param {number} y y偏移
             * @param {boolean} 是否
             */
            isIn: function(shape, x, y) {

                if(
                    x <= shape.x + shape.width 
                    && x >= shape.x
                    && y <= shape.y + shape.height
                    && y >= shape.y
                ) {

                    return isInsidePath(shape.points, {
                        x: x - shape.x, 
                        y: y - shape.y
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
                var x = shape.x || 0;
                var y = shape.y || 0;

                ctx.translate(x, y);
                var i = -1;
                var points = shape.points;
                var l = points.length;
                var point;
                while (++i < l) {
                    point = points[i];
                    switch (point.c) {
                        case 'M':
                            ctx.moveTo(point.p.x, point.p.y);
                            break;
                        case 'L':
                            ctx.lineTo(point.p.x, point.p.y);
                            break;
                        case 'Q':
                            ctx.quadraticCurveTo(point.p1.x, point.p1.y, point.p.x, point.p.y);
                            break;
                        case 'Z':
                            //ctx.lineTo(point.p.x, point.p.y);
                            break;
                    }
                }

                // var w = shape.width;
                // var h = shape.height;
                // ctx.moveTo(0, 0);
                // ctx.lineTo(w, 0);
                // ctx.lineTo(w, h);
                // ctx.lineTo(0, h);
                // ctx.lineTo(0, 0);

                ctx.translate(-x, -y);
            }
        };



        return require('./Shape').derive(proto);
    }
);
