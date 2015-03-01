/**
 * @file 对图像进行二值化
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {
        /**
         * 对图像进行二值化
         *
         * @param {Object} imageData 原始图像数据，rgba序列
         * @param {Array} imageData.data 数据数组
         * @param {number} imageData.width 宽度
         * @param {number} imageData.height 高度
         *
         * @param {number} threshold 截止阈值， 0~255
         * @param {number} thresholdAlpha 截止alpha通道值0~255
         */
        function image2values(imageData, threshold, thresholdAlpha) {

            threshold = threshold == null ? 200 : threshold;
            thresholdAlpha = thresholdAlpha == null ? 50 : thresholdAlpha;

            var width = imageData.width;
            var height = imageData.height;
            var data = imageData.data;
            var line;
            var offset;
            var newData = [];

            for (var y = 0; y < height; y ++) {
                line = y * width;
                for (var x = 0; x < width; x++) {

                    offset = (line + x) * 4;
                    if (data[offset + 3] < thresholdAlpha) {
                        newData[line + x] = 0;
                    }
                    else {
                        if (
                            ((data[offset + 2] * 29 + data[offset + 1] * 150 + data[offset] * 77 + 128) >> 8)
                            < threshold
                        ){
                            newData[line + x] = 1;
                        }
                        else {
                            newData[line + x] = 0;
                        }
                    }
                }
            }

            return {
                width: width,
                height: height,
                data: newData
            };
        }

        return image2values;
    }
);
