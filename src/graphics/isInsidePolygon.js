/**
 * @file isInsidePolygon.js
 * @author mengke01
 * @date 
 * @description
 * 判断点是否在polygon内部
 * 
 * copy from zrender:
 * https://github.com/ecomfe/zrender
 */


define(
    function(require) {

        /**
         * 多边形包含判断
         * 警告：下面这段代码会很难看，建议跳过~
         */
        function isInsidePolygon(pointList, x, y) {
            /**
             * 射线判别法
             * 如果一个点在多边形内部，任意角度做射线肯定会与多边形要么有一个交点，要么有与多边形边界线重叠
             * 如果一个点在多边形外部，任意角度做射线要么与多边形有一个交点，
             * 要么有两个交点，要么没有交点，要么有与多边形边界线重叠。
             */
            var i;
            var j;
            var polygon = pointList;
            var N = polygon.length;
            var inside = false;
            var redo = true;
            var v;

            for (i = 0; i < N; ++i) {
                // 是否在顶点上
                if (polygon[i].x == x && polygon[i].y == y ) {
                    redo = false;
                    inside = true;
                    break;
                }
            }

            if (redo) {
                redo = false;
                inside = false;
                for (i = 0,j = N - 1; i < N; j = i++) {
                    if ((polygon[i].y < y && y < polygon[j].y)
                        || (polygon[j].y < y && y < polygon[i].y)
                    ) {
                        if (x <= polygon[i].x || x <= polygon[j].x) {
                            v = (y - polygon[i].y)
                                * (polygon[j].x - polygon[i].x)
                                / (polygon[j].y - polygon[i].y)
                                + polygon[i].x;
                            if (x < v) {          // 在线的左侧
                                inside = !inside;
                            }
                            else if (x == v) {   // 在线上
                                inside = true;
                                break;
                            }
                        }
                    }
                    else if (y == polygon[i].y) {
                        if (x < polygon[i].x) {    // 交点在顶点上
                            polygon[i].y > polygon[j].y ? --y : ++y;
                            //redo = true;
                            break;
                        }
                    }
                    else if (polygon[i].y == polygon[j].y // 在水平的边界线上
                             && y == polygon[i].y
                             && ((polygon[i].x < x && x < polygon[j].x)
                                 || (polygon[j].x < x && x < polygon[i].x))
                    ) {
                        inside = true;
                        break;
                    }
                }
            }
            return inside;
        }

        return isInsidePolygon;
    }
);
