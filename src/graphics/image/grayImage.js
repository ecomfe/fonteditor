/**
 * @file 对图像进行灰度化处理
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        /**
         * 对图像进行灰度化处理
         *
         * @param  {Object} imageData 图像数据
         * @param  {boolean} reverse 是否翻转
         *
         * @return {Object}           处理后的数据
         */
        function grayImage(imageData, reverse) {

            var width = imageData.width;
            var height = imageData.height;
            var line = 0;
            var data = imageData.data;
            var newData = [];

            for (var y = 0; y < height; y++) {
                line = y * width;
                for (var x = 0; x < width; x++) {
                    var idx = (x + line) * 4;
                    var gray = 255;
                    if (data[idx + 3] < 25) {
                        gray = 255;
                    }
                    else {
                        var r = data[idx + 0];
                        var g = data[idx + 1];
                        var b = data[idx + 2];
                        gray = Math.floor(0.299 * r + 0.587 * g + 0.114 * b);
                    }
                    newData[x + line] = reverse ? 255 - gray : gray;
                }
            }

            return {
                width: width,
                height: height,
                data: newData
            };
        }

        return grayImage;
    }
);
