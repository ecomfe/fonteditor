/**
 * @file 寻找关键点
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        var makeLink = require('graphics/pathUtil').makeLink;
        var vector = require('graphics/vector');
        var getCos = vector.getCos;
        var getDist = vector.getDist;
        var THETA_CORNER = 0.8; // 拐点抑制

        function dist(p0, p1) {
            return Math.sqrt(Math.pow(p0.x - p1.x, 2) + Math.pow(p0.y - p1.y, 2));
        }

        /* 查找轮廓中的关键点
         *
         * @param  {Array} contour 轮廓点集合
         * @return {Array}         轮廓点集合
         */
        function getBreakPoints(contour, scale) {

            contour = makeLink(contour);

            var breakPoints = [];
            var start = contour[0];
            var cur = start;

            do {

                if (
                    (Math.abs(cur.next.x - cur.x) <= scale)
                    && Math.abs(cur.next.y - cur.y) > 20 * scale
                ) {
                    cur.next.vertical = true;
                    cur.vertical = true;
                    cur.right = 1;
                }

                var cos = getCos(cur.prev, cur, cur.next);
                cur.theta = Math.acos(cos > 1 ? 1 : cos) ;

                if (cur.theta > THETA_CORNER) {
                    cur.breakPoint = true;
                    breakPoints.push(cur);

                    // 判断水平和竖直线
                    if (
                        (Math.abs(cur.next.x - cur.x) <= scale)
                        && Math.abs(cur.next.y - cur.y) > 20 * scale
                    ) {
                        cur.next.vertical = true;
                        cur.vertical = true;
                        cur.right = 1;
                    }
                    else if (
                        (Math.abs(cur.next.y - cur.y) <= scale)
                        && Math.abs(cur.next.x - cur.x) > 20 * scale
                    ) {
                        cur.next.hoz = true;
                        cur.hoz = true;
                        cur.right = 1;
                    }
                }

                cur = cur.next;
            } while (cur !== start);

            cur = start;
            var distance = scale * 18;
            do {
                // 修正直角连接点的x，y坐标
                if (cur.breakPoint && cur.hoz && cur.vertical) {
                    cur.x = (Math.abs(cur.prev.x - cur.x) <= scale) ? cur.prev.x : cur.next.x;
                    cur.y = (Math.abs(cur.prev.y - cur.y) <= scale) ? cur.prev.y : cur.next.y;
                }
                else {
                    if (
                        dist(cur, cur.prev) > distance
                        || dist(cur, cur.next) > distance
                    ) {
                        cur.longDist = true;
                    }
                }

                cur = cur.next;
            } while (cur !== start);

            cur = start;
            do {
                // 修正直角连接点的x，y坐标
                if (cur.longDist && !cur.next.longDist) {
                    cur.tangency = true;
                    //breakPoints.push(cur);
                }
                else if (cur.longDist && !cur.prev.longDist) {
                    cur.tangency = true;
                    //breakPoints.push(cur);
                }

                cur = cur.next;
            } while (cur !== start);

            breakPoints.sort(function (a, b) {
                return a.index - b.index;
            });

            return breakPoints;
        }


        return getBreakPoints;
    }
);
