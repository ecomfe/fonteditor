/**
 * @file 查找二值图像轮廓
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        // 查找的8个方向
        var DIRECTION = [
            [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1]
        ];


        /**
         * 查找轮廓边缘点
         *
         * @param  {Object}  imageData   图像数据
         * @param  {Object}  startPoint  起始点
         * @param  {boolean} isInContour 是否在轮廓内
         *
         * @return {Array}               找到的轮廓点集
         */
        function findContour(imageData, startPoint, isInContour) {
            var data = imageData.data;
            var width = imageData.width;
            var height = imageData.height;
            var index = 0; // 当前方向
            var startIndex; // 当前起始方向
            var startX = startPoint.x;
            var startY = startPoint.y;
            var x = startX;
            var y = startY;
            var dx;
            var dy;
            var contour = [startPoint];
            var finded;
            do {
                startIndex = index + 3 + 8;
                finded = false;
                for (var i = 0; i < 7; i++) {
                    index = (startIndex - i) % 8;
                    dx = x + DIRECTION[index][0];
                    dy = y + DIRECTION[index][1];
                    // 找到轮廓点
                    if (!!data[dx + dy * width] === isInContour) {
                        x = dx;
                        y = dy;
                        finded = true;
                        contour.push({
                            x: dx,
                            y: dy
                        });
                        break;
                    }
                }

                if (!finded) {
                    throw 'cant\'t find next contour point!';
                }
            }
            while (x !== startX || y !== startY);

            return contour;
        }


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
            var prevLine;
            var isInContour = false;
            var startPointArray = []; // 记录起始节点
            var point;


            // 查找外轮廓坐标
            for (y = 0; y < height; y ++) {
                line = y * width;
                isInContour = false;
                for (x = 0; x < width; x++) {
                    // 外轮廓起始点
                    if (!isInContour && data[line + x]) {
                        isInContour = true;

                        prevLine = (y - 1) * width;
                        if (
                            // 右侧和上侧无像素
                            (!data[line + x + 1] && !data[prevLine + x])
                            // 上一个点
                            || (!data[prevLine + x] && !data[prevLine + x + 1])
                        ) {
                            startPointArray.push({
                                x: x,
                                y: y
                            });
                        }
                    }
                    else if (isInContour && !data[line + x]) {
                        isInContour = false;
                    }
                }
            }

            var contours = [];
            if (!startPointArray) {
                return contours;
            }
            else {
                startPointArray.forEach(function (p) {
                    contours.push(findContour(imageData, p, true));
                });
            }

            return contours;
        }

        return findContours;
    }
);
