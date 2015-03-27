/**
 * @file 对图像进行二值化
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        var grayImage = require('./grayImage');
        var imageFilter = require('./imageFilter');
        var binarizeImage = require('./binarizeImage');

        /**
         * 对图像进行二值化
         *
         * @param {Object} imageData 原始图像数据，rgba序列
         * @param {Array} imageData.data 数据数组
         * @param {number} imageData.width 宽度
         * @param {number} imageData.height 高度
         *
         * @param {number} threshold 截止阈值， 0~255
         */
        function image2values(imageData, options) {
            options = options || {};
            imageData = grayImage(imageData, options.reverse);
            //imageData = imageFilter(imageData);
            return binarizeImage(imageData, options.threshold);
        }

        return image2values;
    }
);
