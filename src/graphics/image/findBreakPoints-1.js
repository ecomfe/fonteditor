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
 * 直线为1，曲线为2
 */


define(
    function (require) {

        var makeLink = require('../pathUtil').makeLink;
        var getCos = require('../vector').getCos;
        var THETA_THRESHOLD = 0.1; // 夹角抑制
        var THETA_CORNER = 0.4; // 拐点抑制

        /**
         * 标记轮廓中的曲线和直线
         *
         * @param  {Array} contour      轮廓点集
         * @param  {Array} breakPoints 关键点
         */
        function markBreakPoint(contour, breakPoints) {
            var start = breakPoints[0];
            var end;
            var mid;
            for (var i = 1, l = breakPoints.length; i < l; i++) {
                end = breakPoints[i];
                // 中间点小于3个，则判断为直线
                var count = i === l - 1 ? l - end.index : end.index - start.index;
                if (count < 4) {
                    start.right = 1;
                    end.left = 1;
                }
                else {
                    // 判断向量夹角
                    if (i === l - 1) {
                        mid = contour[Math.floor(end.index + (l + end.index) / 2)];
                    }
                    else {
                        mid = contour[Math.floor((start.index + end.index) / 2)];
                    }

                    // 夹角接近直线
                    if (1 - Math.abs(getCos(mid.x - start.x, mid.y - start.y, mid.x - end.x, mid.y - end.y)) < 0.002) {
                        start.right = 1;
                        end.left = 1;
                    }
                    // 标记为待选曲线
                    else {
                        start.right = 2;
                        end.left = 2;
                    }
                }
                start = end;
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
            var r = contour.length > 10 ? 8 : 4;
            var left = contour[0];
            var right = contour[0];
            var j = 0;
            while (j++ < r) {
                left = left.prev;
                right = right.next;
            }

            for (var i = 0, l = contour.length; i < l; i++) {
                var p = contour[i];
                // 左侧分量
                var leftX = 0;
                var leftY = 0;
                var cur = left;
                while (cur !== p) {
                    leftX += cur.x;
                    leftY += cur.y;
                    cur = cur.next;
                }

                // 右侧分量
                var rightX = 0;
                var rightY = 0;
                cur = right;
                while (cur !== p) {
                    rightX += cur.x;
                    rightY += cur.y;
                    cur = cur.prev;
                }


                leftX = leftX / r;
                leftY = leftY / r;
                rightX = rightX / r;
                rightY = rightY / r;
                if (rightX - p.x === 0) {
                    console.log('xx');
                }
                // 计算theta夹角
                var theta1 = Math.atan2(rightY - p.y, rightX - p.x);
                var theta2 = Math.atan2(p.y - leftY, p.x - leftX);
                p.theta = (theta1 > 0 ? theta1 : Math.PI - theta1) - (theta2 > 0 ? theta2 : Math.PI - theta2);
                p.absTheta = getCos(rightX - p.x, rightY - p.y, p.x - leftX, p.y - leftY);

                if (p.absTheta > THETA_THRESHOLD) {
                    p.mark = true;
                }

                left = left.next;
                right = right.next;
            }

            var breakPoints = [];
            contour.forEach(function (p) {
                if (p.mark && !p.visited) {

                    // 寻找角点
                    if (p.absTheta >= THETA_CORNER) {
                        breakPoints.push(p);
                        j = 0;
                        left = p;
                        right = p;
                        var max = p.absTheta;
                        var min = p.absTheta;
                        while (j++ < r) {
                            left = left.prev;
                            right = right.next;

                            if (left.absTheta > max) {
                                max = left.absTheta;
                            }

                            if (left.absTheta < min) {
                                min = left.absTheta;
                            }

                            if (right.absTheta > max) {
                                max = right.absTheta;
                            }

                            if (right.absTheta < min) {
                                min = right.absTheta;
                            }
                        }

                        if (max === p.absTheta) {
                            console.log(max, min);
                            p.breakPoint = true;
                            //breakPoints.push(p);
                            j = 0;
                            while (j++ < r) {
                                left.visited = right.visited = true;
                                left = left.prev;
                                right = right.next;
                            }
                        }
                    }
                    // 寻找相切点和拐点
                    else {

                        j = 0;
                        left = p;
                        right = p;
                        var max = p.theta;
                        // 寻找左右符号
                        var leftEpsilonCount = 0;
                        var rightEpsilonCount = 0;
                        while (j++ < r) {
                            left = left.prev;
                            right = right.next;
                            if (left.theta < THETA_THRESHOLD) {
                                leftEpsilonCount++;
                            }

                            if (right.theta < THETA_THRESHOLD) {
                                rightEpsilonCount++;
                            }
                        }

                        // if (leftEpsilonCount > r - 1 || rightEpsilonCount > r - 1) {
                        //     breakPoints.push(p);
                        // }

                    }

                }
            });

            breakPoints.sort(function (a, b) {
                return a.index - b.index;
            });

            markBreakPoint(contour, breakPoints);

            return breakPoints;
        }

        return findBreakPoints;
    }
);
