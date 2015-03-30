/**
 * @file openCV 查找轮廓
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        var smoothContour = require('./contour/smooth');

        var ICV_SINGLE = 1;
        var ICV_CONNECTING_ABOVE = 2;
        var ICV_CONNECTING_BELOW = 3;



        /**
         * 对轮廓横向坐标进行插值
         *
         * @param  {Array} contour 轮廓集合
         * @return {Array}         插值后轮廓集合
         */
        function interPolateContour(contour) {
            var newContour = [];
            for (var i = 0, l = contour.length; i < l; i++) {
                var p = contour[i];
                var next = contour[i === l - 1 ? 0 : i + 1];
                newContour.push(p);

                if (Math.abs(p.x - next.x) > 1) {

                    var j;
                    var n;
                    if (p.x < next.x) {
                        for (j = p.x + 1, n = next.x; j < n; j++) {
                            newContour.push({
                                x: j,
                                y: p.y
                            });
                        }
                    }
                    else {
                        for (j = p.x - 1, n = next.x; j > n; j--) {
                            newContour.push({
                                x: j,
                                y: p.y
                            });
                        }
                    }
                }
            }


            return newContour;
        }


        /**
         * 查找轮廓集合
         * @param  {Object} imageData 二值图像数据
         * @param  {number} minPoints     最少点数
         * @return {Array}           轮廓集合
         */
        function cvFindContours(imageData, minPoints, smooth) {

            minPoints = minPoints || 10;
            smooth = smooth || 3;

            var data = imageData.data;
            var width = imageData.width;
            var height = imageData.height;

            var extPoints = [];
            var inPoints = [];

            var i;
            var j;
            var k;
            var n;
            var row;

            var connectFlag;
            var upperLine;
            var upperTotal;
            var upperRun;

            var lowerLine;
            var lowerTotal;
            var lowerRun;
            var prevPoint;
            var tmpPrev;

            upperLine = [];
            tmpPrev = {};


            // 填充白框
            for (j = 0; j < height; j ++) {
                row = j * width;
                data[row] = 0;
                data[row + width - 1] = 0;
            }

            row = (height - 1) * width;
            for (j = 0; j < width; j++) {
                data[j] = 0;
                data[row + j] = 0;
            }

            // 查找 第一行
            for (j = 0; j < width;) {
                for( ; j < width && !data[j]; j++ ) {
                }

                if( j === width) {
                    break;
                }

                tmpPrev.next = {
                    x: j,
                    y: 0
                };

                upperLine.push(tmpPrev = tmpPrev.next);

                for (; j < width && data[j]; j++) {
                }

                tmpPrev.next = tmpPrev.link = {
                    x: j - 1,
                    y: 0
                };
                upperLine.push(tmpPrev = tmpPrev.next);
            }

            // 查找中间行
            for( i = 1; i < height; i++) {

                row = i * width;
                lowerLine = [];

                for (j = 0; j < width;) {
                    for (; j < width && !data[row + j]; j++ ) {
                    }

                    if( j === width) {
                        break;
                    }

                    tmpPrev.next = {
                        x: j,
                        y: i
                    };

                    lowerLine.push(tmpPrev = tmpPrev.next);

                    for (;j < width && data[row + j]; j++) {
                    }

                    tmpPrev.next = tmpPrev.link = {
                        x: j - 1,
                        y: i
                    };
                    lowerLine.push(tmpPrev = tmpPrev.next);
                }

                upperTotal = Math.floor(upperLine.length / 2);
                lowerTotal = Math.floor(lowerLine.length / 2);
                upperRun = upperLine[0];
                lowerRun = lowerLine[0];

                connectFlag = ICV_SINGLE;

                // 查找当前行和上一行之间的连接
                for (k = 0, n = 0; k < upperTotal && n < lowerTotal;) {

                    switch (connectFlag) {
                        case ICV_SINGLE:
                            if (upperRun.next.x < lowerRun.next.x) {
                                if (upperRun.next.x >= lowerRun.x - 1 ) {
                                    lowerRun.link = upperRun;
                                    connectFlag = ICV_CONNECTING_ABOVE;
                                    prevPoint = upperRun.next;
                                }
                                else {
                                    upperRun.next.link = upperRun;
                                }

                                k++;
                                upperRun = upperRun.next.next;
                            }
                            else {
                                if( upperRun.x <= lowerRun.next.x + 1) {
                                    lowerRun.link = upperRun;
                                    connectFlag = ICV_CONNECTING_BELOW;
                                    prevPoint = lowerRun.next;
                                }
                                else {
                                    lowerRun.link = lowerRun.next;
                                    extPoints.push(lowerRun);
                                }
                                n++;
                                lowerRun = lowerRun.next.next;
                            }
                            break;

                        case ICV_CONNECTING_ABOVE:
                            if (upperRun.x > lowerRun.next.x + 1) {
                                prevPoint.link = lowerRun.next;
                                connectFlag = ICV_SINGLE;
                                n++;
                                lowerRun = lowerRun.next.next;
                            }
                            else {

                                prevPoint.link = upperRun;
                                if( upperRun.next.x < lowerRun.next.x) {
                                    k++;
                                    prevPoint = upperRun.next;
                                    upperRun = upperRun.next.next;
                                }
                                else {
                                    connectFlag = ICV_CONNECTING_BELOW;
                                    prevPoint = lowerRun.next;
                                    n++;
                                    lowerRun = lowerRun.next.next;
                                }
                            }
                            break;

                        case ICV_CONNECTING_BELOW:
                            if( lowerRun.x > upperRun.next.x + 1) {
                                upperRun.next.link = prevPoint;
                                connectFlag = ICV_SINGLE;
                                k++;
                                upperRun = upperRun.next.next;
                            }
                            else {
                                // First point of contour
                                inPoints.push(lowerRun);
                                lowerRun.link = prevPoint;

                                if (lowerRun.next.x < upperRun.next.x) {
                                    n++;
                                    prevPoint = lowerRun.next;
                                    lowerRun = lowerRun.next.next;
                                }
                                else {
                                    connectFlag = ICV_CONNECTING_ABOVE;
                                    k++;
                                    prevPoint = upperRun.next;
                                    upperRun = upperRun.next.next;
                                }
                            }
                            break;
                    }
                }// k, n

                for (; n < lowerTotal; n++) {

                    if (connectFlag !== ICV_SINGLE) {
                        prevPoint.link = lowerRun.next;
                        connectFlag = ICV_SINGLE;
                        lowerRun = lowerRun.next.next;
                        continue;
                    }

                    lowerRun.link = lowerRun.next;

                    //First point of contour
                    extPoints.push(lowerRun);
                    lowerRun = lowerRun.next.next;
                }

                for (; k < upperTotal; k++ ) {

                    if (connectFlag !== ICV_SINGLE) {
                        upperRun.next.link = prevPoint;
                        connectFlag = ICV_SINGLE;
                        upperRun = upperRun.next.next;
                        continue;
                    }

                    upperRun.next.link = upperRun;
                    upperRun = upperRun.next.next;
                }

                upperLine = lowerLine;
            }

            upperTotal = Math.floor(upperLine.length / 2);
            upperRun = upperLine[0];

            //the last line of image
            for( k = 0; k < upperTotal; k++ ) {
                upperRun.next.link = upperRun;
                upperRun = upperRun.next.next;
            }

            var contours = [];
            var count = 0;
            var p_temp;
            var p00;
            var p01;
            var contour;
            var points;

            // 查找轮廓集合
            for ( k = 0; k < 2; k++ ) {

                points = k === 0 ? extPoints : inPoints;
                for (j = 0, n = points.length; j < n; j++, count++) {

                    p01 = p00 = points[j];

                    if (!p00.link) {
                        continue;
                    }

                    contour = [];

                    do {
                        contour.push({
                            x: p00.x,
                            y: p00.y
                        });

                        p_temp = p00;
                        p00 = p00.link;
                        p_temp.link = 0;

                    } while(p00 && p00 !== p01);

                    if (contour.length < 4) {
                        continue;
                    }

                    contour = interPolateContour(contour);

                    if (contour.length >= minPoints) {
                        if (smooth > 1 && contour.length >= 2 * smooth) {
                            contour = smoothContour(contour, smooth);
                        }
                        contour.flag = k === 0 ? 0 : 1;
                        contours.push(contour);
                    }
                }
            }

            return contours;
        }


        return cvFindContours;
    }
);
