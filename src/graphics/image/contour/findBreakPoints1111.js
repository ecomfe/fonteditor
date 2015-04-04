/**
 * @file 查找轮廓中的关键点
 * @author mengke01(kekee000@gmail.com)
 *
 * 查找方法为此处文章的方法
 * http://wenku.baidu.com/link?url=Sz1BbYjfA7IeHAMVJ1TPlXiMhACc6sWhHliPJqAUxxtC5K9PYf4j3ile6patUEUMOE_9uJdsS1EGJBFLVbhXcn7Qe8l_FxuT3QVI8nm1aZG
 *
 * 关键点标记定义：
 *
 * p.left 左侧类型
 * p.right: 右侧类型
 * 直线为1，
 * 曲线为2
 */


define(
    function (require) {

        var makeLink = require('graphics/pathUtil').makeLink;
        var vector = require('graphics/vector');
        var markVisited = require('./markVisited');

        var findStraightLinePoints = require('./findStraightLinePoints');
        var findCornerPoints = require('./findCornerPoints');



        /**
         * 查找和标记直线点
         *
         * @param  {Array} contour     轮廓
         * @param  {Array} breakPoints 关键点
         * @param  {number} r           查找范围
         * @return {Array}             关键点
         */
        function findLinePoints(contour, breakPoints, r, scale) {

            // 根据角点判断是否直线点
            var contourSize = contour.length;
            for (var i = 0, l = breakPoints.length; i < l; i++) {
                var isLast = i === l - 1;
                var start = breakPoints[i];
                var end = isLast ? breakPoints[0] : breakPoints[i + 1];

                var j = 1;
                var cur = start.next;
                var lineFlag = true;
                var maxDist = 0;

                while (cur !== end) {

                    if (0 === j++  % r) {
                        var dist = getDist(start, end, cur) / scale;

                        if (dist > 2) {
                            lineFlag = false;
                            break;
                        }
                        else if (dist > maxDist) {
                            maxDist = dist;
                        }
                    }
                    cur = cur.next;
                }

                if (j > r && lineFlag) {
                    if (maxDist <= 1 || j > 40) {
                        start.right = 1;
                    }
                }
            }

            return breakPoints;
        }


        /* 查找轮廓中的关键点
         *
         * @param  {Array} contour 轮廓点集合
         * @return {Array}         轮廓点集合
         */
        function getBreakPoints(contour, scale) {

            scale = scale || 1;
            var contourSize = contour.length;

            // 如果小于指定的点数，返回中间点
            if (contourSize < 36) {
                return [
                    contour[0],
                    contour[Math.floor(contourSize / 2)]
                ]
            }

            contour = makeLink(contour);

            var p;
            var next;
            var range;
            var isLast;
            var linePoints = findStraightLinePoints(contour, scale);
            var breakPoints = [];

            if (linePoints.length >= 2) {
                for (var i = 0, l = linePoints.length; i < l; i++) {
                    p = linePoints[i];

                    if (p.right) {
                        continue;
                    }

                    isLast = i === l - 1;
                    next = linePoints[isLast ? 0 : i + 1];
                    range = isLast ? contourSize - p.index + next.index : next.index - p.index;

                    if (range > 50) {
                        var points = findCornerPoints(contour, p.next, next.prev, scale);
                        breakPoints = breakPoints.concat(points);
                    }
                }
            }
            else {
                breakPoints = findCornerPoints(contour, contour[0], contour[contourSize - 1], scale);
            }

            breakPoints = breakPoints.concat(linePoints);

            // 没有找到拐点，说明拐点不明显，或者为连续曲线，这里采用4等分
            if (breakPoints.length < 2) {

                if (contourSize < 100) {
                    var step = Math.floor(contourSize / 2) + 1;
                }
                else {
                    var step = Math.floor(contourSize / 4) + 1;
                }

                var startIndex = breakPoints[0] ? breakPoints[0].index : 0;
                for (var i = step; i < contourSize; i += step) {
                    breakPoints.push(contour[(startIndex + i) % contourSize]);
                }
            }


            return breakPoints.sort(function (a, b) {
                return a.index - b.index;
            });
        }

        return getBreakPoints;
    }
);
