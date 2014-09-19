/**
 * @file Graduation.js
 * @author mengke01
 * @date 
 * @description
 * 刻度线
 */


define(
    function(require) {

        var drawGraduation = require('../util/drawGraduation');

        var proto = {
            
            type: 'graduation',

            /**
             * 对形状进行缩放平移调整
             * 
             * @return {Object} shape对象
             */
            adjust: function(shape, camera) {
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
                return false;
            },

            /**
             * 绘制一个shape对象
             * 
             * @param {CanvasContext} ctx canvas的context
             * @param {Object} shape shape数据
             */
            draw: function(ctx, shape) {

                ctx.save();

                // 绘制刻度线
                drawGraduation(ctx, shape.config);

                ctx.restore();
                ctx.beginPath();
  
            }
        };

        return require('./Shape').derive(proto);
    }
);
