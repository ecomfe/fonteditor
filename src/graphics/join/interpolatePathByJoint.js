/**
 * @file 根据路径交点对路径进行插值，
 * 对bezier曲线上的交点分割bezier曲线，对直线分割成直线
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        var bezierQ2Split = require('math/bezierQ2Split');
        var getBezierQ2T = require('math/getBezierQ2T');
        var util = require('graphics/util');
        var ceilPoint = util.ceilPoint;

        /**
         * 点分割贝塞尔曲线
         * @param  {Object} p0 p0
         * @param  {Object} p1 p1
         * @param  {Object} p2 p2
         * @param  {Array} points 点数组
         * @return {Array}    分割后的结果
         */
        function bezierSplitByPoints(p0, p1, p2, points) {
            var p;
            var result = [p0];
            var bezierArray;
            var pp0 = p0;
            var pp1 = p1;

            // 对交点按照t值从小到大排序的点
            points = points.map(function (p) {
                p.t = getBezierQ2T(p0, p1, p2, p);
                return p;
            }).sort(function (a, b) {
                return a.t - b.t;
            });

            while(p = points.shift()) {
                bezierArray = bezierQ2Split(pp0, pp1, p2, p);
                if (bezierArray[1]) {
                    bezierArray[0][2].onCurve = true;
                    result.push(bezierArray[0][1]);
                    result.push(bezierArray[0][2]);
                    pp0 = bezierArray[1][0];
                    pp1 = bezierArray[1][1];
                }
            }
            result.push(pp1);
            result.push(p2);
            return result.map(function (p) {
                return ceilPoint(p);
            });
        }

        /**
         * 对路径进按分割点进行插值
         * @param  {Array} path   路径点集
         * @param  {Array} joints 交点集
         * @example
         *
         * joint = [
         *     {
         *         "index": 1,
         *         "points": {
         *             "x": 1,
         *             "y": 1
         *         }
         *     }
         * ]
         *
         * @return {Array}        插值后的路径
         */
        function interpolatePathByJoint(path, joints) {
            var splice = Array.prototype.splice;
            joints.sort(function (a, b) {
                return b.index - a.index;
            }).forEach(function (joint) {
                var i = joint.index;
                var cur = path[i];
                // 分割bezier曲线
                if (!cur.onCurve) {
                    var prev = i === 0 ? path[path.length - 1] : path[i - 1];
                    var next =  i === path.length - 1 ? path[0] : path[i + 1];
                    var result = bezierSplitByPoints(prev, cur, next, joint.points);
                    splice.apply(path, [i, 1].concat(result.slice(1, result.length - 1)));
                }
                // 分割直线
                else {
                    splice.apply(path, [i, 0].concat(joint.points.map(function (p) {
                        p.onCurve = true;
                        return p;
                    })));
                }
            });
            return path;
        }


        return interpolatePathByJoint;
    }
);
