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
        var getCos = require('graphics/vector').getCos;
        var getDist = require('graphics/vector').getDist;

        var THETA_TANGENCY = 0.1; // 相切抑制
        var THETA_CORNER = 0.5; // 拐点抑制
        var THETA_MARK_COUNT = 0.8; // 标记点个数抑制
        var THETA_INFLEXION_RANGE = 0.05; // 切线点之间的距离抑制


        function isSegmentLine(contour, start, end, isLast) {
            var contourSize = contour.length;
            var mid;
            var thetaDistance = 10; // 判断直线点距离

            // 判断中间点距离
            if (isLast) {
                mid = contour[Math.floor(start.index + (contourSize - start.index + end.index) / 2) % contourSize];
            }
            else {
                mid = contour[Math.floor((start.index + end.index) / 2)];
            }

            if (getDist(start, end, mid) > thetaDistance) {
                return false;
            }

            // 随机选取 几个点进行直线判断
            var startIndex = start.index;
            var endIndex = end.index;
            if (isLast) {
                startIndex = start.index;
                endIndex = contourSize + end.index;
            }

            // 距离比较长的话可以适当放大
            if (endIndex - startIndex > 100) {
                thetaDistance = 20;
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
         * 标记点的左右已经被访问过了
         *
         * @param  {Object} p 点
         * @param  {number} rl 左半径
         * @param  {number} rr 右半径
         */
        function markVisited(p, rl, rr) {
            var j;
            var left = p;
            var right = p;
            p.visited = true;

            if (!rr || rr === rl) {
                j = 0;
                while (j++ < rl) {
                    left = left.prev;
                    right = right.next;
                    left.visited = right.visited = true;
                }
            }
            else {

                j = 0;
                while (j++ < rl) {
                    left = left.prev;
                    left.visited = true;
                }

                j = 0;
                while (j++ < rr) {
                    right = right.next;
                    right.visited = true;
                }
            }
        }

        /**
         * 查找和标记直线点
         *
         * @param  {Array} contour     轮廓
         * @param  {Array} breakPoints 关键点
         * @param  {number} r           查找范围
         * @return {Array}             关键点
         */
        function findLinePoints(contour, breakPoints, r) {

            // 根据角点查找竖直和水平线
            var linePoints = [];

            var contourSize = contour.length;
            for (var i = 0, l = breakPoints.length; i < l; i++) {
                var isLast = i === l - 1;
                var p = breakPoints[i];
                var next = isLast ? breakPoints[0] : breakPoints[i + 1];

                if (p.right === 1) {
                    continue;
                }

                var range = isLast ? contourSize - p.index + next.index : next.index - p.index;
                if (range < r) {
                    p.right = 1;
                    next.left = 1;
                }
                else if (isSegmentLine(contour, p, next, isLast)){
                    p.right = 1;
                    next.left = 1;
                }
            }

            return breakPoints;
        }





        /**
         * 查找竖直和水平直线点
         *
         * @param  {Array} contour     轮廓
         * @param  {Array} breakPoints 关键点
         * @param  {number} r           查找范围
         * @return {Array}             关键点
         */
        function findVerticalAndHorizontalPoints(contour, breakPoints, r) {

            var contourSize = contour.length;
            for (var i = 0, l = contourSize; i < l; i++) {
                var p = contour[i];
                var cur;
                var count;

                // 查找竖直直线点
                if (p.x === p.next.x && p.x === p.next.next.x) {
                    cur = p.next.next;
                    count = 2;

                    while (cur.x === cur.next.x) {
                        cur = cur.next;
                        count++;
                    }

                    if (count > 40) {

                        cur = cur.prev;
                        //p.right = 1;
                        if (-1 == breakPoints.indexOf(p)) {
                            breakPoints.push(p);
                        }

                        markVisited(p, r, count + r);
                        // 判断是否角点
                        p.theta = computeTheta(p, r, 1);
                        p.absTheta = Math.abs(p.theta);

                        if (p.absTheta > THETA_CORNER) {
                            p.breakPoint = true;
                        }
                        else if (p.absTheta <= THETA_TANGENCY) {
                            p.tangency = true;
                        }

                        if (count > 80) {
                            //cur.left = 1;
                            if (-1 == breakPoints.indexOf(cur)) {
                                breakPoints.push(cur);
                            }

                            cur.theta = computeTheta(cur, 1, r);
                            cur.absTheta = Math.abs(cur.theta);

                            if (cur.absTheta > THETA_CORNER) {
                                cur.breakPoint = true;
                            }
                            else if (cur.absTheta < THETA_TANGENCY) {
                                cur.tangency = true;
                            }
                        }
                        i += count;
                    }

                }
                else if (p.y === p.next.y && p.y === p.next.next.y) {
                    cur = p.next.next;
                    count = 2;

                    while (cur.y === cur.next.y) {
                        cur = cur.next;
                        count++;
                    }

                    if (count > 40) {

                        cur = cur.prev;

                        //p.right = 1;
                        if (-1 == breakPoints.indexOf(p)) {
                            breakPoints.push(p);
                        }
                        //cur.left = 1;
                        if (-1 == breakPoints.indexOf(cur)) {
                            breakPoints.push(cur);
                        }

                        markVisited(p, r, count + r);
                        // 判断是否角点
                        p.theta = computeTheta(p, r, 1);
                        p.absTheta = Math.abs(p.theta);

                        if (p.absTheta > THETA_CORNER) {
                            p.breakPoint = true;
                        }
                        else if (p.absTheta > THETA_TANGENCY) {
                            p.tangency = true;
                        }

                        cur.theta = computeTheta(cur, 1, r);
                        cur.absTheta = Math.abs(cur.theta);

                        if (cur.absTheta > THETA_CORNER) {
                            cur.breakPoint = true;
                        }
                        else if (cur.absTheta < THETA_TANGENCY) {
                            cur.tangency = true;
                        }

                        i += count;
                    }
                }

            }

            breakPoints.sort(function (a, b) {
                return a.index - b.index;
            });

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

        function fixStartPoint(contour) {

            var i;
            var l;

            var minY = contour[0].y;
            var firstLine = [0];
            for (i = 1, l = contour.length; i < l; i++) {
                if (contour[i].y < minY) {
                    minY = contour[i].y;
                    firstLine = [i];
                }
                else if (contour[i].y === minY) {
                    firstLine.push(i);
                }
            }

            var index = firstLine[0];
            var minX = contour[index].x;
            for (i = 1, l = firstLine.length; i < l; i++) {
                if (contour[firstLine[i]].x < minX) {
                    minX = contour[firstLine[i]].x;
                    index = firstLine[i];
                }
            }

            if (index !== 0) {
                return contour.slice(index).concat(contour.slice(0, index));
            }

            return contour;
        }


        /**
         * 查找轮廓中的关键点
         *
         * @param  {Array} contour 轮廓点集合
         * @return {Array}         轮廓点集合
         */
        function getBreakPoints(contour) {

            //contour = fixStartPoint(contour);

            contour = makeLink(contour);

            var r = contour.length > 16 ? 10 : 4;

            var contourSize = contour.length;
            var breakPoints = [];

            if (contour.length > 60) {
                breakPoints = findVerticalAndHorizontalPoints(contour, breakPoints, r);
            }


            for (var i = 0, l = contourSize; i < l; i++) {
                p = contour[i];
                if (!p.visited) {
                    p.theta = computeTheta(p, r, r);
                    p.absTheta = Math.abs(p.theta);

                    if (p.absTheta > THETA_CORNER) {
                        p.mark = true;
                    }
                    else if (p.absTheta > THETA_TANGENCY) {
                        p.markTangency = true;
                    }
                }
            }

            // 非极大抑制查找角点
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
                for (var i = 0; i < contourSize; i += step) {
                    breakPoints.push(contour[(startIndex + i) % contourSize]);
                }
            }

            breakPoints.sort(function (a, b) {
                return a.index - b.index;
            });

            return breakPoints;
        }

        return getBreakPoints;
    }
);
