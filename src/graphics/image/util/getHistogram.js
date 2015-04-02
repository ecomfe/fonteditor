/**
 * @file 获取灰度图像的直方图信息
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        /**
         * 获取图像的灰度分布信息
         *
         * @param  {Object} imageData 图像数据
         * @return {Array}            灰度统计信息
         */
        function getHistogram(imageData) {
            var histogram = [];
            var i = 0;
            var l = 256;
            for (; i < l; i++) {
                histogram[i] = 0;
            }

            var data = imageData.data;
            for (i = 0, l = data.length; i < l; i++) {
                histogram[data[i]]++;
            }

            return histogram;
        }

        return getHistogram;
    }
);
