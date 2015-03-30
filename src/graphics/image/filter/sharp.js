/**
 * @file 图像锐化滤镜
 * @author mengke01(kekee000@gmail.com)
 *
 * @reference
 * https://github.com/AlloyTeam/AlloyImage
 */


define(
    function (require) {


        /**
         * 灰度图像锐化
         * @param  {Object} imgData 图像数据
         * @param  {number} lamta   锐化参数
         * @return {Object}         处理后图像
         */
        function sharp(imgData, lamta) {
            lamta = lamta || 0.6;

            var width = imageData.width;
            var height = imageData.height;
            var data = imageData.data;

            var line = 0;
            for (var y = 1; y < height; y++) {
                line = y * width;
                for (var x = 1; x < width; x++) {
                    var idx = x + line;
                    // 当前点减去 左侧三个像素点的平均值
                    var delta = data[idx] - (data[idx - 1] + data[idx - width] + data[idx - width - 1]) / 3;
                    data[idx] = delta * lamta;
                }
            }

            return imgData;

        }

        return sharp;
    }
);
