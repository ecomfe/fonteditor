/**
 * @file pathJoin.js
 * @author mengke01
 * @date
 * @description
 * 求路径的合并
 * 利用插值将曲线转换成直线，求解后再转换成曲线
 */


define(
    function (require) {

        var Relation = require('./join/relation');
        var Clipper = require('graphics/clipping/Clipper');
        var interpolate = require('./pathUtil').interpolate;
        var deInterpolate = require('./pathUtil').deInterpolate;
        var getBezierQ2Point = require('math/getBezierQ2Point');
        var computeBoundingBox = require('graphics/computeBoundingBox');
        var isBezierSegmentCross = require('graphics/isBezierSegmentCross');
        var isBezierCross = require('graphics/isBezierCross');
        var bezierQ2Split = require('math/bezierQ2Split');
        var isPointOverlap = require('graphics/util').isPointOverlap;
        var ceilPoint = require('graphics/util').ceilPoint;
        var lang = require('common/lang');

        function getPointHash(p) {
            return Math.floor(7 * Math.floor(p.x * 100) + 31 * Math.floor(p.y * 100));
        }

        /**
         * 将bezier曲线转换成clipper可处理的直线
         *
         * @param  {Array} contour 轮廓
         * @param  {Array} bezierHash 记录bezier的哈希
         * @return {Array}
         */
        function bezier2Segment(contour, bezierHash) {
            var curPoint;
            var prevPoint;
            var nextPoint;
            var result = [];

            for (var i = 0, l = contour.length; i < l; i++) {
                if (!contour[i].onCurve) {
                    curPoint = ceilPoint(contour[i]);
                    prevPoint = i === 0 ? contour[l - 1] : contour[i - 1];
                    nextPoint =  i === l - 1 ? contour[0] : contour[i + 1];
                    var firstPoint = ceilPoint(getBezierQ2Point(prevPoint, curPoint, nextPoint, 0.1));
                    var lastPoint = ceilPoint(getBezierQ2Point(prevPoint, curPoint, nextPoint, 0.9));
                    bezierHash[getPointHash(firstPoint)] = curPoint;
                    bezierHash[getPointHash(lastPoint)] = curPoint;

                    result.push(firstPoint);
                    for (var j = 2; j < 9; j++) {
                        result.push(getBezierQ2Point(prevPoint, curPoint, nextPoint, j * 0.1));
                    }
                    result.push(lastPoint);
                }
                else {
                    result.push(ceilPoint(contour[i]));
                }
            }
            return result;
        }

        function bezierSegmentSplit(p0, p1, p2, s0, s1) {
            var result;
            if (result = isBezierSegmentCross(
                p0, p1, p2,
                s0, s1)) {
                result = result.filter(function (p) {
                    return !isPointOverlap(p, p0) && !isPointOverlap(p, p2);
                });
                // 1个交点
                if (result.length === 1) {
                    var bezierArray = bezierQ2Split(p0, p1, p2, result[0]);
                    bezierArray[0][2].onCurve = true;
                    return [bezierArray[0][1], bezierArray[0][2], bezierArray[1][1]];
                }
                // 2个交点
                else if (result.length === 2) {
                    console.warn('error splitting path');
                }
            }
        }

        function bezierSplit(p0, p1, p2, t0, t1, t2) {
            var result;
            if (result = isBezierCross(
                p0, p1, p2,
                t0, t1, t2)) {
                result = result.filter(function (p) {
                    return !isPointOverlap(p, p0) && !isPointOverlap(p, p2)
                        && !isPointOverlap(p, t0) && !isPointOverlap(p, t2);
                });

                // 1个交点
                if (result.length === 1) {
                    var bezierArrayp = bezierQ2Split(p0, p1, p2, result[0]);
                    bezierArrayp[0][2].onCurve = true;
                    var bezierArrayt = bezierQ2Split(t0, t1, t2, result[0]);
                    bezierArrayt[0][2].onCurve = true;
                    return [
                        [bezierArrayp[0][1], bezierArrayp[0][2], bezierArrayp[1][1]],
                        [bezierArrayt[0][1], bezierArrayt[0][2], bezierArrayt[1][1]]
                    ];
                }
                // 2个交点
                else if (result.length === 2) {
                    console.warn('error splitting path');
                }
            }
        }

        /**
         * 将bezier曲线和直线相交的部分做标记替换
         * @param  {Array} subjectPath 主路径
         * @param  {Array} clipPath 剪切路径
         */
        function markIntersection(subjectPath, clipPath) {
            var curPointSubject;
            var prevPointSubject;
            var nextPointSubject;
            var curPointClip;
            var prevPointClip;
            var nextPointClip;
            var result;
            var subjectSize;
            var clipSize;
            for (var i = 0; i < subjectPath.length; i++) {
                subjectSize = subjectPath.length;
                curPointSubject = subjectPath[i];
                prevPointSubject = i === 0 ? subjectPath[subjectSize - 1] : subjectPath[i - 1];
                nextPointSubject =  i === subjectSize - 1 ? subjectPath[0] : subjectPath[i + 1];
                for (var j = 0; j < clipPath.length; j++) {
                    clipSize = clipPath.length;
                    curPointClip = clipPath[j];
                    prevPointClip = j === 0 ? clipPath[clipSize - 1] : clipPath[j - 1];
                    nextPointClip =  j === clipSize - 1 ? clipPath[0] : clipPath[j + 1];

                    // 直线与bezier曲线相交
                    if (curPointSubject.onCurve && nextPointSubject.onCurve && !curPointClip.onCurve) {
                        if (result = bezierSegmentSplit(
                            prevPointClip, curPointClip, nextPointClip,
                            curPointSubject, nextPointSubject)) {
                            Array.prototype.splice.apply(clipPath, [j, 1].concat(result));
                            j += result.length - 1;
                        }
                    }
                    // bezier 曲线与直线
                    else if (!curPointSubject.onCurve && curPointClip.onCurve && nextPointClip.onCurve) {
                        if (result = bezierSegmentSplit(
                            prevPointSubject, curPointSubject, nextPointSubject,
                            curPointClip, nextPointClip)) {
                            Array.prototype.splice.apply(subjectPath, [i, 1].concat(result));
                            i += result.length - 1;
                        }
                    }
                    // bezier 曲线之间相交
                    else if (!curPointSubject.onCurve && !curPointClip.onCurve) {
                        if (result = bezierSplit(
                            prevPointSubject, curPointSubject, nextPointSubject,
                            prevPointClip, curPointClip, nextPointClip)) {
                            Array.prototype.splice.apply(subjectPath, [i, 1].concat(result[0]));
                            Array.prototype.splice.apply(clipPath, [j, 1].concat(result[1]));
                            i += result[0].length - 1;
                            j += result[1].length - 1;
                        }
                    }
                }
            }
        }

        /**
         * 求路径交集、并集、差集
         *
         * @param {Array} paths 路径集合
         * @param {number} relation 关系
         * @return {Array} 合并后的路径
         */
        function pathJoin(paths, relation) {
            if (paths.length === 1) {
                if (relation === Relation.intersect) {
                    return [];
                }
                return paths;
            }

            // 计算bezier、直线的交点，分割bezier曲线
            var i;
            var l;
            for (i = 0, l = paths.length; i < l; i++) {
                paths[i] = interpolate(paths[i]);
            }

            for (i = 0, l = paths.length; i < l; i++) {
                for (var j = i + 1; j < l; j++) {
                    markIntersection(paths[i], paths[j]);
                }
            }

            var bezierHash = {};
            for (i = 0, l = paths.length; i < l; i++) {
                paths[i] = bezier2Segment(paths[i], bezierHash);
            }

            var clipper = new Clipper();
            for (var i = 0, l = paths.length - 1; i < l; i++) {
                clipper.addSubject(paths[i]);
            }
            clipper.addClip(paths[i]);

            paths = clipper.execute(relation);


            for (i = 0, l = paths.length; i < l; i++) {
                var path = paths[i];
                // 寻找第一个插值点
                var startIndex;
                for (var j = 0, jl = path.length; j < jl; j++) {
                    var start = bezierHash[getPointHash(path[j])];
                    if (start) {
                        if (j + 8 < jl) {
                            if (start === bezierHash[getPointHash(path[j + 8])]) {
                                startIndex = j;
                            }
                            else {
                                startIndex = j - 8 > 0 ? j - 8 : jl + j - 8;
                            }
                        }
                        else {
                            if (start === bezierHash[getPointHash(path[j - 8])]) {
                                startIndex = j - 8;
                            }
                            else {
                                startIndex = j;
                            }
                        }
                        break;
                    }
                }
                path = [].concat(path.slice(startIndex)).concat(path.slice(0, startIndex));

                // 移除插值点
                for (var j = 0; j < path.length; j++) {
                    var point = bezierHash[getPointHash(path[j])];
                    if (point) {
                        path.splice(j, 9, point);
                        j++;
                    }
                }
                paths[i] = deInterpolate(path);
            }

            return paths;
        }


        pathJoin.Relation = Relation;

        return pathJoin;
    }
);
