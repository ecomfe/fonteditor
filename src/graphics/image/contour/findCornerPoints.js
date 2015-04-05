/**
 * @file 查找角点
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        var vector = require('graphics/vector');
        var markVisited = require('./markVisited');
        var getCos = vector.getCos;
        var getDist = vector.getDist;

        var SEARCH_RANGE = 10; // 查找的范围
        var THETA_CORNER = 0.5; // 拐点抑制
        var THETA_DIST_TANGENCY = 1; // 相切抑制
        var THETA_DIST = 2; // 距离抑制

        /**
         * 查找和标记直线点
         *
         * @param  {Array} contour     轮廓
         * @param  {Array} breakPoints 关键点
         * @param  {number} r           查找范围
         * @return {Array}             关键点
         */
        function findLinePoints(contour, breakPoints, r, scale) {

            // 根据角点判断是否直线点
            var contourSize = contour.length;
            for (var i = 0, l = breakPoints.length; i < l; i++) {
                var isLast = i === l - 1;
                var start = breakPoints[i];
                var end = isLast ? breakPoints[0] : breakPoints[i + 1];

                var j = 1;
                var cur = start.next;
                var lineFlag = true;
                var maxDist = 0;

                while (cur !== end) {

                    if (0 === j++  % 4) {
                        var dist = getDist(start, end, cur) / scale;

                        if (dist > 2) {
                            lineFlag = false;
                            break;
                        }
                        else if (dist > maxDist) {
                            maxDist = dist;
                        }
                    }
                    cur = cur.next;
                }

                if (j > r && lineFlag) {
                    if (maxDist <= 1 || j > 30) {
                        start.right = 1;
                    }
                }
            }

            return breakPoints;
        }


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


        /**
         * 查找和标记真正的角点
         *
         * @param  {Array} contour     轮廓
         * @param  {Array} breakPoints 关键点
         * @param  {number} r           查找范围
         * @return {Array}             关键点
         */
        function findCorner(contour, breakPoints, r) {

            var j;
            var left;
            var right;
            var max;
            var min;
            contour.forEach(function (p) {
                if (!p.visited && (p.markBreak || p.markInflexion)) {
                    j = 0;
                    left = p;
                    right = p;
                    max = p.absTheta;

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

                        if (p.markBreak) {
                            p.breakPoint = true;
                        }
                        else if (p.markInflexion) {
                            p.inflexion = true;
                        }

                        breakPoints.push(p);
                        markVisited(p, r);
                    }
                }
            });

            return breakPoints;
        }



        /**
         * 查找角点
         * @param  {Array} contour 轮廓点集
         * @param  {number} startIndex 开始点
         * @param  {number} endIndex 结束点
         * @return {Array}         角点集合
         */
        function findCornerPoints(contour, start, end, scale) {

            var r = SEARCH_RANGE;
            var breakPoints = [];
            var p = start;
            var left = p;
            var right = p;
            var j = 0;

            while (j++ < r) {
                left = left.prev;
                right = right.next;
            }

            var dist = scale * THETA_DIST;
            while (p !== end) {

                if (!p.visited) {
                    p.theta = computeTheta(p, left, right);
                    p.absTheta = Math.abs(p.theta);
                    p.dist = getDist(p, left, right) / scale;

                    if (p.absTheta > THETA_CORNER && !p.visited) {
                        p.markBreak = true;
                    }
                    // else if (p.dist > dist && !p.visited) {
                    //     p.markInflexion = true;
                    // }
                }

                left = left.next;
                right = right.next;
                p = p.next;
            }

            // 计算相切点
            findCorner(contour, breakPoints, r);
            findLinePoints(contour, breakPoints, r, scale);

            return breakPoints;
        }



        return findCornerPoints;
    }
);
