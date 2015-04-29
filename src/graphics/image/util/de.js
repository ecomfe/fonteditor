/**
 * @file 膨胀和腐蚀相关函数
 * @author mengke01(kekee000@gmail.com)
 *
 * reference:
 * http://www.cnblogs.com/chnhideyoshi/p/ErodeDilateAlgs.html
 * github: https://github.com/chnhideyoshi/SeededGrow2d
 */


define(
    function (require) {

        /**
         * 获取膨胀和腐蚀的结构矩阵
         *
         * @param  {string} mode   模式
         * @param  {number} radius 模板半径
         * @return {Array}        结构矩阵
         */
        function getOffsetArray(mode, radius) {

            var offsetArray = [];
            var i;
            var j;
            // 正方形
            if (mode === 'square') {
                for (i = 0; i < 2 * radius + 1; i++) {
                    for (j = 0; j < 2 * radius + 1; j++) {
                        offsetArray.push({
                            x: i - radius,
                            y: j - radius
                        });
                    }
                }
            }
            // 圆形
            else if (mode === 'circle') {
                for (i = 0; i < 2 * radius + 1; i++) {
                    for (j = 0; j < 2 * radius + 1; j++) {
                        var d2 = Math.pow(i - radius, 2) + Math.pow(j - radius, 2);
                        if (d2 <= radius * radius) {
                            offsetArray.push({
                                x: i - radius,
                                y: j - radius
                            });
                        }
                    }
                }
            }
            // 菱形
            else if (mode === 'rhomb') {
                for (i = -radius; i <= radius; i++) {
                    for (j = -radius; j <= radius; j++) {
                        if (Math.abs(i) + Math.abs(j) <= radius) {
                            offsetArray.push({
                                x: i,
                                y: j
                            });
                        }
                    }
                }
            }
            // 十字
            else if (mode === 'cross') {
                for (i = radius; i > 0; i--) {
                    offsetArray.push({
                        x: 0,
                        y: -i
                    });
                    offsetArray.push({
                        x: -i,
                        y: 0
                    });
                    offsetArray.push({
                        x: 0,
                        y: i
                    });
                    offsetArray.push({
                        x: i,
                        y: 0
                    });
                }
                offsetArray.push({
                    x: 0,
                    y: 0
                });
            }

            return offsetArray;
        }


        /**
         * 在结构数组内赋值
         *
         * @param  {Array} data        二值数据
         * @param  {number} width       宽度
         * @param  {number} height      高度
         * @param  {number} x           x
         * @param  {number} y           y
         * @param  {Array} offsetArray 结构数据
         * @param  {number} value       要设置的值
         * @return {boolean}
         */
        function setWindow(data, width, height, x, y, offsetArray, value) {

            for (var n = 0, l = offsetArray.length; n < l; n++) {
                var tx = x + offsetArray[n].x;
                var ty = y + offsetArray[n].y;

                if (tx < 0 || tx >= width || ty < 0 || ty >= height) {
                    continue;
                }

                data[ty * width + tx] = value;
            }

            return false;
        }


        /**
         * 是否临近指定的点
         *
         * @param  {Array} data        二值数据
         * @param  {number} width       宽度
         * @param  {number} height      高度
         * @param  {number} x           x
         * @param  {number} y           y
         * @param  {number} value       查找的值
         * @return {boolean}
         */
        function adjustTo(data, width, height, x, y, value) {

            var row = y * width;
            if (
                (x > 0 && data[x - 1 + row] === value) // 左侧
                || (y > 0 && data[x + row - width] === value) // 上侧
                || (x < width - 1 && data[x + 1 + row] === value) // 右侧
                || (y < height - 1 && data[x + row + width] === value) // 下侧

            ) {
                return true;
            }

            return false;
        }

        /**
         * 对二值图像进行膨胀操作
         *
         * @param  {Object} imageData 图像数据
         * @param  {string} operation 操作类型 `cross` or `erode`
         * @param  {string} mode    模板类型，see `getOffsetArray`
         * @param  {number} radius    半径
         * @return {Object}           膨胀后图像
         */
        function execute(imageData, operation, mode, radius) {

            mode = mode || 'cross';
            radius = Math.floor((radius || 2) / 2);

            var from = 255;
            var to = 0;

            if (operation === 'erode') {
                from = 0;
                to = 255;
            }

            var width = imageData.width;
            var height = imageData.height;
            var data = imageData.data;
            var offsetArray = getOffsetArray(mode, radius);
            var newData = data.slice(0);

            for (var y = 0, line = 0; y < height; y++) {
                line = y * width;
                for (var x = 0; x < width; x++) {
                    if (data[line + x] === from && adjustTo(data, width, height, x, y, to)) {
                        setWindow(newData, width, height, x, y, offsetArray, to);
                    }
                }
            }

            imageData.data = newData;
            return imageData;
        }

        return {
            execute: execute
        };
    }
);
