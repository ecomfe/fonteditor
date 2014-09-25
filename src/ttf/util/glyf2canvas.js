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

            ctx.save();

            if(options.stroke) {
                ctx.strokeWidth = options.strokeWidth || 1;
                ctx.strokeStyle = options.strokeStyle || 'black';
            }
            else {
                ctx.fillStyle = options.fillStyle || 'black';
            }

            var height = glyf.yMax;
            ctx.translate(options.x || 0, height + (options.y || 0));
            ctx.scale(options.scale || 1, -(options.scale || 1));

            // 处理glyf轮廓
            ctx.beginPath();

            if (!glyf.compound) {

                var contours = glyf.contours;
                for ( var i = 0, l = contours.length; i < l; i++) {
                    drawContour(ctx, contours[i]);
                }
            }
            // 复合图元绘制
            else {
                var glyfs = glyf.glyfs;
                glyfs.forEach(function(g) {

                    ctx.save();
                    var transform = g.transform;
                    ctx.transform (
                        transform.a,
                        transform.b,
                        transform.c,
                        transform.d,
                        transform.e,
                        transform.f
                    );

                    var contours = g.glyf.contours;
                    for ( var i = 0, l = contours.length; i < l; i++) {
                        drawContour(ctx, contours[i]);
                    }

                    ctx.restore();
                });
            }

            if(false !== options.stroke) {
                ctx.stroke();
            }

            if (false !== options.fill) {
                ctx.fill();
            }
            ctx.restore();
        }


        return glyf2canvas;
    }
);
