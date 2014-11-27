/**
 * @file isPathOverlap.js
 * @author mengke01
 * @date 
 * @description
 * 路径是否重叠
 */


define(
    function(require) {
        var computeBoundingBox = require('./computeBoundingBox');
        var isOnPath = require('./isOnPath');
        var isBoundingBoxCross = require('./isBoundingBoxCross');
        var getPointHash = require('./util').getPointHash;
        var pathIterator = require('./pathIterator');
        var getPoint = require('math/getBezierQ2Point');

        function isPathPointsOverlap(path0, path1) {
            var hash = {};
            path1.forEach(function(p) {
                hash[getPointHash(p)] = true;
            });

            var overlapCount = 0;
            path0.forEach(function(p) {
                if (hash[getPointHash(p)]) {
                    overlapCount++;
                }
            });

            return overlapCount === path0.length;
        }

        function isPathPointsOn(path0, path1) {
            var zCount = 0; 
            var length = path1.length;
            pathIterator(path0, function (c, p0, p1, p2) {
                if (c === 'L') {
                    
                    // 这里需要判断，直线重叠的情况
                    // TODO 需要判断是否是直线重叠，这里没有做判断
                    var i0 = isOnPath(path1, p0);
                    var i1 = isOnPath(path1, p1);
                    if (false === i0 || false === i1 || i0 !== i1) {
                        return false;
                    }
                    zCount++;
                }
                else if(c === 'Q') {
                    // 这里需要判断，bezier曲线重叠的情况
                    // 需要判断是否是bezier曲线重叠，这里没有做判断
                    var i0 = isOnPath(path1, p0);
                    var i1 = isOnPath(path1, p2);
                    var i2 = isOnPath(path1, getPoint(p0, p1, p2, 0.5));
                    if (false === i0 || false === i1 || false === i2) {
                        return false;
                    }
                    zCount++;
                }
            });

            return zCount === path0.length;
        }

        /**
         * 判断路径是否重叠，需要注意的是，路径应该是经过插值之后的，否则会出现判断错误
         * 
         * @return {boolean} 是否重叠
         */
        function isPathOverlap(path0, path1, bound0, bound1) {
            bound0 = bound0 || computeBoundingBox.computePath(path0);
            bound1 = bound1 || computeBoundingBox.computePath(path1);

            if (isBoundingBoxCross(bound0, bound1)) {

                // 按点个数排下序
                if (path1.length < path0.length) {
                    var tmp = path1;
                    path1 = path0;
                    path0 = tmp;
                }

                // 是否点重叠
                if (isPathPointsOverlap(path0, path1) || isPathPointsOverlap(path1, path0)) {
                    return true;
                }

                // 是否点都在另一路径上
                if (isPathPointsOn(path0, path1) || isPathPointsOn(path1, path0)) {
                    return true;
                }
            }

            return false;
        }

        return isPathOverlap;
    }
);
