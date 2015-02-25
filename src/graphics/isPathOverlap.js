/**
 * @file isPathOverlap.js
 * @author mengke01
 * @date
 * @description
 * 路径是否重叠
 */


define(
    function (require) {
        var computeBoundingBox = require('./computeBoundingBox');
        var util = require('./pathUtil');
        var getPathHash = util.getPathHash;

        /**
         * 判断路径是否重叠，需要注意的是，路径应该是经过插值之后的，否则会出现判断错误
         *
         * @param {Array} path0 path0
         * @param {Array} path1 path1
         * @param {Object=} bound0 第一个路径边界
         * @param {Object=} bound1 第二个路径边界
         * @return {number} 0不重叠，1 部分重叠，2 完全重叠
         */
        function isPathOverlap(path0, path1, bound0, bound1) {
            bound0 = bound0 || computeBoundingBox.computePath(path0);
            bound1 = bound1 || computeBoundingBox.computePath(path1);

            if (isBoundingBoxCross(bound0, bound1)) {
                if (getPathHash(path0) === getPathHash(path1)) {
                    return 2;
                }
            }

            return 0;
        }

        return isPathOverlap;
    }
);
