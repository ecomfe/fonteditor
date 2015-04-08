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
            var farDist = 100 * scale;
            var longDist = 30 * scale;
            var shortDist = 12 * scale;
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

            // 判断直线点和角点
            do {
                // 修正直角连接点的x，y坐标
                if (cur.corner && cur.hoz && cur.vertical) {
                    cur.x = (Math.abs(cur.prev.x - cur.x) <= scale) ? cur.prev.x : cur.next.x;
                    cur.y = (Math.abs(cur.prev.y - cur.y) <= scale) ? cur.prev.y : cur.next.y;

                    cur.prev.right = 1;
                    cur.prev.visited = true;
                    cur.prev.breakPoint = true;

                    cur.right = 1;
                    cur.visited = true;
                    cur.breakPoint = true;
                }
                // 判断单独的角点
                else if (cur.corner) {
                    cur.visited = true;
                    cur.breakPoint = true;

                    // 对于临近的点也需要处理，防止拟合后跑偏
                    if (cur.pdist < shortDist && !cur.prev.corner) {
                        cur.prev.tangency = true;
                        cur.prev.visited = true;
                        cur.prev.breakPoint = true;
                    }

                    if (cur.ndist < shortDist && !cur.next.corner) {
                        cur.next.tangency = true;
                        cur.next.visited = true;
                        cur.next.breakPoint = true;
                    }

                }
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
                }

                cur = cur.next;
            } while (cur !== start);


            // 判断角点和切线点
            do {

                if (cur.visited) {
                    cur = cur.next;
                    continue;
                }

                // 判断水平和垂直的长线段
                if (
                    cur.apex && cur.ndist > longDist
                    && cur.theta > 0.3 && cur.next.theta > 0.3
                    && cur.pdist < shortDist && cur.next.ndist < shortDist
                ) {
                    cur.corner = true;
                    cur.visited = true;
                    cur.breakPoint = true;
                    cur.right = 1;
                    cur.next.corner = true;
                    cur.next.visited = true;
                    cur.next.breakPoint = true;
                }

                // 查找距离比较近的连续点
                if (!cur.visited && cur.ndist < shortDist) {
                    var p = cur;

                    while (p.ndist < shortDist) {
                        p.visited = true;
                        p = p.next;
                        if (p === cur) {
                            break;
                        }
                    }

                    if (p !== cur) {
                        cur.right = 3;
                        cur.tangency = true;
                        cur.breakPoint = true;
                        p.left = 3; // 悬空点
                        p.tangency = true;
                        p.visited = true;
                        p.breakPoint = true;
                    }
                }


                // 判断超长线段两端最好用直线连接
                if (!cur.visited && cur.ndist > farDist && cur.pdist > shortDist || cur.pdist > farDist && cur.ndist > shortDist) {
                    if (cur.theta < 0.3) {
                        cur.tangency = true;
                    }

                    cur.breakPoint = true;
                }

                // 判断折线段
                if (!cur.visited && cur.theta > 0.3 && (cur.ndist > longDist || cur.pdist > longDist)) {
                    cur.corner = true;
                    cur.visited = true;
                    cur.breakPoint = true;
                }

                cur = cur.next;
            } while (cur !== start);

            var breakPoints = contour.filter(function (p) {
                return p.breakPoint;
            });


            // 判断是否存在角点，不存在角点则为连续弧线
            if (!breakPoints.some(function (p) {
                return p.corner;
            })) {
                return false;
            }


            breakPoints.sort(function (a, b) {
                return a.index - b.index;
            });

            return breakPoints;
        }


        return getBreakPoints;
    }
);
