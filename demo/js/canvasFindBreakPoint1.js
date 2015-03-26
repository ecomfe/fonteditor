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
        var getDist = require('../vector').getDist;

        var THETA_TANGENCY = 0.1; // 相切抑制
        var THETA_CORNER = 0.5; // 拐点抑制
        var THETA_MARK_COUNT = 0.8; // 标记点个数抑制
        var THETA_INFLEXION_RANGE = 0.05; // 切线点之间的距离抑制

        function absCos(p0, p1, p) {
            return Math.abs(getCos(p.x - p0.x, p.y - p0.y, p.x - p1.x, p.y - p1.y));
        }

        function isLine(p0, p1, p) {
            return 1 - absCos(p0, p1, p) < 0.004;
        }

        function isPerfectLine(p0, p1, p) {
            return 1 - absCos(p0, p1, p) < 0.002;
        }

        function removeOnLinePoint(points) {
            // 移除直线上误判的点
            for (var i = points.length - 1, last = i; i >= 0; i--) {
                // 这里注意逆序
                var p = points[i];
                var next = i === last ? points[0] : points[i + 1];
                var prev = i === 0 ? points[last] : points[i - 1];

                if (p.inflexion && isPerfectLine(prev, next, p)) {
                    points.splice(i, 1);
                    last--;
                    continue;
                }
            }

            return points;
        }

        function isSegmentLine(contour, start, end, isLast) {
            var contourSize = contour.length;
            var mid;
            var THETA_DIST = 20; // 判断直线点距离

            // 判断中间点距离
            if (isLast) {
                mid = contour[Math.floor(start.index + (contourSize - start.index + end.index) / 2) % contourSize];
            }
            else {
                mid = contour[Math.floor((start.index + end.index) / 2)];
            }

            if (getDist(start, end, mid) > THETA_DIST) {
                return false;
            }

            // 随机选取 几个点进行直线判断
            var startIndex = start.index;
            var endIndex = end.index;
            if (isLast) {
                startIndex = start.index;
                endIndex = contourSize + end.index;
            }

            var step = Math.floor(Math.max((endIndex - startIndex) / 10, 4));
            var lineFlag = true;

            for (var j = startIndex + step; j < endIndex; j += step) {
                if (getDist(start, end, mid) > THETA_DIST) {
                    lineFlag = false;
                    break;
                }
            }
            return lineFlag;
        }


        function removeInflexionPoint(points, contour) {
            // 移除过多的切线点
            var contourSize = contour.length;
            var range;
            for (var i = points.length - 1, last = i; i >= 0; i--) {
                // 这里注意逆序
                var p = points[i];
                var next = i === last ? points[0] : points[i + 1];
                var prev = i === 0 ? points[last] : points[i - 1];

                // 两个同为切线点
                if (p.inflexion && next.inflexion) {
                    range = i === last ? last + 1 - p.index + next.index : next.index - p.index;
                    if (range / contourSize < THETA_INFLEXION_RANGE) {
                        if (p.absTheta > next.absTheta) {
                            points.splice(i, 1);
                        }
                        else {
                            points.splice(i + 1, 1);
                        }
                        last--;
                        continue;
                    }
                }
                // 拐点附近的切线点
                else if (p.breakPoint && next.inflexion) {
                    range = i === last ? last + 1 - p.index + next.index : next.index - p.index;
                    if (range / contourSize < THETA_INFLEXION_RANGE) {
                        points.splice(i + 1, 1);
                        i--;
                        last--;
                        continue;
                    }
                }
                // 拐点附近的切线点
                else if (p.inflexion && next.breakPoint) {
                    range = i === last ? last + 1 - p.index + next.index : next.index - p.index;
                    if (range / contourSize < THETA_INFLEXION_RANGE) {
                        points.splice(i, 1);
                        i--;
                        last--;
                        continue;
                    }
                }
            }

            return points;
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
                var end = breakPoints[isLast ? 0 : i + 1];

                // 中间点小于10个，则判断为直线
                var range = isLast ? contourSize - start.index + end.index : end.index - start.index;
                if (start.breakPoint && end.breakPoint && range < 10) {
                    start.right = 1;
                    end.left = 1;
                }
                else {
                    // 判断中间点距离
                    if (isLast) {
                        mid = contour[Math.floor(start.index + (contourSize - start.index + end.index) / 2) % contourSize];
                    }
                    else {
                        mid = contour[Math.floor((start.index + end.index) / 2)];
                    }

                    // 夹角接近直线，这里需要对夹角接近直线的点进行修正，使直线点扩大或者缩小
                    var isOnLine = false;
                    if (isLine(start.next, end.prev, mid)) {
                        var isOnLine = true;
                        var from = start.next;
                        var to = end.prev;

                        while (absCos(from.prev, to, mid) >= absCos(from, to, mid)) {
                            if (from.prev !== start) {
                                from.prev.inflexion = start.inflexion;
                                from.prev.breakPoint = start.breakPoint;
                                delete start.inflexion;
                                delete start.breakPoint;
                                start = breakPoints[i] = from.prev;
                            }
                            from = from.prev;
                        }

                        while (absCos(from, to.next, mid) >= absCos(from, to, mid)) {
                            if (to.next !== to) {
                                to.next.inflexion = end.inflexion;
                                to.next.breakPoint = end.breakPoint;
                                delete end.inflexion;
                                delete end.breakPoint;
                                end = breakPoints[isLast ? 0 : i + 1] = to.next;
                                to = to.next;
                            }
                        }
                    }

                    if (isOnLine || isLine(start, end, mid)) {
                        if (isSegmentLine(contour, start, end, isLast)) {
                            start.right = 1;
                            end.left = 1;
                        }
                        else {
                            start.right = 2;
                            end.left = 2;
                        }
                    }
                    // 标记待选曲线
                    else {
                        start.right = 2;
                        end.left = 2;
                    }
                }
            }

            if (breakPoints[0] === breakPoints[l - 1]) {
                breakPoints.splice(l - 1, 1);
            }

            breakPoints = removeInflexionPoint(breakPoints, contour);

            return breakPoints.sort(function (a, b) {
                return a.index - b.index;
            });
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


        function findLinePoints(contour, breakPoints, r) {
            // 根据角点查找竖直和水平线
            var linePoints = [];

            // var fnDirection = function (start, direction, axis) {
            //     // 查找水平线
            //     var count = 0;
            //     var cur = start;
            //     while (cur[direction][axis] === cur[axis]) {
            //         count++;
            //         cur.visited = true;
            //         cur = cur[direction];
            //     }

            //     if (count > 12) {
            //         start.linePoint = true;
            //         start[direction === 'prev' ? 'left' : 'right'] = 1;
            //         cur.linePoint = true;
            //         cur[direction === 'prev' ? 'right' : 'left'] = 1;
            //         if (!breakPoints.indexOf(cur) && !linePoints.indexOf(cur)) {
            //             linePoints.push(cur);
            //             console.log(cur);
            //         }
            //     }
            // };

            var contourSize = contour.length;
            for (var i = 0, l = breakPoints.length, last = l - 1; i < l; i++) {
                var p = breakPoints[i];
                var next = i === last ? breakPoints[0] : breakPoints[i + 1];

                var range = i === last ? contourSize - p.index + next.index : next.index - p.index;
                if (range < r) {
                    start.right = 1;
                    end.left = 1;
                }
                else {


                }


                // fnDirection(breakPoints[i], 'prev', 'x');
                // fnDirection(breakPoints[i], 'next', 'x');
                // fnDirection(breakPoints[i], 'prev', 'y');
                // fnDirection(breakPoints[i], 'next', 'y');
            }

            // breakPoints = breakPoints.concat(linePoints).sort(function(a, b) {
            //     return a.index - b.index;
            // });

            // for (var i = breakPoints.length - 1, last = i; i >= 0; i--) {
            //     // 这里注意逆序
            //     var p = breakPoints[i];
            //     var next = i === last ? breakPoints[0] : breakPoints[i + 1];
            //     var prev = i === 0 ? breakPoints[last] : breakPoints[i - 1];

            //     if (p.x === 750 && p.y === 5080) {
            //         debugger;
            //     }

            //     // 相近点
            //     if (p.next === next || p.next.next === next) {

            //         if (p.linePoint) {
            //             breakPoints.splice(i, 1);
            //             breakPoints[i] = p;
            //         }
            //         else {
            //             breakPoints.splice(i, 1);
            //         }

            //         last--;
            //         continue;
            //     }
            // }


            // for (var i = 0, l = breakPoints.length, last = l - 1; i < l; i++) {
            //     var p = breakPoints[i];
            //     var next = i === last ? breakPoints[0] : breakPoints[i + 1];
            //     var prev = i === 0 ? breakPoints[last] : breakPoints[i - 1];

            //     var range = i === last  ? contourSize - p.index + next.index : next.index - p.index;
            //     console.log(range);
            //     if (p.right != 1 && Math.abs(p.x - p.next.x) <= 2 && range > 30) {
            //         p.right = 1;
            //     }
            //     if (p.right != 1 && Math.abs(p.y - p.next.y) <= 2 && range > 30) {
            //         p.right = 1;
            //     }
            // }

            return breakPoints;
        }

        /**
         * 查找轮廓中的关键点
         *
         * @param  {Array} contour 轮廓点集合
         * @return {Array}         轮廓点集合
         */
        function findBreakPoints(contour) {

            contour = makeLink(contour);
            var r = contour.length > 16 ? 12 : 4;
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

            breakPoints = findLinePoints(contour, breakPoints, r);

            // var thetaMarkCount = THETA_MARK_COUNT * 2 * r;
            // var halfThetaMarkCount = 0.5 * thetaMarkCount;

            // contour.forEach(function (p) {
            //     if (p.tangencyMark && !p.visited){
            //         j = 0;
            //         left = p;
            //         right = p;
            //         var leftMark = [0, 0, 0]; // 左侧标记数组，第一个为0的个数，第二个为-1的个数，第三个为1的个数
            //         var rightMark = [0, 0, 0];
            //         while (j++ < r) {
            //             left = left.prev;
            //             right = right.next;

            //             var thetaL = computeTheta(left, r, j);
            //             var thetaR = computeTheta(right, j, r);



            //             if (Math.abs(thetaL) <= THETA_TANGENCY) {
            //                 leftMark[0]++;
            //             }
            //             else if (thetaL < THETA_TANGENCY) {
            //                 leftMark[1]++;
            //             }
            //             else if (thetaL > THETA_TANGENCY) {
            //                 leftMark[1]++;
            //             }

            //             if (Math.abs(thetaR) <= THETA_TANGENCY) {
            //                 rightMark[0]++;
            //             }
            //             else if (thetaR < THETA_TANGENCY) {
            //                 rightMark[1]++;
            //             }
            //             else if (thetaR > THETA_TANGENCY) {
            //                 rightMark[1]++;
            //             }

            //         }

            //         // 检查两直线夹角比较小的情况
            //         if (
            //             leftMark[0] + rightMark[0] >= halfThetaMarkCount
            //         ) {

            //             j = 0;
            //             var left = p;
            //             var right = p;

            //             var max = p.absTheta;
            //             while (j++ < r) {
            //                 left = left.prev;
            //                 right = right.next;

            //                 if (left.absTheta > max) {
            //                     max = left.absTheta;
            //                 }

            //                 if (right.absTheta > max) {
            //                     max = right.absTheta;
            //                 }
            //             }

            //             if (max === p.absTheta) {
            //                 p.inflexion = true;
            //                 breakPoints.push(p);
            //                 markVisited(p, r);
            //             }
            //         }

            //         // 检测直线曲线相切点
            //         else if (
            //             leftMark[2] + rightMark[0] >= thetaMarkCount
            //             || leftMark[0] + rightMark[2] >= thetaMarkCount
            //             || leftMark[1] + rightMark[0] >= thetaMarkCount
            //             || leftMark[0] + rightMark[1] >= thetaMarkCount
            //         ) {

            //             p.inflexion = true;
            //             breakPoints.push(p);
            //             markVisited(p, r);
            //         }
            //         // 检查曲线相切点
            //         else if (
            //             leftMark[1] + rightMark[2] >= thetaMarkCount
            //             || leftMark[2] + rightMark[1] >= thetaMarkCount
            //         ) {
            //             p.inflexion = true;
            //             breakPoints.push(p);
            //             markVisited(p, r);
            //         }
            //     }
            // });

            breakPoints.sort(function (a, b) {
                return a.index - b.index;
            });

            return breakPoints;
        }

        return findBreakPoints;
    }
);
