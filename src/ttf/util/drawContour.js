/**
 * @file drawContour.js
 * @author mengke01
 * @date
 * @description
 * 绘制contour曲线
 */


define(
    function (require) {

        /**
         * ctx绘制轮廓
         *
         * @param {CanvasRenderingContext2D} ctx canvas会话
         * @param {Array} contour 轮廓序列
         */
        function drawContour(ctx, contour) {

            var curPoint;
            var prevPoint;
            var nextPoint;

            for (var i = 0, l = contour.length; i < l; i++) {
                curPoint = contour[i];
                prevPoint = i === 0 ? contour[l - 1] : contour[i - 1];
                nextPoint =  i === l - 1 ? contour[0] : contour[i + 1];

                // 起始坐标
                if (i === 0) {
                    if (curPoint.onCurve) {
                        ctx.moveTo(curPoint.x, curPoint.y);
                    }
                    else {
                        if (prevPoint.onCurve) {
                            ctx.moveTo(prevPoint.x, prevPoint.y);
                        }
                        else {
                            ctx.moveTo((prevPoint.x + curPoint.x) / 2, (prevPoint.y + curPoint.y) / 2);
                        }
                    }
                }

                // 直线
                if (curPoint.onCurve && nextPoint.onCurve) {
                    ctx.lineTo(nextPoint.x, nextPoint.y);
                }
                else if (!curPoint.onCurve) {
                    if (nextPoint.onCurve) {
                        ctx.quadraticCurveTo(curPoint.x, curPoint.y, nextPoint.x, nextPoint.y);
                    }
                    else {
                        ctx.quadraticCurveTo(
                            curPoint.x,
                            curPoint.y,
                            (curPoint.x + nextPoint.x) / 2,
                            (curPoint.y + nextPoint.y) / 2
                        );
                    }
                }
            }
        }

        return drawContour;
    }
);
