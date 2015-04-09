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
        var relation = require('./join/relation');

        var util = require('./pathUtil');
        var interpolate = util.interpolate;
        var deInterpolate = util.deInterpolate;

        var pathJoin = require('./pathJoin');


        /**
         * 线段切割路径
         *
         * @param {Array} paths 路径数组
         * @param {Object} p0 起始点
         * @param {Object} p1 结束点
         * @return {Array|false} 切割后路径或者false
         */
        function pathSplitBySegment(paths, p0, p1) {

            var iterSplitPath = function (p) {
                p.index = p.index1;
                return p;
            };

            var leftSide = [];
            var rightSide = [];
            var leftPaths = [];
            var result;

            for (var i = 0, l = paths.length, j, jl; i < l; i++) {
                var path = interpolate(paths[i]);
                result = getSegmentPathJoint(path, p0, p1);

                if (result) {
                    var splitedPaths = pathSplit(path, result.map(iterSplitPath));
                    // 将分割后的路径分为左右两组
                    for (j = 0, jl = splitedPaths.length; j < jl; j++) {
                        var p2 = splitedPaths[j][1];

                        // 根据路径矢量关系确定点在左边还是右边
                        if ((p0.x - p2.x) * (p1.y - p2.y) - (p0.y - p2.y) * (p1.x - p2.x) > 0) {
                            leftSide.push(splitedPaths[j]);
                        }
                        else {
                            rightSide.push(splitedPaths[j]);
                        }
                    }
                }
                else {
                    leftPaths.push(paths[i]);
                }
            }

            // TODO 组合左右两侧的曲线段
            result = pathJoin(leftSide, relation.join).concat(pathJoin(rightSide, relation.join));
            result = leftPaths.concat(result);

            return result.map(function (path) {
                return deInterpolate(path);
            });
        }

        return pathSplitBySegment;
    }
);
