/**
 * @file 亮度对比度计算
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {


        /**
         * 调节图像亮度对比度
         *
         * @param  {Object} imgData    图像数据
         * @param  {string} brightness 亮度 -50 ~ 50
         * @param  {number} contrast   对比度 -50 ~ 50
         * @return {Object}            调整后图像
         */
        function brightness(imgData, brightness, contrast) {

            brightness = brightness || 50;
            contrast = contrast || 0;

            var data = imgData.data;
            var b = brightness / 50; // -1 , 1
            var c = (brightness || 0) / 50; // -1 , 1
            var k = Math.tan((45 + 44 * c) * Math.PI / 180);

            for (var i = 0, l = data.length; i < l; i++) {
                data[i] = Math.floor((data[i] - 127.5 * (1 - b)) * k + 127.5 * (1 + b));
            }

            return imgData;
        }



        return brightness;
    }
);
