/**
 * @file Glyf.js
 * @author mengke01
 * @date 
 * @description
 * 简单字形，多个path组合成一个简单字形
 */



define(
    function(require) {
        
        var ShapeConstructor = require('./Shape');
        var drawPath = require('../util/drawPath');
        var compoundGlyf = require('graphics/compoundGlyf');

        var proto = {
            
            type: 'glyf',

            /**
             * 对形状进行缩放平移调整
             * 
             * @param {Object} shape shape对象
             * @param {Object} camera camera对象
             * @return {Object} shape对象
             */
            adjust: function(shape, camera) {
                var center = camera.center;
                var ratio = camera.ratio;

                shape.x = ratio * (shape.x - center.x) + center.x;
                shape.y = ratio * (shape.y - center.y) + center.y;

                return shape;

            },

            /**
             * 移动指定位置
             * 
             * @return {Object} shape对象
             */
            move: function(shape, mx, my) {
                shape.x += mx;
                shape.y += my;

                return shape;
            },

            /**
             * 获取shape的矩形区域
             * 
             * @param {Object} shape shape数据
             * @param {Object} 矩形区域
             */
            getRect: function(shape) {
                return false;
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
                return false;
            },

            /**
             * 绘制一个shape对象
             * 
             * @param {CanvasContext} ctx canvas的context
             * @param {Object} shape shape数据
             * @param {Camera} camera camera对象
             */
            draw: function(ctx, shape, camera) {

                ctx.save();
                ctx.translate(shape.x, shape.y);
                ctx.scale(camera.scale, -camera.scale);

                var transform = shape.transform;
                ctx.transform (
                    transform.a,
                    transform.b,
                    transform.c,
                    transform.d,
                    transform.e,
                    transform.f
                );

                var contours = shape.glyf.contours;
                for (var i = 0, l = contours.length; i < l; i++) {
                    drawPath(ctx, contours[i]);
                }

                ctx.restore();
            }
        };



        return ShapeConstructor.derive(proto);
    }
);
