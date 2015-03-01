/**
 * @file 查找二值图像轮廓
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {
        /**
         * 查找二值图像轮廓
         *
         * @param {Object} imageData 图像二值数据
         * @return {Array} 轮廓点集合
         */
        function findContours(imageData) {
            var data = imageData.data;
            var width = imageData.width;
            var height = imageData.height;
            var x;
            var y;
            var line;
            var isInContour = false;
            var curLineArray = [];
            var prevLineArray = []; // 记录Y轴有轮廓的起始坐标
            var startPointArray = []; // 记录起始节点
            var point;

            // 查找轮廓坐标
            for (y = 0; y < height; y ++) {
                line = y * width;
                isInContour = false;
                curLineArray = [];
                for (x = 0; x < width; x++) {
                    if (!isInContour && data[line + x]) {
                        if (!point  || (point.x !== x - 1)) {
                            isInContour = true;
                            point = {
                                x: x,
                                y: y,
                                isIn: true
                            };
                            curLineArray.push(point);
                        }
                    }
                    else if (isInContour && !data[line + x]) {
                        if (!point  || (point.x !== x - 1)) {
                            isInContour = false;
                            point = {
                                x: x,
                                y: y,
                                isIn: false
                            };
                            curLineArray.push(point);
                        }
                    }

                    prevLineArray = curLineArray;


                }

            }


            return pointArray;
        }

        return findContours;
    }
);
