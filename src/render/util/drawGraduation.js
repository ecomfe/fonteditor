/**
 * @file drawGraduation.js
 * @author mengke01
 * @date 
 * @description
 * 绘制刻度信息
 */


define(
    function(require) {

        /**
         * 绘制刻度信息
         * 
         * @param {Canvas2DContext} ctx context对象
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
            ctx.fillRect(0, 0, thickness, width);
            ctx.fill();

            ctx.strokeStyle = config.graduation.markColor || '#000';
            ctx.moveTo(thickness, 0);
            ctx.lineTo(thickness, height);

            ctx.moveTo(0, thickness);
            ctx.lineTo(width, thickness);
            ctx.stroke();



            var originGap = config.graduation.gap;

            if (originGap >= config.gap) {
                var scale = originGap / config.gap;
                var gap = Math.floor(scale) * originGap / 20; // 每个格子大小
                var markSize = originGap / 20 * Math.floor(scale) /  scale;
            }
            else {

                var scale = config.gap / originGap;
                var gap = Math.floor(originGap / 20 / scale); // 每个格子大小, 5的倍数
                
                if (gap >= 2) {
                    gap = Math.floor(gap / 2) * 2;
                }
                else {
                    gap = 1;
                }

                var markSize = gap * scale;
            }

            ctx.fillStyle = ctx.strokeStyle;


            // 横轴线
            for(var axis = x, i = 0; axis < width; i++, axis += markSize) {
                ctx.moveTo(axis, thickness - (i % 5 ? markHeight : 2 * markHeight));
                ctx.lineTo(axis, thickness);
            }

            for(var axis = x, i = 0; axis > thickness; i++, axis -= markSize) {
                ctx.moveTo(axis, thickness - (i % 5 ? markHeight : 2 * markHeight));
                ctx.lineTo(axis, thickness);
            }


            // 纵轴线
            var textOffset = 0; // 文本偏移
            for(var axis = y, i = 0; axis > thickness; i++, axis -= markSize) {
                ctx.moveTo(thickness - (i % 5 ? markHeight : 2 * markHeight), axis);
                ctx.lineTo(thickness, axis);
            }         

            for(var axis = y, i = 0; axis < height; i++, axis += markSize) {
                ctx.moveTo(thickness - (i % 5 ? markHeight : 2 * markHeight), axis);
                ctx.lineTo(thickness, axis);
            }

            // 绘制轴线文字，这里由于canvas不支持小字体，因此进行缩放后绘制
            ctx.save();
            ctx.scale(0.8, 0.8);
            var textOffset = thickness - 8; // 文本偏移
            for(var axis = x, i = 0; axis < width; i++, axis += markSize) {
                if (0 == i % 10) {
                    ctx.fillText( gap * i, axis * 1.25 - 3, textOffset * 1.25);
                }
            }

            for(var axis = x, i = 0; axis > thickness; i++, axis -= markSize) {
                if (0 == i % 10) {
                    ctx.fillText( -gap * i, axis * 1.25 - 3, textOffset * 1.25);
                }
            }


            // 纵轴线
            var textOffset = 0; // 文本偏移
            for(var axis = y, i = 0; axis > thickness; i++, axis -= markSize) {
                if (0 == i % 10) {
                    ctx.fillText(gap * i, textOffset * 1.25, axis * 1.25 + 3);
                }
            }         

            for(var axis = y, i = 0; axis < height; i++, axis += markSize) {
                if (0 == i % 10) {
                    ctx.fillText( -gap * i, textOffset * 1.25, axis * 1.25 + 3);
                }
            }

            ctx.restore();

            ctx.stroke();
        }

        return drawGraduation;
    }
);
