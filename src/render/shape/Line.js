/**
 * @file Line.js
 * @author mengke01
 * @date 
 * @description
 * 绘制直线
 */


define(
    function(require) {
        var dashedLineTo = require('../util/dashedLineTo');

        var proto = {
            
            type: 'line',

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

                if(undefined !== shape.p0.x) {
                    shape.p0.x = ratio * (shape.p0.x - center.x) + center.x;
                }
                else {
                    shape.p0.y = ratio * (shape.p0.y - center.y) + center.y;
                }

                if(undefined !== shape.p1) {
                    shape.p1.x = ratio * (shape.p1.x - center.x) + center.x;
                    shape.p1.y = ratio * (shape.p1.y - center.y) + center.y;
                }

                return shape;
            },

            /**
             * 移动指定位置
             * 
             * @return {Object} shape对象
             */
            move: function(shape, mx, my) {

                if(undefined !== shape.p0.x) {
                    shape.p0.x += mx;
                }
                else {
                    shape.p0.y += my;
                } 
                
                if(undefined !== shape.p1) {
                    shape.p1.x += mx;
                    shape.p1.y += my;
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
                return undefined === shape.p1 
                    ? false 
                    : computeBoundingBox.computeBounding([shape.p0, shape.p1]);
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

                // 单点模式
                if(undefined === shape.p1) {
                    return  undefined !== shape.p0.x && Math.abs(shape.p0.x - x) < 4
                        || undefined !== shape.p0.y && Math.abs(shape.p0.y - y) < 4;
                }
                else {
                    var x0 = shape.p0.x;
                    var y0 = shape.p0.y;
                    var x1 = shape.p1.x;
                    var y1 = shape.p1.y;
                    return (y - y0) * (x - x1) == (y - y1) * (x - x0);
                }
            },

            /**
             * 绘制一个shape对象
             * 
             * @param {CanvasContext} ctx canvas的context
             * @param {Object} shape shape数据
             */
            draw: function(ctx, shape) {


                

                // 单点模式
                if(undefined === shape.p1) {
                    
                    if(undefined !== shape.p0.x) {
                        var x0 = Math.round(shape.p0.x);
                        ctx.moveTo(x0, 0);
                        ctx.lineTo(x0, ctx.canvas.height);
                    }
                    else {
                        var y0 = Math.round(shape.p0.y);
                        ctx.moveTo(0, y0);
                        ctx.lineTo(ctx.canvas.width, y0);
                    }

                }
                else {
                    var x0 = Math.round(shape.p0.x);
                    var y0 = Math.round(shape.p0.y);
                    var x1 = Math.round(shape.p1.x);
                    var y1 = Math.round(shape.p1.y);

                    if(shape.dashed) {
                        dashedLineTo(ctx, x0, y0, x1, y1);
                    }
                    else {
                        ctx.moveTo(x0, y0);
                        ctx.lineTo(x1, y1);
                    }
                }
                
            }
        };



        return require('./Shape').derive(proto);
    }
);
