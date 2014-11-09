/**
 * @file pathSplitBySegment.js
 * @author mengke01
 * @date 
 * @description
 * 线段切割路径
 */


define(
    function(require) {

        var computeBoundingBox = require('./computeBoundingBox');
        var getJoint = require('./join/getJoint');
        var pathSplit = require('./join/pathSplit');
        var isBoundingBoxSegmentCross = require('./isBoundingBoxSegmentCross');
        var interpolate = require('./join/interpolate');
        var deInterpolate = require('./join/deInterpolate');
        var util = require('./util');

        /**
         * 线段切割路径
         * 
         * @param {Array} path 路径
         * @param {Object} p0 起始点
         * @param {Object} p1 结束点
         * @return {Array|false} 切割后路径或者false
         */
        function pathSplitBySegment(path, p0, p1) {

            var bound = computeBoundingBox.computePath(path);

            // 判断是否相交
            if (!isBoundingBoxSegmentCross(bound, p0, p1)) {
                return false;
            }

            path = interpolate(path);
            var result = getJoint(path, 'L', p0, p1);

            // 有交点
            if (result && result.length > 1) {

                var splitedPaths = pathSplit(path, result.map(function(p) {
                    p.index = p.index1;
                    return p;
                }));


                // 轮廓为凹的需要寻找可以合并的轮廓
                var last = splitedPaths.length - 1;
                splitedPaths[last].direction = util.isClockWise(splitedPaths[last]);
                for (var i = last - 1; i > 0; i--) {
                    splitedPaths[i].direction = util.isClockWise(splitedPaths[i]);
                    if (splitedPaths[i].direction !== splitedPaths[i + 1].direction) {
                        var prevPrev = i === last - 1 ? 0 : i + 2;
                        var newPath = splitedPaths[prevPrev].concat(splitedPaths[i]);
                        newPath.direction = splitedPaths[i + 1].direction;
                        if (prevPrev === 0) {
                            splitedPaths[0] = newPath;
                            splitedPaths.splice(i, 1);
                        }
                        else {
                            splitedPaths[i] = newPath;
                            splitedPaths.splice(prevPrev, 1);
                        }
                    }
                }


                return splitedPaths.map(function(path) {
                    return deInterpolate(path);
                });
            }

            return false;
        }

        return pathSplitBySegment;
    }
);
