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
         * 顺时针查找轮廓边缘点
         *
         * @param  {Object}  imageData   图像数据
         * @param  {Object}  startPoint  起始点
         * @param  {boolean} isInContour 是否在轮廓内
         * @param  {boolean} isClockwise 是否顺时针
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
            var iterCount = 0;
            do {
                startIndex = index + 11;
                finded = false;
                for (var i = 0; i < 7; i++) {
                    index = (startIndex - i) % 8;
                    dx = x + DIRECTION[index][0];
                    dy = y + DIRECTION[index][1];
                    // 找到轮廓点
                    if (!!data[dx + dy * width] === isInContour) {
                        data[dx + dy * width] = isInContour ? 2 : 3;
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
                    return null;
                }

                if (iterCount++ > 100000) {
                    return null;
                }
            }
            while (x !== startX || y !== startY);
            contour.splice(contour.length - 1, 1);
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
            var contours = [];
            var contour;

            // 查找外轮廓坐标
            for (y = 0; y < height; y ++) {
                line = y * width;
                isInContour = false;
                currentLineArray = [];
                for (x = 0; x < width; x++) {
                    // 查找外轮廓
                    if (!isInContour && data[line + x] === 1) {
                        isInContour = true;
                        if (!data[line + x - 1]) {
                            contour = findContour(imageData, {
                                x: x,
                                y: y
                            }, true);
                            contour && contours.push(contour);
                        }

                    }
                    // 查找内轮廓
                    else if (isInContour && !data[line + x]) {
                        isInContour = false;
                        if (data[line + x - 1] === 1) {
                            contour = findContour(imageData, {
                                x: x - 1,
                                y: y
                            }, true);
                            contour && contours.push(contour.reverse());
                        }
                    }
                }
            }

            // 这里需要过滤一些极小的轮廓
            return contours.filter(function (contour) {
                return contour.length > 10;
            });
        }

        return findContours;
    }
);
