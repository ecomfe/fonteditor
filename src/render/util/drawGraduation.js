/**
 * @file drawGraduation.js
 * @author mengke01
 * @date
 * @description
 * 绘制刻度信息
 */


define(
    function (require) {

        /* eslint-disable fecs-max-statements */
        /**
         * 绘制刻度信息
         *
         * @param {CanvasRenderingContext2D} ctx context对象
         * @param {Object} config 配置信息
         */
        function drawGraduation(ctx, config) {


            var x = Math.round(config.x);
            var y = Math.round(config.y);

            var width = ctx.canvas.width;
            var height = ctx.canvas.height;
            var thickness = config.graduation.thickness || 20; // 刻度线厚度
            var markHeight = config.graduation.markHeight || 3; // 刻度线高度

            ctx.beginPath();

            // 刻度线区域
            ctx.fillStyle = config.graduation.markBackgroundColor || '#EEE';
            ctx.fillRect(0, 0, width, thickness);
            ctx.fillRect(0, 0, thickness, height);
            ctx.fill();

            ctx.strokeStyle = config.graduation.markColor || '#000';
            ctx.moveTo(thickness, 0);
            ctx.lineTo(thickness, height);

            ctx.moveTo(0, thickness);
            ctx.lineTo(width, thickness);
            ctx.stroke();



            var originGap = config.graduation.gap;
            var scale;
            var gap;
            var markSize;
            var axis;
            var i;

            if (originGap >= config.gap) {
                scale = originGap / config.gap;
                gap = Math.floor(scale) * originGap / 20; // 每个格子大小
                markSize = originGap / 20 * Math.floor(scale) /  scale;
            }
            else {

                scale = config.gap / originGap;
                gap = Math.floor(originGap / 20 / scale); // 每个格子大小, 5的倍数

                if (gap >= 2) {
                    gap = Math.floor(gap / 2) * 2;
                }
                else {
                    gap = 1;
                }

                markSize = gap * scale;
            }

            ctx.fillStyle = ctx.strokeStyle;

            // 横轴线
            for (axis = x, i = 0; axis < width; i++, axis += markSize) {
                ctx.moveTo(axis, thickness - (i % 5 ? markHeight : 2 * markHeight));
                ctx.lineTo(axis, thickness);
            }

            for (axis = x, i = 0; axis > thickness; i++, axis -= markSize) {
                ctx.moveTo(axis, thickness - (i % 5 ? markHeight : 2 * markHeight));
                ctx.lineTo(axis, thickness);
            }

            // 纵轴线
            var textOffset = 0; // 文本偏移
            for (axis = y, i = 0; axis > thickness; i++, axis -= markSize) {
                ctx.moveTo(thickness - (i % 5 ? markHeight : 2 * markHeight), axis);
                ctx.lineTo(thickness, axis);
            }

            for (axis = y, i = 0; axis < height; i++, axis += markSize) {
                ctx.moveTo(thickness - (i % 5 ? markHeight : 2 * markHeight), axis);
                ctx.lineTo(thickness, axis);
            }

            // 绘制轴线文字，这里由于canvas不支持小字体，因此进行缩放后绘制
            ctx.save();

            ctx.fillStyle = config.graduation.color || '#000';
            ctx.scale(0.8, 0.8);
            textOffset = thickness - 8; // 文本偏移

            for (axis = x, i = 0; axis < width; i++, axis += markSize) {
                if (0 === i % 10) {
                    ctx.fillText(Math.ceil(gap * i), axis * 1.25 - 3, textOffset * 1.25);
                }
            }

            for (axis = x, i = 0; axis > thickness; i++, axis -= markSize) {
                if (0 === i % 10) {
                    ctx.fillText(Math.ceil(-gap * i), axis * 1.25 - 3, textOffset * 1.25);
                }
            }

            // 纵轴线
            textOffset = 0; // 文本偏移
            for (axis = y, i = 0; axis > thickness; i++, axis -= markSize) {
                if (0 === i % 10) {
                    ctx.fillText(Math.ceil(gap * i), textOffset * 1.25, axis * 1.25 + 3);
                }
            }

            for (axis = y, i = 0; axis < height; i++, axis += markSize) {
                if (0 === i % 10) {
                    ctx.fillText(Math.ceil(-gap * i), textOffset * 1.25, axis * 1.25 + 3);
                }
            }

            ctx.restore();
            ctx.stroke();
        }
        /* eslint-enable fecs-max-statements */


        return drawGraduation;
    }
);
