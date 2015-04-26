/**
 * @file otf的glyf绘制
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {


        function drawPath(ctx, contour) {
            var curPoint;
            var nextPoint;
            var nextNextPoint;
            ctx.moveTo(contour[0].x, contour[0].y);
            for (var i = 1, l = contour.length; i < l; i++) {
                curPoint = contour[i];
                if (curPoint.onCurve) {
                    ctx.lineTo(curPoint.x, curPoint.y);
                }
                // 三次bezier曲线
                else {
                    nextPoint =  contour[i + 1];
                    nextNextPoint =  i === l - 2 ? contour[0] : contour[i + 2];
                    ctx.bezierCurveTo(curPoint.x, curPoint.y, nextPoint.x, nextPoint.y, nextNextPoint.x, nextNextPoint.y);
                    i += 2;
                }
            }
        }

        /**
         * glyf canvas绘制
         *
         * @param {Object} glyf glyf数据
         * @param {CanvasRenderingContext2D} ctx canvas的context
         * @param {Object} options 绘制参数
         */
        function glyf2canvas(glyf, ctx, options) {

            if (!glyf) {
                return;
            }

            options = options || {};

            ctx.save();

            if (options.stroke) {
                ctx.strokeWidth = options.strokeWidth || 1;
                ctx.strokeStyle = options.strokeStyle || 'black';
            }
            else {
                ctx.fillStyle = options.fillStyle || 'black';
            }

            var scale = options.scale || 1;
            var i;
            var l;
            var contours;

            ctx.scale(scale, -scale);
            ctx.translate(0, -options.height);

            // 处理glyf轮廓
            ctx.beginPath();
            var contours = glyf.contours;
            for (i = 0, l = contours.length; i < l; i++) {
                drawPath(ctx, contours[i]);
            }

            if (false !== options.stroke) {
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
