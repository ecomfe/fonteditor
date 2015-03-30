/**
 * @file 对图像进行预处理
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {


        var grayImage = require('./filter/gray');
        var binarizeImage = require('./filter/binarize');

        var gaussBlur = require('./filter/gaussBlur');
        var brightness = require('./filter/brightness');
        var sharp = require('./filter/sharp');


        /**
         * 对图像进行二值化
         *
         * @param {Object} imageData 原始图像数据，rgba序列
         * @param {Array} imageData.data 数据数组
         * @param {number} imageData.width 宽度
         * @param {number} imageData.height 高度
         *
         * @param {number} reverse 是否反转图像， 0~255
         */
        function procImage(imageData, options) {
            options = options || {};

            imageData = grayImage(imageData, options.reverse);
            //imageData = gaussBlur(imageData, 10);

            //imageData = sharp(imageData);
            return imageData;
        }

        return procImage;
    }
);
