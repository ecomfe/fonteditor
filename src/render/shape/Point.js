/**
 * @file Point.js
 * @author mengke01
 * @date 
 * @description
 * 绘制控制点
 */


define(
    function(require) {
        
        var POINT_SIZE = 6; // 控制点的大小

        var proto = {
            
            type: 'point',

            /**
             * 获取shape的矩形区域
             * 
             * @param {Object} shape shape数据
             * @param {Object} 矩形区域
             */
            getRect: function(shape) {
                var size = shape.size || POINT_SIZE;
                return {
                    x: shape.x - size / 2 ,
                    y: shape.y - size / 2,
                    width: size,
                    height: size
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
                var size = shape.size || POINT_SIZE;
                var w = size;
                var h = size;
                return x <= shape.x + w
                    && x >= shape.x - w
                    && y <= shape.y + h
                    && y >= shape.y - h;
            },

            /**
             * 绘制一个shape对象
             * 
             * @param {CanvasContext} ctx canvas的context
             * @param {Object} shape shape数据
             */
            draw: function(ctx, shape) {
                
                var x = Math.round(shape.x);
                var y = Math.round(shape.y);
                var size = shape.size || POINT_SIZE;
                var w = size / 2;
                var h = size / 2;
                ctx.moveTo(x - w, y - h);
                ctx.lineTo(x + w, y - h);
                ctx.lineTo(x + w, y + h);
                ctx.lineTo(x - w, y + h);
                ctx.lineTo(x - w, y - h);
            }
        };



        return require('./Shape').derive(proto);
    }
);
