/**
 * @file 二值图像滤波
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {



        /**
         * 中值滤波
         * @param  {Array} filterData 过滤数据
         * @return {number}            过滤后数据
         */
        function middleFilter(filterData, mid) {
            return filterData.sort(function (a, b) {
                return b - a;
            })[mid];
        }


        function imageFilter(imageData, options) {
            options = options || {
                filter: 'middle',
                range: 3
            };

            var filter = middleFilter;
            var range;
            var mid;
            if (options.range <=3) {
                range = 1;
                mid = 4;
            }
            else {
                range = Math.floor(options.range / 2);
                mid = Math.floor(Math.pow(range * 2 + 1, 2) / 2);
            }

            var width = imageData.width;
            var height = imageData.height;
            var line = 0;
            var data = imageData.data;
            var newData = [];
            var startX;
            var startY;

            for (var y = 0; y < height; y++) {
                line = y * width;
                for (var x = 0; x < width; x++) {

                    startX = x;
                    startY = y;
                    if (x - range < 0) {
                        startX = range;
                    }
                    else if (x + range >= width) {
                        startX  = width - 1 - range;
                    }

                    if (y - range < 0) {
                        startY = range;
                    }
                    else if (y + range >= height) {
                        startY  = height - 1 - range;
                    }

                    var filterData = [];
                    var k = 0;
                    var rangeLine = startY * width;
                    for (var i = -range; i <= range; i++) {
                        for (var j = -range; j <= range; j++) {
                            if (i || j) {
                                filterData[k++] = data[rangeLine + i * width + startX + j];
                            }
                        }
                    }

                    data[line + x] = filter(filterData, mid);
                }
            }

            return imageData;
        }


        return imageFilter;
    }
);
