/**
 * @file 路径交点插值，对bezier曲线上的交点分割bezier曲线
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        var isBezierSegmentCross = require('graphics/isBezierSegmentCross');
        var isBezierCross = require('graphics/isBezierCross');
        var bezierQ2Split = require('math/bezierQ2Split');
        var getBezierQ2Point = require('math/getBezierQ2Point');
        var getBezierQ2T = require('math/getBezierQ2T');
        var util = require('graphics/util');
        var isPointOverlap = util.isPointOverlap;
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
         * 线段分割贝塞尔曲线
         * @param  {Object} p0 p0
         * @param  {Object} p1 p1
         * @param  {Object} p2 p2
         * @param  {Object} s0 s0
         * @param  {Object} s1 s1
         * @return {Array}    分割后的结果
         */
        function getBezierSegmentJoint(p0, p1, p2, s0, s1) {
            var result;
            if (result = isBezierSegmentCross(p0, p1, p2, s0, s1)) {
                return result.filter(function (p) {
                    return !isPointOverlap(p, p0) && !isPointOverlap(p, p2);
                });
            }
        }

        /**
         * 贝塞尔曲线分割
         *
         * @param  {Object} p0 p0
         * @param  {Object} p1 p1
         * @param  {Object} p2 p2
         * @param  {Object} t0 t0
         * @param  {Object} t1 t1
         * @param  {Object} t2 t2
         * @return {Array}    分割后的结果
         */
        function getbezierCrossJoint(p0, p1, p2, t0, t1, t2) {
            var result;
            if (result = isBezierCross(
                p0, p1, p2,
                t0, t1, t2)) {

                var pResult = result.slice(0).filter(function (p) {
                    return !isPointOverlap(p, p0) && !isPointOverlap(p, p2);
                });

                var tResult = result.filter(function (p) {
                    return !isPointOverlap(p, t0) && !isPointOverlap(p, t2);
                });

                return [pResult, tResult];
            }
        }


        function pushJoints(store, index, joints) {
            if (!store[index]) {
                store[index] = [];
            }

            joints.forEach(function (p) {
                store[index].push(p);
            });
        }

        function popJoints(store) {
            return Object.keys(store).map(function (key) {
                return {
                    index: +key,
                    points: store[key]
                };
            });
        }

        function splitBezier(path, joints) {
            var splice = Array.prototype.splice;
            joints.sort(function (a, b) {
                return b.index - a.index;
            }).forEach(function (joint) {
                var i = joint.index;
                var cur = path[i];
                var prev = i === 0 ? path[path.length - 1] : path[i - 1];
                var next =  i === path.length - 1 ? path[0] : path[i + 1];
                var result = bezierSplitByPoints(prev, cur, next, joint.points);
                splice.apply(path, [i, 1].concat(result.slice(1, result.length - 1)));
            });
            return path;
        }


        /**
         * 将bezier曲线和直线，bezier曲线之间相交部分进行插值分段
         * @param  {Array} subjectPath 主路径
         * @param  {Array} clipPath 剪切路径
         * @return  {Array} 相交的点集
         */
        function interpolatePathJoint (subjectPath, clipPath) {
            var curPointSubject;
            var prevPointSubject;
            var nextPointSubject;
            var curPointClip;
            var prevPointClip;
            var nextPointClip;
            // 记录贝塞尔曲线分割点
            var subjectJoints = {};
            var clipJoints = {};
            var i;
            var j;
            var subjectSize;
            var clipSize;


            for (i = 0, subjectSize = subjectPath.length; i < subjectSize; i++) {
                curPointSubject = subjectPath[i];
                prevPointSubject = i === 0 ? subjectPath[subjectSize - 1] : subjectPath[i - 1];
                nextPointSubject =  i === subjectSize - 1 ? subjectPath[0] : subjectPath[i + 1];

                for (var j = 0, clipSize = clipPath.length; j < clipSize; j++) {
                    curPointClip = clipPath[j];
                    prevPointClip = j === 0 ? clipPath[clipSize - 1] : clipPath[j - 1];
                    nextPointClip =  j === clipSize - 1 ? clipPath[0] : clipPath[j + 1];

                    // 直线与bezier曲线相交
                    if (curPointSubject.onCurve && nextPointSubject.onCurve && !curPointClip.onCurve) {
                        if (result = getBezierSegmentJoint(
                            prevPointClip, curPointClip, nextPointClip,
                            curPointSubject, nextPointSubject)) {
                            pushJoints(clipJoints, j, result);
                        }
                    }
                    // bezier 曲线与直线
                    else if (!curPointSubject.onCurve && curPointClip.onCurve && nextPointClip.onCurve) {
                        if (result = getBezierSegmentJoint(
                            prevPointSubject, curPointSubject, nextPointSubject,
                            curPointClip, nextPointClip)) {
                            pushJoints(subjectJoints, i, result);
                        }
                    }
                    // bezier 曲线之间相交
                    else if (!curPointSubject.onCurve && !curPointClip.onCurve) {
                        if (result = getbezierCrossJoint(
                            prevPointSubject, curPointSubject, nextPointSubject,
                            prevPointClip, curPointClip, nextPointClip)) {
                            pushJoints(subjectJoints, i, result[0]);
                            pushJoints(clipJoints, j, result[1]);
                        }
                    }
                }
            }

            splitBezier(subjectPath, popJoints(subjectJoints));
            splitBezier(clipPath, popJoints(clipJoints));
        }



        return interpolatePathJoint;
    }
);
