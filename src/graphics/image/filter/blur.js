/**
 * @file 图像模糊
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {

        var filteringImage = require('../util/filteringImage');

        function getMatrix(radius) {
            var matrix = [];
            // 均值滤波
            var size = Math.pow(2 * radius + 1, 2);
            var value = 1 / size;

            for (var i = 0; i < size; i++) {
                matrix[i] = value;
            }

            return matrix;
        }

        /**
         * 灰度图像模糊
         *
         * @param  {Object} imageData  图像数据
         * @param  {number} radius 取样区域半径, 正数, 可选, 默认为 3
         *
         * @return {Object}
         */
        function blur(imageData, radius) {

            radius = Math.floor((radius || 3) / 2);

            var data = imageData.data;
            var width = imageData.width;
            var height = imageData.height;
            var matrix = getMatrix(radius);

            imageData.data = filteringImage(data, width, height, radius, matrix);
            return imageData;
        }


        return blur;
    }
);
