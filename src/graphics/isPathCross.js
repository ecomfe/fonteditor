/**
 * @file 判断路径的包含关系
 * @author mengke01(kekee000@gmail.com)
 */

import computeBoundingBox from './computeBoundingBox';
import getPathJoint from './join/getPathJoint';
import isInsidePath from './isInsidePath';
import isBoundingBoxCross from './isBoundingBoxCross';
import util from './pathUtil';

/**
 * 判断路径的包含关系
 *
 * @param {Array} path0 路径0
 * @param {Array} path1 路径1
 * @param {Object=} bound0 第一个路径边界
 * @param {Object=} bound1 第二个路径边界
 * @return {Array|number} 交点数组或者包含关系
 *
 * 2: path0 包含 path1
 * 3: path1 包含 path0
 * 4: 重叠
 */
export default function isPathCross(path0, path1, bound0, bound1) {
    bound0 = bound0 || computeBoundingBox.computePath(path0);
    bound1 = bound1 || computeBoundingBox.computePath(path1);

    if (isBoundingBoxCross(bound0, bound1)) {
        let result = getPathJoint(path0, path1);
        if (!result) {
            // 0 包含 1
            if (isInsidePath(path0, path1[0])) {
                return 2;
            }
            // 1 包含 0
            else if (isInsidePath(path1, path0[0])) {
                return 3;
            }
        }

        return util.removeOverlapPoints(result);
    }

    return false;
}
