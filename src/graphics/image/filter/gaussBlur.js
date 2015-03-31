/**
 * @file 高斯模糊
 * @author mengke01(kekee000@gmail.com)
 *
 * http://www.ruanyifeng.com/blog/2012/11/gaussian_blur.html
 * @reference
 * https://github.com/AlloyTeam/AlloyImage
 */


define(
    function (require) {

        var filteringImage = require('../util/filteringImage');

        function getGaussMatrix(radius, sigma) {
            var gaussMatrix = [];
            var gaussSum = 0;
            var a = 1 / (2 * Math.PI * sigma * sigma);
            var b = -1 / (2 * sigma * sigma);
            var x;
            var y;
            var k;

            //生成高斯矩阵
            for (k = 0, x = -radius; x <= radius; x++) {
                for (y = -radius; y <= radius; y++) {
                    var g = a * Math.exp(b * (x * x + y * y));
                    gaussMatrix[k++] = g;
                    gaussSum += g;
                }
            }

            //归一化, 保证高斯矩阵的值在[0,1]之间
            for (k = 0, x = -radius; x <= radius; x++) {
                for (y = -radius; y <= radius; y++) {
                    gaussMatrix[k++] /= gaussSum;
                }
            }

            return gaussMatrix;
        }

        /**
         * 灰度图像高斯模糊
         *
         * @param  {Object} imageData  图像数据
         * @param  {number} radius 取样区域半径, 正数, 可选, 默认为 3
         * @param  {number} sigma 标准方差, 可选, 默认取值为 1.5
         *
         * @return {Object}
         */
        function gaussBlur(imageData, radius, sigma) {

            radius = Math.floor((radius || 3) / 2);

            var data = imageData.data;
            var width = imageData.width;
            var height = imageData.height;
            var matrix = getGaussMatrix(radius, sigma || 1.5);

            imageData.data = filteringImage(data, width, height, radius, matrix);

            return imageData;
        }


        return gaussBlur;
    }
);
