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


        var getCos = vector.getCos;
        var getDist = vector.getDist;

        var THETA_TANGENCY = 0.1; // 相切抑制
        var THETA_CORNER = 0.5; // 拐点抑制
        var THETA_MARK_COUNT = 0.8; // 标记点个数抑制
        var THETA_INFLEXION_RANGE = 0.05; // 切线点之间的距离抑制


        function isSegmentLine(contour, start, end, isLast, scale) {
            var contourSize = contour.length;
            var mid;
            var thetaDistance = scale; // 判断直线点距离

            // 随机选取 几个点进行直线判断
            var startIndex = start.index;
            var endIndex = end.index;

            if (isLast) {
                startIndex = start.index;
                endIndex = contourSize + end.index;
            }

            mid = contour[Math.floor(startIndex / 2 + endIndex / 2) % contourSize];

            if (getDist(start, end, mid) > thetaDistance) {
                return false;
            }

            // 距离比较长的话可以适当放大
            if (endIndex - startIndex > 40) {
                thetaDistance = 2 * scale;
            }

            var step = Math.floor(Math.max((endIndex - startIndex) / 10, 4));
            var lineFlag = true;

            for (var j = startIndex + step; j < endIndex; j += step) {
                var dist = getDist(start, end, contour[j % contourSize]);
                if (dist > thetaDistance) {
                    lineFlag = false;
                    break;
                }
            }

            return lineFlag;
        }


        /**
         * 计算当前点的theta值
         *
         * @param  {Object} cur   当前点
         * @param  {Object} leftR  左侧平均
         * @param  {Object} rightR 右侧平均
         * @return {number}       theta值
         */
        function computeTheta(p, leftR, rightR) {
            var leftX = 0;
            var leftY = 0;
            var t = 0;
            var cur = p;
            while (t++ < leftR) {
                cur = cur.prev;
                leftX += cur.x;
                leftY += cur.y;
            }
            leftX = leftX / leftR;
            leftY = leftY / leftR;

            // 右侧分量
            var rightX = 0;
            var rightY = 0;
            t = 0;
            cur = p;
            while (t++ < rightR) {
                cur = cur.next;
                rightX += cur.x;
                rightY += cur.y;
            }
            rightX = rightX / rightR;
            rightY = rightY / rightR;

            leftX =  p.x - leftX;
            leftY = p.y - leftY;
            rightX = rightX - p.x;
            rightY = rightY - p.y;
            var theta = Math.acos(getCos(leftX, leftY, rightX, rightY));
            var m = leftX * rightY - rightX * leftY;
            if (m > 0) {
                return theta;
            }
            else if (m < 0) {
                return -theta;
            }

            return 0;
        }


        /**
         * 查找和标记直线点
         *
         * @param  {Array} contour     轮廓
         * @param  {Array} breakPoints 关键点
         * @param  {number} r           查找范围
         * @return {Array}             关键点
         */
        function findLinePoints(contour, breakPoints, r, scale) {

            // 根据角点查找竖直和水平线
            var linePoints = [];

            var contourSize = contour.length;
            for (var i = 0, l = breakPoints.length; i < l; i++) {
                var isLast = i === l - 1;
                var p = breakPoints[i];
                var next = isLast ? breakPoints[0] : breakPoints[i + 1];

                var range = isLast ? contourSize - p.index + next.index : next.index - p.index;

                if (range < r) {
                    p.right = 1;
                    next.left = 1;
                }
                else if(isSegmentLine(contour, p, next, isLast, scale)){
                    p.right = 1;
                    next.left = 1;
                }
            }

            return breakPoints;
        }

        /**
         * 查找和标记拐点
         *
         * @param  {Array} contour     轮廓
         * @param  {Array} breakPoints 关键点
         * @param  {number} r           查找范围
         * @return {Array}             关键点
         */
        function findBreakPoints(contour, breakPoints, r) {

            var j;
            var left;
            var right;
            var max;
            contour.forEach(function (p) {
                if (p.mark && !p.visited) {
                    j = 0;
                    left = p;
                    right = p;

                    max = p.absTheta;
                    while (j++ < r) {
                        left = left.prev;
                        right = right.next;

                        if (left.absTheta > max) {
                            max = left.absTheta;
                        }

                        if (right.absTheta > max) {
                            max = right.absTheta;
                        }
                    }

                    if (max === p.absTheta) {
                        p.breakPoint = true;
                        breakPoints.push(p);
                        markVisited(p, r);
                    }
                }
            });

            return breakPoints;
        }

        /**
         * 查找轮廓中的关键点
         *
         * @param  {Array} contour 轮廓点集合
         * @return {Array}         轮廓点集合
         */
        function getBreakPoints(contour, scale) {

            scale = scale || 1;
            contour = makeLink(contour);

            var r = contour.length > 16 ? 10 : 4;
            var j = 0;

            var contourSize = contour.length;

            for (var i = 0, l = contourSize; i < l; i++) {
                var p = contour[i];
                p.theta = computeTheta(p, r, r);
                p.absTheta = Math.abs(p.theta);

                if (p.absTheta > THETA_CORNER) {
                    p.mark = true;
                }
                else if (p.absTheta > THETA_TANGENCY) {
                    p.markTangency = true;
                }
            }

            // 非极大抑制查找角点
            var breakPoints = [];
            breakPoints = findBreakPoints(contour, breakPoints, r);

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

            breakPoints.sort(function (a, b) {
                return a.index - b.index;
            });

            // 查找直线点
            breakPoints = findLinePoints(contour, breakPoints, r, scale);

            breakPoints.sort(function (a, b) {
                return a.index - b.index;
            });

            return breakPoints;
        }

        return getBreakPoints;
    }
);
