/**
 * @file glyf2canvas.js
 * @author mengke01
 * @date 
 * @description
 * glyf 的canvas绘制
 */


define(
    function(require) {

        var drawContour = require('./drawContour');
        var glyfAdjust = require('./glyfAdjust');

        /**
         * glyf canvas绘制
         * 
         * @param {Object} glyf glyf数据
         * @param {Context} ctx canvas的context
         * @param {Object} options 绘制参数
         */
        function glyf2canvas(glyf, ctx, options){

            if(!glyf) {
                return;
            }
            
            options = options || {};

            if(options.stroke) {
                ctx.strokeWidth = options.strokeWidth || 1;
                ctx.strokeStyle = options.strokeStyle || 'black';
            }
            else {
                ctx.fillStyle = options.fillStyle || 'black';
            }


            // 对轮廓进行反向，以及坐标系调整，取整
            glyf = glyfAdjust(glyf, options.scale, options.x, options.y);

            var contours = glyf.contours;
            
            // 处理glyf轮廓
            ctx.beginPath();
            for ( var i = 0, l = contours.length; i < l; i++) {
                drawContour(contours[i], ctx);
            }

            if(false !== options.stroke) {
                ctx.stroke();
            }

            if (false !== options.fill) {
                ctx.fill();
            }
        }


        return glyf2canvas;
    }
);
