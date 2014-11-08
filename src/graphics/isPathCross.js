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
        var getPathJoint = require('./join/getPathJoint');
        var isInsidePath = require('./isInsidePath');
        var isBoundingBoxCross = require('./isBoundingBoxCross');

        function hashcode(p) {
            return p.x / 7 + p.y / 13 + (p.x + p.y) / 17;
        }

        /**
         * 判断x轴射线是否穿过线段
         * 
         * @param {Array} path0 路径0
         * @param {Array} path1 路径1
         * @return {Array|number} 交点数组或者包含关系
         * 
         * 2: path0 包含 path1
         * 3: path1 包含 path0
         */
        function isPathCross(path0, path1, bound0, bound1) {
            bound0 = bound0 || computeBoundingBox.computePath(path0);
            bound1 = bound1 || computeBoundingBox.computePath(path1);

            var boundCross = isBoundingBoxCross(bound0, bound1);

            if (boundCross) {
                var result = getPathJoint(path0, path1);
                if (!result) {
                    // 0 包含 1
                    if (isInsidePath(path0, path1[0])) {
                        return 2;
                    }
                    // 1 包含 0
                    else if(isInsidePath(path1, path0[0])) {
                        return 3;
                    }
                }
                else {

                    // 对结果集合进行筛选，去除重复点
                    var hash = {};
                    for (var i = result.length - 1; i >= 0; i--) {
                        var p = result[i];
                        if (hash[hashcode(p)]) {
                            result.splice(i, 1);
                        }
                        else {
                            hash[hashcode(p)] = true;
                        }
                    }

                    if (result.length === 1) {
                        return false;
                    }

                    return result;
                }
            }

            return false;
        }

        return isPathCross;
    }
);
