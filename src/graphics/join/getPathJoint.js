/**
 * @file 获取路径交点
 * @author mengke01(kekee000@gmail.com)
 */

import getJoint from './getJoint';
import pathIterator from '../pathIterator';

/**
 * 求两个路径的交点集合
 * @param {Array} path0 路径0
 * @param {Array} path1 路径1
 *
 * @return {Array} 交点数组
 */
export default function getPathJoint(path0, path1) {

    let joint = [];
    let result;
    pathIterator(path0, function (c, p0, p1, p2, i) {
        if (c === 'L') {
            result = getJoint(path1, 'L', p0, p1, 0, i);
        }
        else if (c === 'Q') {
            result = getJoint(path1, 'Q', p0, p1, p2, i);
        }

        if (result) {
            joint = joint.concat(result);
        }
    });

    return joint.length ? joint : false;
}
