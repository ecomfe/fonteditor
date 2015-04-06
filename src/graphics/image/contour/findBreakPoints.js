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

            var start = contour[0];
            var cur = start;
            var longDist = 80 * scale;
            var shortDist = 20 * scale;
            var lineDist = 10 * scale;
            var tinyDist = 2 * scale;

            do {

                // 距离比较近的点判断切角会不准确，需要特殊处理
                if (Math.abs(cur.x - cur.next.x) <= tinyDist && Math.abs(cur.y - cur.next.y) <= tinyDist) {
                    cur.ntiny = true;
                    cur.next.ptiny = true;
                }


                var cos = getCos(cur.ptiny ? cur.prev.prev : cur.prev, cur, cur.ntiny ? cur.next.next : cur.next);
                cur.theta = Math.acos(cos > 1 ? 1 : cos) ;

                if (cur.theta > THETA_CORNER) {
                    cur.breakPoint = true;

                    // 判断水平和竖直线
                    if (
                        (Math.abs(cur.next.x - cur.x) < scale)
                        && Math.abs(cur.next.y - cur.y) > lineDist
                    ) {
                        cur.next.vertical = true;
                        cur.vertical = true;
                        cur.right = 1;
                    }
                    else if (
                        (Math.abs(cur.next.y - cur.y) < scale)
                        && Math.abs(cur.next.x - cur.x) > lineDist
                    ) {
                        cur.next.hoz = true;
                        cur.hoz = true;
                        cur.right = 1;
                    }
                }


                // 判断顶角
                if(cur.x <= cur.prev.x && cur.x <= cur.next.x
                    || cur.y <= cur.prev.y && cur.y <= cur.next.y
                ) {
                    cur.apexTop = true;
                    cur.apex = true;
                }

                if (cur.x >= cur.prev.x && cur.x >= cur.next.x
                    || cur.y >= cur.prev.y && cur.y >= cur.next.y
                ) {
                    cur.apexBottom = true;
                    cur.apex = true;
                }

                // 标记上一个点和下一个点的距离
                if (Math.abs(cur.x - cur.next.x) > longDist) {
                    cur.nxl = true;
                    cur.next.pxl = true;
                }

                if (Math.abs(cur.y - cur.next.y) > longDist) {
                    cur.nyl = true;
                    cur.next.pyl = true;
                }

                if (Math.abs(cur.x - cur.next.x) < shortDist) {
                    cur.nxs = true;
                    cur.next.pxs = true;
                }

                if (Math.abs(cur.y - cur.next.y) < shortDist) {
                    cur.nys = true;
                    cur.next.pys = true;
                }

                cur = cur.next;
            } while (cur !== start);

            cur = start;
            do {
                // 修正直角连接点的x，y坐标
                if (cur.breakPoint && cur.hoz && cur.vertical) {
                    cur.x = (Math.abs(cur.prev.x - cur.x) <= scale) ? cur.prev.x : cur.next.x;
                    cur.y = (Math.abs(cur.prev.y - cur.y) <= scale) ? cur.prev.y : cur.next.y;
                    cur.rightAngle = true;
                }

                // 判断切线
                if(cur.theta < 0.1 && (cur.pxl || cur.pyl || cur.nxl || cur.nyl)) {
                    cur.tangency = true;
                }

                // 移除非真正的breakPoint
                if (cur.breakPoint && !cur.ptiny && !cur.ntiny && (cur.nxs && cur.pxs)) {
                    delete cur.breakPoint;
                }


                cur = cur.next;
            } while (cur !== start);

            var breakPoints = [];
            cur = start;
            do {

                if (cur.rightAngle) {
                    breakPoints.push(cur);
                }
                else if (cur.right === 1) {
                    breakPoints.push(cur);
                }
                else if (cur.ntiny || cur.rtiny) {
                    breakPoints.push(cur);
                }
                else if (cur.apex) {
                    breakPoints.push(cur);
                }
                else if (cur.pxl && cur.next.pxs || cur.pyl && cur.next.pys) {
                    breakPoints.push(cur);
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
