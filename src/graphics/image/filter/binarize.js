/**
 * @file 对图像进行二值化
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {


        var thresholdTypes = require('./threshold');


        /**
         * 获取图像的灰度统计信息
         *
         * @param  {Object} imageData 图像数据
         * @return {Array}            灰度统计信息
         */
        function getHistGram(imageData) {
            var histGram = [];
            var i = 0;
            var l = 256;
            for (; i < l; i++) {
                histGram[i] = 0;
            }

            var data = imageData.data;
            for (i = 0, l = data.length; i < l; i++) {
                histGram[data[i]]++;
            }

            return histGram;
        }

        /**
         * 二值化图像数据
         * @param  {Object} imageData 图像数据
         * @return {Array}           二值化后的数据
         */
        function binarizeImage(imageData, thresholdType) {

            var threshold = 200;
            var width = imageData.width;
            var height = imageData.height;
            var data = imageData.data;
            var line;
            var offset;

            if (typeof thresholdType === 'number') {
                threshold = thresholdType;
            }
            else {
                var thrFunction = thresholdTypes[thresholdType] || thresholdTypes.mean;
                var histGram = getHistGram(imageData);
                threshold = thrFunction(histGram);
            }

            for (var y = 0; y < height; y++) {
                line = y * width;
                for (var x = 0; x < width; x++) {
                    data[line + x] = data[line + x] < threshold ? 1 : 0;
                }
            }

            imageData.binarize = true;
            return imageData;
        }


        return binarizeImage;
    }
);
