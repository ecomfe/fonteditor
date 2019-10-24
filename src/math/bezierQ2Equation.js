/**
 * @file 求解二次方程贝塞尔根
 * @author mengke01(kekee000@gmail.com)
 */

import quadraticEquation from './quadraticEquation';

/**
 * 求解二次方程贝塞尔根
 *
 * @param {number} a a系数
 * @param {number} b b系数
 * @param {number} c c系数
 * @return {Array|boolean} 系数解
 */
export default function bezierQ2Equation(a, b, c) {
    let result = quadraticEquation(a, b, c);

    if (!result) {
        return result;
    }

    let filter = result.filter(function (item) {
        return item >= 0 && item <= 1;
    });

    return filter.length ? filter : false;
}
