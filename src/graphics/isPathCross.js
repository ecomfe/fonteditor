/**
 * @file isPathCross.js
 * @author mengke01
 * @date 
 * @description
 * 判断路径的包含关系
 */

define(
    function(require) {
        var computeBoundingBox = require('./computeBoundingBox');
        var isSegmentCross = require('./isSegmentCross');
        var isBezierCross = require('./isBezierCross');
        var isBezierSegmentCross = require('./isBezierSegmentCross');
        var isInsidePath = require('./isInsidePath');
        var isBoundingBoxCross = require('./isBoundingBoxCross');
        var pathIterator = require('./pathIterator');

        /**
         * 求两个路径的交点集合 
         *
         */
        function getJoint(path, command, p0, p1, p2) {

            var joint = [];
            var result;
            pathIterator(path, function (c, t0, t1, t2) {
                if (c === 'L') {
                    if (command == 'L') {
                        result = isSegmentCross(p0, p1, t0, t1);
                    }
                    else if (command == 'Q') {
                        result = isBezierSegmentCross(p0, p1, p2, t0, t1, t2);
                    }
                }
                else if(c === 'Q') {
                    if (command == 'L') {
                        result = isBezierSegmentCross(
                                t0, t1, t2, p0, p1);
                    }
                    else if (command == 'Q') {
                        result = isBezierCross(t0, t1, t2, p0, p1, p2);
                    }
                }

                if (result) {
                    joint = joint.concat(result);
                }
            });

            return joint.length ? joint : false;
        }

        /**
         * 求两个路径的交点集合 
         *
         */
        function getPathJoint(path0, path1) {

            var joint = [];
            var result;
            pathIterator(path0, function (c, p0, p1, p2) {
                if (c === 'L') {
                    result = getJoint(path1, 'L', p0, p1);
                }
                else if(c === 'Q') {
                    result = getJoint(path1, 'Q', p0, p1, p2);
                }

                if (result) {
                    joint = joint.concat(result);
                }
            });

            return joint.length ? joint : false;
        }

        /**
         * 判断x轴射线是否穿过线段
         * 
         * @return {boolean|Array} 是否, 或者包含数组
         */
        function isPathCross(path0, path1, bound0, bound1) {
            bound0 = bound0 || computeBoundingBox.computePath(path0);
            bound1 = bound1 || computeBoundingBox.computePath(path1);

            var boundCross = isBoundingBoxCross(bound0, bound1);

            if (boundCross) {
                var result = getPathJoint(path0, path1);
                if (!result) {
                    // 0 包含 1
                    if (isInsidePath(path1, path0[0])) {
                        return 2;
                    }
                    // 1 包含 0
                    else if(isInsidePath(path0, path1[0])) {
                        return 3;
                    }
                }
                else {
                    return result;
                }
            }

            return false;
        }

        return isPathCross;
    }
);
