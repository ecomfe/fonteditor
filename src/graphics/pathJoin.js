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

        var lang = require('common/lang');
        var Clipper = require('./join/Clipper');
        var Relation = require('./join/relation');
        var pathUtil = require('./pathUtil');
        var interpolate = pathUtil.interpolate;
        var deInterpolate = pathUtil.deInterpolate;

        var util = require('graphics/util');
        var ceilPoint = util.ceilPoint;

        var interpolatePathJoint = require('./join/interpolatePathJoint');


        var getBezierQ2Point = require('math/getBezierQ2Point');

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
                    curPoint = contour[i];
                    prevPoint = i === 0 ? contour[l - 1] : contour[i - 1];
                    nextPoint =  i === l - 1 ? contour[0] : contour[i + 1];
                    var firstPoint = ceilPoint(getBezierQ2Point(prevPoint, curPoint, nextPoint, 0.1));
                    var lastPoint = ceilPoint(getBezierQ2Point(prevPoint, curPoint, nextPoint, 0.9));
                    bezierHash[getPointHash(firstPoint)] = curPoint;
                    bezierHash[getPointHash(lastPoint)] = curPoint;

                    result.push(firstPoint);
                    for (var j = 2; j < 9; j++) {
                        result.push(ceilPoint(getBezierQ2Point(prevPoint, curPoint, nextPoint, j * 0.1)));
                    }
                    result.push(lastPoint);
                }
                else {
                    result.push(contour[i]);
                }
            }
            return result;
        }


        function getPointHash(p) {
            return Math.floor(7 * Math.floor(p.x * 100) + 31 * Math.floor(p.y * 100));
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

            var i;
            var l;
            // 对路径进行插值，求舍入
            for (i = 0, l = paths.length; i < l; i++) {
                paths[i].forEach(function (p) {
                    ceilPoint(p);
                });

                paths[i] = interpolate(paths[i]);
            }

            // 计算bezier、直线的交点，分割bezier曲线
            for (i = 0, l = paths.length; i < l; i++) {
                for (var j = i + 1; j < l; j++) {
                    interpolatePathJoint(paths[i], paths[j]);
                }
            }

            // return lang.clone(paths);

            var bezierHash = {};
            // 对曲线使用线段拟合，clipper求路径关系
            for (i = 0, l = paths.length; i < l; i++) {
                paths[i] = bezier2Segment(paths[i], bezierHash);
            }

            var clipper = new Clipper();
            for (var i = 0, l = paths.length - 1; i < l; i++) {
                clipper.addSubject(paths[i]);
            }
            clipper.addClip(paths[i]);

            paths = clipper.execute(relation);

            // 重新转换成曲线路径
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
                            startIndex = j - 8 > 0 ? j - 8 : jl + j - 8;
                            if (start !== bezierHash[getPointHash(path[startIndex])]) {
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
