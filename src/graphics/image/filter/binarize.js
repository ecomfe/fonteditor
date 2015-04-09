/**
 * @file 对图像进行二值化
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {

        /**
         * 二值化图像数据
         *
         * @param  {Object} imageData 图像数据
         * @param  {number} threshold 阈值
         * @return {Array}           二值化后的数据
         */
        function binarize(imageData, threshold) {

            threshold = threshold || 200;
            var width = imageData.width;
            var height = imageData.height;
            var data = imageData.data;

            for (var y = 0, row = 0; y < height; y++) {
                row = y * width;
                for (var x = 0; x < width; x++) {
                    data[row + x] = data[row + x] < threshold ? 0 : 255;
                }
            }

            imageData.binarize = true;

            return imageData;
        }

        return binarize;
    }
);
