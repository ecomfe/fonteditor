/**
 * @file 查找直线点
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        var markVisited = require('./markVisited');
        var vector = require('graphics/vector');
        var getCos = vector.getCos;

        var STRAIGHT_LINE_POINTS = 20; // 直线点过滤计数
        var THETA_CORNER = 0.4; // 拐点抑制

        /**
         * 计算theta夹角
         *
         * @param  {Object} p     当前点
         * @param  {Object} left  左侧点
         * @param  {Object} right 右侧点
         * @return {number}       theta角
         */
        function computeTheta(p, left, right) {

            var leftX = p.x - left.x;
            var leftY = p.y - left.y;
            var rightX = right.x - p.x;
            var rightY = right.y - p.y;
            var cos = getCos(leftX, leftY, rightX, rightY);
            var theta = Math.acos(cos > 1 ? 1 : cos);
            // 计算theta的顺时针或逆时针
            return theta;
        }

        function getTheta(p) {
            // 判断是拐点还是切线点
            var left = p;
            var right = p;
            var j = 0;

            while (j++ < STRAIGHT_LINE_POINTS) {
                left = left.prev;
                right = right.next;
            }

            return computeTheta(p, left, right);
        }


        /**
        /**
         * 查找和标记直线点
         *
         * @param  {Array} contour     轮廓
         * @param  {Array} breakPoints 关键点
         * @param  {number} r           查找范围
         * @return {Array}             关键点
         */
        function findStraightLinePoints(contour, scale) {

            var linePoints = [];
            var contourSize = contour.length;

            // 查找首个节点的水平延伸
            var start = contour[0];
            var cur = start;

            while (cur.x === cur.prev.x) {
                cur = cur.prev;
            }

            start = cur;

            // 查找直线
            var p;
            var count;
            cur = start.next;

            while(cur !== start) {

                // 查找竖直直线点
                if (cur.x === cur.next.x) {
                    count  = 1;
                    p = cur;
                    cur = cur.next;

                    while (cur !== start && cur.x === cur.next.x) {
                        cur = cur.next;
                        count++;
                    }

                    if (count > STRAIGHT_LINE_POINTS) {
                        p.start = 1;
                        p.vertical = 1;
                        cur.vertical = 1;
                        linePoints.push(p);
                        linePoints.push(cur);
                        markVisited(p, 10, count);
                    }
                }
                // 查找水平直线点
                else if (cur.y === cur.next.y) {
                    count  = 1;
                    p = cur;
                    cur = cur.next;

                    while (cur !== start && cur.y === cur.next.y) {
                        cur = cur.next;
                        count++;
                    }

                    if (count > STRAIGHT_LINE_POINTS) {
                        p.start = 1;
                        p.hoz = 1;
                        cur.hoz = 1;
                        linePoints.push(p);
                        linePoints.push(cur);
                        markVisited(p, 10, count);
                    }
                }
                else {
                    cur = cur.next;
                }
            }

            var next;
            var newLinePoints = [];
            var i;
            var l;
            for (i = 0, l = linePoints.length; i < l; i++) {
                p = linePoints[i];
                next = linePoints[i === l - 1 ? 0 : i + 1];

                if (p.x === next.x && p.y === next.y) {
                    continue;
                }
                else if (Math.abs(p.x - next.x) / scale <= 2 && Math.abs(p.y - next.y) / scale <= 2) {
                    // 如果连续但是接近直线，则去除这两个点
                    if (p.vertical && next.vertical || p.hoz && next.hoz) {
                        i++;
                        continue;
                    }
                    // 否则修正直线夹角
                    else {
                        // p是最后一个点，则修正第一个点
                        if (i === l - 1) {
                            next.x = p.vertical ? p.x : next.x;
                            next.y = p.hoz ? p.y : next.y;
                            next.breakPoint = true;
                        }
                        else {
                            p.right = 1;
                            p.x = p.vertical ? p.x : next.x;
                            p.y = p.hoz ? p.y : next.y;
                            p.breakPoint = true;
                            newLinePoints.push(p);
                        }
                        i++;
                    }
                }
                else {
                    newLinePoints.push(p);
                }
            }

            for (i = 0, l = newLinePoints.length; i < l; i++) {
                p = newLinePoints[i];
                next = newLinePoints[i === l - 1 ? 0 : i + 1];

                if (p.start && (p.hoz && p.y === next.y || p.vertical && p.x === next.x)) {
                    p.right = 1;
                }
            }

            // 如果直线点不是拐点则需要按照切线点回退一定的点
            for (i = 0, l = newLinePoints.length; i < l; i++) {

                p = newLinePoints[i];

                if (!p.breakPoint) {
                    p.theta = getTheta(p);
                    p.absTheta = Math.abs(p.theta);
                    if (p.absTheta > THETA_CORNER) {
                        p.breakPoint = true;
                    }
                    else {
                        var backCount = p.absTheta < 0.05 ? 10 : (p.absTheta < 0.2 ? 5 : 2);
                        var isRight = p.right;
                        var isStart = p.start;
                        while (backCount-- > 0) {
                            p = isStart ? p.next : p.prev;
                        }
                        if (isRight) {
                            p.right = 1;
                        }
                        p.tangency = 1;
                        newLinePoints.splice(i, 1, p);
                    }
                }
            }

            newLinePoints.sort(function (a, b) {
                return a.index - b.index;
            });

            return newLinePoints;
        }



        return findStraightLinePoints;
    }
);
