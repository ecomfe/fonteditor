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

        var makeLink = require('../pathUtil').makeLink;
        var getCos = require('../vector').getCos;

        var THETA_TANGENCY = 0.1; // 相切抑制
        var THETA_CORNER = 0.5; // 拐点抑制
        var THETA_MARK_COUNT = 0.8; // 标记点个数抑制

        function isLine(p0, p1, p) {
            return 1 - Math.abs(getCos(p.x - p0.x, p.y - p0.y, p.x - p1.x, p.y - p1.y)) < 0.005;
        }

        function removeOnLinePoint(contour) {
            // 移除直线上误判的点
            for (var i = contour.length - 1, last = i; i >= 0; i--) {
                // 这里注意逆序
                var p = contour[i];
                var next = i === last ? contour[0] : contour[i + 1];
                var prev = i === 0 ? contour[last] : contour[i - 1];

                if (isLine(prev, next, p)) {
                    contour.splice(i, 1);
                    last--;
                    continue;
                }
            }

            return contour;
        }

        /**
         * 对轮廓中的关键点做进一步提取
         *
         * @param  {Array} contour      轮廓点集
         * @param  {Array} breakPoints 关键点
         * @param  {number} r 搜索半径
         */
        function filterBreakPoint(contour, breakPoints, r) {

            var contourSize = contour.length;
            breakPoints = removeOnLinePoint(breakPoints);

            for (var i = 0, l = breakPoints.length; i < l; i++) {
                var isLast = i === l - 1;
                var start = breakPoints[i];
                var end = breakPoints[ isLast ? 0 : i + 1];

                // 中间点小于3个，则判断为直线
                var count = isLast ? l - end.index : end.index - start.index;
                if (start.breakPoint && end.breakPoint && count < 10) {
                    start.right = 1;
                    end.left = 1;
                }
                else {
                    // 判断中间点距离
                    mid = contour[Math.floor((end.index + (isLast ? contourSize : start.index)) / 2)];

                    // 夹角接近直线
                    if (isLine(start, end, mid)) {
                        // 随机选取 几个点进行直线判断
                        var startIndex = start.index + 10;
                        var endIndex = end.index - 1;
                        if (isLast) {
                            startIndex = end.index + 10;
                            endIndex = l + startIndex.index;
                        }

                        var lineFlag = true;
                        for (var j = startIndex; j < endIndex; j+= 10) {
                            if (!isLine(start, end, contour[j % contourSize])) {
                                lineFlag = false;
                                break;
                            }
                        }
                        if (lineFlag) {
                            start.right = 1;
                            end.left = 1;
                        }
                    }
                    // 标记待选曲线
                    else {
                        start.right = 2;
                        end.left = 2;
                    }
                }
            }

            // 移除过多的切线点

            return breakPoints;
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
         * @param  {number} r 半径
         */
        function markVisited(p, r) {
            var j = 0;
            var left = p;
            var right = p;
            p.visited = true;
            while (j++ < r) {
                left = left.prev;
                right = right.next;
                left.visited = right.visited = true;
            }
        }


        /**
         * 查找轮廓中的关键点
         *
         * @param  {Array} contour 轮廓点集合
         * @return {Array}         轮廓点集合
         */
        function findBreakPoints(contour) {

            contour = makeLink(contour);
            var r = contour.length > 10 ? 12 : 4;
            var j = 0;
            for (var i = 0, l = contour.length; i < l; i++) {
                var p = contour[i];
                p.theta = computeTheta(p, r, r);
                p.absTheta = Math.abs(p.theta);

                if (p.absTheta > THETA_CORNER) {
                    p.mark = true;
                }
                else if (p.absTheta > THETA_TANGENCY) {
                    p.tangencyMark = true;
                }
            }

            // 非极大抑制查找角点
            var breakPoints = [];
            contour.forEach(function (p) {
                if (p.mark && !p.visited) {
                    j = 0;
                    var left = p;
                    var right = p;

                    var max = p.absTheta;
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

            var thetaMarkCount = THETA_MARK_COUNT * 2 * r;
            var halfThetaMarkCount = 0.5 * thetaMarkCount;

            contour.forEach(function (p) {
                if (p.tangencyMark && !p.visited){
                    j = 0;
                    left = p;
                    right = p;
                    var leftMark = [0, 0, 0]; // 左侧标记数组，第一个为0的个数，第二个为-1的个数，第三个为1的个数
                    var rightMark = [0, 0, 0];
                    while (j++ < r) {
                        left = left.prev;
                        right = right.next;

                        var thetaL = computeTheta(left, r, j);
                        var thetaR = computeTheta(right, j, r);



                        if (Math.abs(thetaL) <= THETA_TANGENCY) {
                            leftMark[0]++;
                        }
                        else if (thetaL < THETA_TANGENCY) {
                            leftMark[1]++;
                        }
                        else if (thetaL > THETA_TANGENCY) {
                            leftMark[1]++;
                        }

                        if (Math.abs(thetaR) <= THETA_TANGENCY) {
                            rightMark[0]++;
                        }
                        else if (thetaR < THETA_TANGENCY) {
                            rightMark[1]++;
                        }
                        else if (thetaR > THETA_TANGENCY) {
                            rightMark[1]++;
                        }

                    }

                    // 检查两直线夹角比较小的情况
                    if (
                        leftMark[0] + rightMark[0] >= halfThetaMarkCount
                    ) {

                        j = 0;
                        var left = p;
                        var right = p;

                        var max = p.absTheta;
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
                            p.inflexion = true;
                            breakPoints.push(p);
                            markVisited(p, r);
                        }
                    }

                    // 检测直线曲线相切点
                    else if (
                        leftMark[2] + rightMark[0] >= thetaMarkCount
                        || leftMark[0] + rightMark[2] >= thetaMarkCount
                        || leftMark[1] + rightMark[0] >= thetaMarkCount
                        || leftMark[0] + rightMark[1] >= thetaMarkCount
                    ) {

                        p.tangency = true;
                        breakPoints.push(p);
                        markVisited(p, r);
                    }
                    // 检查曲线相切点
                    else if (
                        leftMark[1] + rightMark[2] >= thetaMarkCount
                        || leftMark[2] + rightMark[1] >= thetaMarkCount
                    ) {
                        p.inflexion = true;
                        breakPoints.push(p);
                        markVisited(p, r);
                    }
                }
            });

            breakPoints.sort(function (a, b) {
                return a.index - b.index;
            });

            breakPoints = filterBreakPoint(contour, breakPoints, r);

            return breakPoints;
        }

        return findBreakPoints;
    }
);
