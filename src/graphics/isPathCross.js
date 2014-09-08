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

        /**
         * 求两个路径的交点集合 
         *
         */
        function getJoint(path, command, p0, p1, p2) {

            var i = -1;
            var l = path.length;
            var prev, point;
            var joint = [];
            var result;

            while (++i < l) {

                result = false;
                point = path[i];

                switch (point.c) {
                    case 'L':
                        if (command == 'L') {
                            result = isSegmentCross(p0, p1, prev, point.p);
                        }
                        else if (command == 'Q') {
                            result = isBezierSegmentCross(p0, p1, p2, prev, point.p);
                        }
                        
                        // if(result) {
                        //     console.log(p0, p1, p2, prev, point.p);
                        // }
                        break;
                    case 'Q':
                        if (command == 'L') {
                            result = isBezierSegmentCross(
                                    prev, point.p1, point.p, p0, p1);
                        }
                        else if (command == 'Q') {
                            result = isBezierCross(prev, point.p1, point.p, p0, p1, p2);
                        }

                        // if(result) {
                        //     console.log(prev, point.p1, point.p, p0, p1, p2);
                        // }
                        break;
                }
                
                if (result) {
                    joint = joint.concat(result);
                }

                prev = point.p;
            }

            return joint.length ? joint : false;
        }

        /**
         * 求两个路径的交点集合 
         *
         */
        function getPathJoint(path0, path1) {

            var i = -1;
            var l = path0.length;
            var prev, point;
            var joint = [];
            var result;

            while (++i < l) {
                result = false;
                point = path0[i];
                switch (point.c) {
                    case 'L':
                        result = getJoint(path1, 'L', prev, point.p);
                        break;
                    case 'Q':
                        result = getJoint(path1, 'Q', prev, point.p1, point.p);
                        break;
                }
                
                if (result) {
                    joint = joint.concat(result);
                }

                prev = point.p;
            }

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
                    if (isInsidePath(path1, path0[0].p)) {
                        return 2;
                    }
                    // 1 包含 0
                    else if(isInsidePath(path0, path1[0].p)) {
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
