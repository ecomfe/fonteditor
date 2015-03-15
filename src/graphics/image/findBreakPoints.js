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
        var THETA_THRESHOLD = 0.3; // 夹角抑制


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
                leftX = leftX / r;
                leftY = leftY / r;

                // 右侧分量
                var rightX = 0;
                var rightY = 0;
                cur = right;
                while (cur !== p) {
                    rightX += cur.x;
                    rightY += cur.y;
                    cur = cur.prev;
                }
                rightX = rightX / r;
                rightY = rightY / r;

                // 计算theta夹角
                var cos = getCos(p.x - leftX, p.y - leftY, rightX - p.x, rightY - p.y);
                p.theta = Math.acos(cos);

                if (p.theta > THETA_THRESHOLD) {
                    p.mark = true;
                }

                left = left.next;
                right = right.next;
            }

            // 非极大抑制查找角点
            var breakPoints = contour.filter(function (p) {
                return p.mark;
            }).filter(function (p) {
                j = 0;
                left = p;
                right = p;

                var max = p.theta;
                while (j++ < r) {
                    left = left.prev;
                    right = right.next;

                    if (left.theta > max) {
                        max = left.theta;
                    }

                    if (right.theta > max) {
                        max = right.theta;
                    }
                }

                if (Math.abs(max - p.theta) < 0.01) {
                    p.breakPoint = true;
                    return true;
                }
            }).sort(function (a, b) {
                return a.index - b.index;
            });

            markBreakPoint(contour, breakPoints);

            return breakPoints;
        }

        return findBreakPoints;
    }
);
