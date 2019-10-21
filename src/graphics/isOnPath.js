/**
 * @file 判断点是否在路径上
 * @author mengke01(kekee000@gmail.com)
 */

import pathIterator from './pathIterator';
import getBezierQ2T from 'math/getBezierQ2T';

/**
 * 判断点是否在path上
 *
 * @param {Object} path path对象
 * @param {Object} p 点对象
 * @return {boolean|number} 是否在path上，如果在的话，返回起点索引号
 */
export default function isOnPath(path, p) {
    let zCount = false;
    pathIterator(path, function (c, p0, p1, p2, i) {
        if (c === 'L') {
            if (Math.abs((p.y - p0.y) * (p.x - p1.x) - (p.y - p1.y) * (p.x - p0.x)) <= 0.001) {
                zCount = i;
                return false;
            }
        }
        else if (c === 'Q') {
            if (false !== getBezierQ2T(p0, p1, p2, p)) {
                zCount = i;
                return false;
            }
        }
    });

    return zCount;
}
