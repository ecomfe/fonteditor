/**
 * @file 拟合图像轮廓
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        var pathUtil = require('graphics/pathUtil');
        var image2Values = require('graphics/image/image2Values');
        var findContours = require('graphics/image/findContours');
        var fitContour = require('graphics/image/fitContour');


        /**
         * 拟合图像轮廓
         * @param  {Object} imgData 图像数据
         * @param  {Array} imgData.data 图像数据
         * @param  {number} imgData.width 图像宽度
         * @param  {number} imgData.height 图像高度
         *
         * @param  {Object} options 图像参数
         * @param  {boolean} options.reverse 是否反向
         * @param  {number|string} options.threshold 灰度阈值
         *
         * @return {Array|false}         轮廓
         */
        function fitImageContours(imgData, options) {
            var result;

            if (imgData.binarize) {
                result = imgData;
            }
            else {
                result = image2Values(imgData, options || {});
            }

            if (result && result.data.length > 4) {
                var contoursPoints = findContours(result);
                var contours = [];
                contoursPoints.forEach(function(points) {
                    points = pathUtil.scale(points, 10);
                    var contour = fitContour(points, 10);
                    if (contour) {
                        contours.push(pathUtil.scale(contour, 0.1));
                    }
                });

                return contours;
            }

            return false;
        }


        return fitImageContours;
    }
);
