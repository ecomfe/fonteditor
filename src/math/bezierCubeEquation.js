/**
 * @file 求解三次方程贝塞尔根
 * @author mengke01(kekee000@gmail.com)
 */

import cubeEquation from './cubeEquation';

/**
 * 求解三次方程
 *
 * @param {number} a a系数
 * @param {number} b b系数
 * @param {number} c c系数
 * @param {number} d d系数
 * @return {Array|boolean} 系数解
 */
export default function bezierCubeEquation(a, b, c, d) {
    let result = cubeEquation(a, b, c, d);

    if (!result) {
        return result;
    }

    let filter = result.filter(function (item) {
        return item >= 0 && item <= 1;
    });

    return filter.length
        ? filter
        : false;
}
