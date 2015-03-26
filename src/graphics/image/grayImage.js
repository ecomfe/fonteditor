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
         * @return {Object}           处理后的数据
         */
        function grayImage(imageData) {

            var width = imageData.width;
            var height = imageData.height;
            var line = 0;
            var data = imageData.data;
            var newData = [];

            for (var y = 0; y < height; y++) {
                line = y * width;
                for (var x = 0; x < width; x++) {
                    var idx = (x + line) * 4;
                    if (data[idx + 3] < 10) {
                        newData[x + line] = 255;
                    }
                    else {
                        var r = data[idx + 0];
                        var g = data[idx + 1];
                        var b = data[idx + 2];
                        newData[x + line] = Math.floor(0.299 * r + 0.587 * g + 0.114 * b);
                    }
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
