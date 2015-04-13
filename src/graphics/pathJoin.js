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

        var Clipper = require('./join/Clipper');
        var Relation = require('./join/relation');
        var pathUtil = require('./pathUtil');
        var interpolate = pathUtil.interpolate;
        var deInterpolate = pathUtil.deInterpolate;

        var util = require('graphics/util');
        var ceilPoint = util.ceilPoint;

        var interpolatePathCrossBezier = require('./join/interpolatePathCrossBezier');
        var bezier2Segment = require('./join/bezier2Segment');
        var segment2Bezier = require('./join/segment2Bezier');
        var reducePath = require('./reducePath');

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
                paths[i].forEach(ceilPoint);
                paths[i] = interpolate(paths[i]);
            }

            // 计算bezier、直线的交点，分割bezier曲线
            for (i = 0, l = paths.length; i < l; i++) {
                for (var j = i; j < l; j++) {
                    interpolatePathCrossBezier(paths[i], paths[j]);
                }
            }

            var bezierHash = {};

            // 对曲线使用线段拟合，clipper求路径关系
            for (i = 0, l = paths.length; i < l; i++) {
                paths[i] = bezier2Segment(paths[i], bezierHash);
            }

            var clipper = new Clipper();
            clipper.addSubject(paths[0]);

            for (i = 1, l = paths.length; i < l; i++) {
                // 非相交可以不需要clip路径，相交则把最后一个路径作为相交路径
                if (relation === Relation.intersect || relation === Relation.tangency) {
                    clipper.addClip(paths[i]);
                }
                else {
                    clipper.addSubject(paths[i]);
                }
            }


            paths = clipper.execute(relation);
            if (Object.keys(bezierHash).length) {
                paths = segment2Bezier(paths, bezierHash);
            }

            return paths.filter(function (path) {
                return path.length > 2;
            }).map(function (path) {
                return reducePath(deInterpolate(path)).reverse();
            });
        }


        pathJoin.Relation = Relation;

        return pathJoin;
    }
);
