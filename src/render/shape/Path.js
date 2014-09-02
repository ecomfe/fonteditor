/**
 * @file path.js
 * @author mengke01
 * @date 
 * @description
 * 绘制一段路径
 */


define(
    function(require) {

        var isInsidePolygon = require('../util/isInsidePolygon');

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
                x = x - shape.bound.x;
                y = y - shape.bound.y;
                if(
                    x <= shape.x + shape.width 
                    && x >= shape.x
                    && y <= shape.y + shape.height
                    && y >= shape.y
                ) {
                    var points = [];
                    shape.points.forEach(function(point) {
                        if(point.c == 'Q') {
                            points.push(point.p1);
                        }
                        points.push(point.p);
                    });
                    return isInsidePolygon(points, x, y);
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
                            ctx.lineTo(point.p.x, point.p.y);
                            break;
                    }
                }
                ctx.translate(-x, -y);
            }
        };



        return require('./Shape').derive(proto);
    }
);
