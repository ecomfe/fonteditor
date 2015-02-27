/**
 * @file 路径交点插值，对bezier曲线上的交点分割bezier曲线
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        var isBezierSegmentCross = require('graphics/isBezierSegmentCross');
        var isBezierCross = require('graphics/isBezierCross');
        var interpolatePathByJoint = require('graphics/join/interpolatePathByJoint');
        var util = require('graphics/util');
        var isPointOverlap = util.isPointOverlap;

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

        /**
         * 将bezier曲线和直线，bezier曲线之间相交部分进行插值分段
         * @param  {Array} subjectPath 主路径
         * @param  {Array} clipPath 剪切路径
         * @return  {Array} 相交的点集
         */
        function interpolatePathCrossBezier (subjectPath, clipPath) {

            var isSelfInterpolate = subjectPath === clipPath;
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
                    if (curPointSubject.onCurve && nextPointSubject.onCurve && !curPointClip.onCurve
                        && !isSelfInterpolate) {
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
                    else if (!curPointSubject.onCurve && !curPointClip.onCurve && curPointSubject !== curPointClip) {
                        if (result = getbezierCrossJoint(
                            prevPointSubject, curPointSubject, nextPointSubject,
                            prevPointClip, curPointClip, nextPointClip)) {
                            pushJoints(subjectJoints, i, result[0]);
                            pushJoints(clipJoints, j, result[1]);
                        }
                    }
                }
            }

            interpolatePathByJoint(subjectPath, popJoints(subjectJoints));
            // 如果不是自相交则对 clip path 进行插值
            if (subjectJoints !== clipJoints) {
                interpolatePathByJoint(clipPath, popJoints(clipJoints));
            }
        }



        return interpolatePathCrossBezier;
    }
);
