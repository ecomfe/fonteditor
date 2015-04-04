/**
 * @file 查找直线点
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        var markVisited = require('./markVisited');

        var STRAIGHT_LINE_POINTS = 20; // 直线点过滤计数

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
                        markVisited(p, 15, count);
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
                        markVisited(p, 15, count);
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
                        }
                        else {
                            p.right = 1;
                            p.x = p.vertical ? p.x : next.x;
                            p.y = p.hoz ? p.y : next.y;
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
                p.breakPoints = 1;

                if (p.start && (p.hoz && p.y === next.y || p.vertical && p.x === next.x)) {
                    p.right = 1;
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
