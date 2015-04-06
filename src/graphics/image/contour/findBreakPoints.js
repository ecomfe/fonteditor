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
        var THETA_CORNER = 1.0; // 拐点抑制

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

            var start = contour[0];
            var longDist = 30 * scale;
            var shortDist = 20 * scale;
            var lineDist = 10 * scale;
            var tinyDist = 3 * scale;

            var cur = start;
            do {

                cur.ndist = cur.next.pdist = dist(cur, cur.next);

                // 距离比较近的点判断切角会不准确，需要特殊处理
                if (Math.abs(cur.x - cur.next.x) <= tinyDist && Math.abs(cur.y - cur.next.y) <= tinyDist) {
                    cur.ntiny = true;
                    cur.next.ptiny = true;
                }

                var cos = getCos(
                    cur.ptiny ? cur.prev.prev : cur.prev,
                    cur,
                    cur.ntiny ? cur.next.next : cur.next
                );

                cur.theta = Math.acos(cos > 1 ? 1 : cos) ;

                if (cur.theta > THETA_CORNER) {
                    cur.corner = true;
                }

                // 判断水平和竖直线
                if (
                    (Math.abs(cur.next.x - cur.x) < scale)
                    && Math.abs(cur.next.y - cur.y) > lineDist
                ) {
                    cur.next.vertical = true;
                    cur.vertical = true;
                }
                else if (
                    (Math.abs(cur.next.y - cur.y) < scale)
                    && Math.abs(cur.next.x - cur.x) > lineDist
                ) {
                    cur.next.hoz = true;
                    cur.hoz = true;
                }


                // 判断顶角
                if(cur.x <= cur.prev.x && cur.x <= cur.next.x) {
                    cur.xTop = true;
                    cur.apex = true;
                }

                if(cur.y <= cur.prev.y && cur.y <= cur.next.y) {
                    cur.yTop = true;
                    cur.apex = true;
                }

                if (cur.x >= cur.prev.x && cur.x >= cur.next.x) {
                    cur.xBottom = true;
                    cur.apex = true;
                }

                if (cur.y >= cur.prev.y && cur.y >= cur.next.y) {
                    cur.yBottom = true;
                    cur.apex = true;
                }

                cur = cur.next;
            } while (cur !== start);

            cur = start;
            // 判断角点和切线点
            do {

                if (cur.visited) {
                    cur = cur.next;
                    continue;
                }

                // 修正直角连接点的x，y坐标
                if (cur.corner && cur.hoz && cur.vertical) {
                    cur.x = (Math.abs(cur.prev.x - cur.x) <= scale) ? cur.prev.x : cur.next.x;
                    cur.y = (Math.abs(cur.prev.y - cur.y) <= scale) ? cur.prev.y : cur.next.y;
                    cur.prev.right = 1;
                    cur.right = 1;
                    cur.visited = true;
                    cur.breakPoint = true;
                }
                // 判断单独的角点
                else if (cur.corner) {
                    cur.visited = true;
                    cur.breakPoint = true;
                }
                // 判断单独的顶角切线点
                else if (cur.apex && !cur.prev.apex && !cur.next.apex) {
                    if (cur.theta < 0.3) {
                        cur.tangency = true;
                    }
                    cur.visited = true;
                    cur.breakPoint = true;
                }

                // 判断边界点中的切线点
                // else if (cur.theta < 0.3 && (cur.ndist > longDist || cur.pdist > longDist)) {
                //     cur.visited = true;
                //     cur.tangency = true;
                //     cur.breakPoint = true;
                // }
                // 判断边界点中的切线点
                else if (cur.apex && (cur.ndist > longDist || cur.pdist > longDist)) {
                    cur.visited = true;
                    cur.breakPoint = true;
                }
                // 直线段
                else if (cur.theta > 0.8 && (cur.ndist > longDist || cur.pdist > longDist)) {
                    cur.visited = true;
                    cur.breakPoint = true;
                }
                // 判断成对的顶角切线点
                else if (cur.apex && cur.next.apex && cur.prev.theta < 0.4 && cur.next.theta < 0.4) {
                    // 修正切线点位置
                    if (cur.xTop && cur.next.xTop || cur.xBottom && cur.next.xBottom) {
                        var minus = Math.max(Math.floor(Math.abs(cur.next.y - cur.y) / 4), 4 * scale);
                        cur.y = cur.y > cur.next.y ? cur.y - minus : cur.y + minus;
                        cur.next.y = cur.next.y > cur.y ? cur.next.y - minus : cur.next.y + minus;
                    }

                    if (cur.yTop && cur.next.yTop || cur.yBottom && cur.next.yBottom) {
                        var minus = Math.max(Math.floor(Math.abs(cur.next.x - cur.x) / 4), 4 * scale);
                        cur.x = cur.x > cur.next.x ? cur.x - minus : cur.x + minus;
                        cur.next.x = cur.next.x > cur.x ? cur.next.x - minus : cur.next.x + minus;
                    }

                    cur.visited = true;
                    cur.tangency = true;
                    cur.breakPoint = true;
                    cur.next.visited = true;
                    cur.next.tangency = true;
                    cur.next.breakPoint = true;
                }

                cur = cur.next;
            } while (cur !== start);

            var breakPoints = contour.filter(function (p) {
                return p.breakPoint;
            });

            breakPoints.sort(function (a, b) {
                return a.index - b.index;
            });

            return breakPoints;
        }


        return getBreakPoints;
    }
);
