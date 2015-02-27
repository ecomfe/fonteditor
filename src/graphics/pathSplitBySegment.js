/**
 * @file pathSplitBySegment.js
 * @author mengke01
 * @date
 * @description
 * 线段切割路径
 */


define(
    function (require) {

        var getSegmentPathJoint = require('./join/getSegmentPathJoint');
        var pathSplit = require('./join/pathSplit');
        var util = require('./pathUtil');
        var interpolate = util.interpolate;
        var deInterpolate = util.deInterpolate;
        var util = require('graphics/util');
        var isPointOverlap = util.isPointOverlap;
        var getPointHash = util.getPointHash;

        /**
         * 线段切割路径
         *
         * @param {Array} paths 路径数组
         * @param {Object} p0 起始点
         * @param {Object} p1 结束点
         * @return {Array|false} 切割后路径或者false
         */
        function pathSplitBySegment(paths, p0, p1) {

            var i = 0;
            var l = paths.length;
            var leftSide = [];
            var rightSide = [];
            var jointArray = [];

            for (; i < l; i++) {
                var path = interpolate(paths[i]);
                var result = getSegmentPathJoint(path, p0, p1);
                if (result) {

                    var splitedPaths = pathSplit(path, result.map(function (p) {

                        p.from = i;
                        p.index = p.index1;

                        var cur = path[p.index];
                        var next = path[p.index === path.length - 1 ? 0 : p.index + 1];
                        // bezier曲线起始点
                        if (!cur.onCurve) {
                            cur = path[p.index === 0 ? path.length - 1 : p.index - 1];
                            next = path[p.index === path.length - 1 ? 0 : p.index + 1];
                        }
                        // 求zCount
                        p.zCount = (p.zCount || 0)
                            + (
                                (p.x - cur.x > 0 && p.x - next.x < 0)
                                || Math.abs(p.x - cur.x) < 0.001 && (p.y - cur.y > 0 && p.y - next.y < 0)
                                ? -1 : 1
                            );
                        jointArray.push(p);

                        return p;
                    }));

                    // 将分割后的路径分为左右两组
                    // http://blog.csdn.net/modiz/article/details/9928955
                    splitedPaths.forEach(function (path) {
                        var p2 = path[1];
                        if ((p0.x - p2.x) * (p1.y - p2.y) - (p0.y - p2.y) * (p1.x - p2.x) > 0) {
                            leftSide.push(path);
                        }
                        else {
                            rightSide.push(path);
                        }
                    });
                }
            }

            if (jointArray.length <= 1) {
                return paths;
            }

            // 交点按照距离原点顺序排序
            if (p0.x === p1.x) {
                jointArray = jointArray.sort(function (a, b) {
                    return a.y - b.y;
                });
            }
            else {
                jointArray = jointArray.sort(function (a, b) {
                    return a.x - b.x;
                });
            }

            //console.log(jointArray);

            // 按照 no-zero 规则获取交点线段
            var start = jointArray[0];
            var zCount = start.zCount;
            var jointSegment = [];
            for (i = 1, l = jointArray.length; i < l; i++) {
                zCount += jointArray[i].zCount;
                if (!zCount) {
                    jointSegment.push([start, jointArray[i]]);
                    start = jointArray[++i];
                    zCount = start ? start.zCount : 0;
                }
            }

            // TODO 组合左右两侧的曲线段
            console.log(jointSegment);
            console.log(leftSide);
            console.log(rightSide);


            return paths.map(function (path) {
                return deInterpolate(path);
            });
        }

        return pathSplitBySegment;
    }
);
