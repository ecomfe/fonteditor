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
        function findContour(imageData, startPoint, isInContour, isClockwise) {
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
                startIndex = index + 8 + (isClockwise ? 3 : 7);
                finded = false;
                for (var i = 0; i < 7; i++) {
                    index = (startIndex + (isClockwise ? - i : i )) % 8;
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
                    return null;
                }
            }
            while (x !== startX || y !== startY);

            return contour;
        }

        /**
         * 逆时针查找轮廓边缘点
         *
         * @param  {Object}  imageData   图像数据
         * @param  {Object}  startPoint  起始点
         * @param  {boolean} isInContour 是否在轮廓内
         *
         * @return {Array}               找到的轮廓点集
         */
        function findContourAntiClockWise(imageData, startPoint, isInContour) {
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
                startIndex = index + 7 + 8;
                finded = false;
                for (var i = 0; i < 7; i++) {
                    index = (startIndex + i) % 8;
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
                    return null;
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
            var startPointArray = []; // 记录外轮廓起始节点
            var startInCurvePointArray = []; // 记录内轮廓起始节点
            var currentLineArray = []; // 记录当前点集合
            var prevLineEmpty = true; // 上一行是否空行
            var startPoint;
            var endPoint;
            var point;


            // 查找外轮廓坐标
            for (y = 0; y < height; y ++) {
                line = y * width;
                isInContour = false;
                currentLineArray = [];
                for (x = 0; x < width; x++) {
                    // 外轮廓起始点
                    if (!isInContour && data[line + x]) {
                        isInContour = true;
                        currentLineArray.push({
                            x: x,
                            y: y,
                            isInContour: true
                        });
                    }
                    else if (isInContour && !data[line + x]) {
                        isInContour = false;
                        currentLineArray.push({
                            x: x,
                            y: y,
                            isInContour: false
                        });
                    }
                }

                if (!currentLineArray.length) {
                    prevLineEmpty = true;
                }
                else {

                    // 轮廓顶部
                    if (prevLineEmpty) {
                        currentLineArray.forEach(function (p) {
                            if (p.isInContour) {
                                startPointArray.push(p);
                            }
                        })
                    }
                    else {
                        prevLine = (y - 1) * width;
                        for (var i = 0, l = currentLineArray.length - 1; i < l; i++) {
                            // 在曲线内的线段，判断上一条线全为白点，则为新contour的起始点
                            if (currentLineArray[i].isInContour) {
                                var isAllWhite = true;
                                for (var j = currentLineArray[i].x, je = currentLineArray[i + 1].x - 1; j < je; j++) {
                                    if (data[prevLine + j]) {
                                        isAllWhite = false;
                                        break;
                                    }
                                }
                                if (isAllWhite) {
                                    startPointArray.push(currentLineArray[i]);
                                }
                            }
                            else if (!currentLineArray[i].isInContour) {
                                var isAllBlack = true;
                                for (var j = currentLineArray[i].x, je = currentLineArray[i + 1].x - 1; j < je; j++) {
                                    if (!data[prevLine + j]) {
                                        isAllBlack = false;
                                        break;
                                    }
                                }
                                if (isAllBlack) {
                                    startInCurvePointArray.push(currentLineArray[i]);
                                }
                            }
                        }
                    }

                    prevLineEmpty = false;
                }
            }

            var contours = [];
            if (!startPointArray) {
                return contours;
            }
            else {
                startPointArray.forEach(function (p) {
                    var contour = findContour(imageData, p, true, true);
                    if (contour) {
                        contours.push(contour);
                    }
                });
                startInCurvePointArray.forEach(function (p) {
                    var contour = findContour(imageData, p, false, false);
                    if (contour) {
                        contours.push(contour);
                    }
                });
            }

            return contours;
        }

        return findContours;
    }
);
