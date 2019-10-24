/**
 * @file 获取贝塞尔曲线的参数t
 * @author mengke01(kekee000@gmail.com)
 */

import bezierQ2Equation from './bezierQ2Equation';
import getPoint from './getBezierQ2Point';

/**
 * 获取贝塞尔曲线的参数t
 *
 * @param {Object} p0 p0
 * @param {Object} p1 p1
 * @param {Object} p2 p2
 * @param {Object} p 分割点
 * @return {number} t值
 */
export default function getBezierQ2T(p0, p1, p2, p) {

    // 极端情况
    if (Math.abs(p.x - p0.x) < 0.001 && Math.abs(p.y - p0.y) < 0.001) {
        return 0;
    }
    else if (Math.abs(p.x - p2.x) < 0.001 && Math.abs(p.y - p2.y) < 0.001) {
        return 1;
    }

    let result = bezierQ2Equation(
        p0.x + p2.x - 2 * p1.x + p0.y + p2.y - 2 * p1.y,
        2 * (p1.x - p0.x) + 2 * (p1.y - p0.y),
        p0.x + p0.y - p.x - p.y
    );

    if (!result) {
        return false;
    }

    let t = false;

    // 这里需要验证下，有些情况下公式有解，但是点不在曲线上。。
    for (let i = 0, l = result.length; i < l; i++) {
        let pt = getPoint(p0, p1, p2, result[i]);
        if (Math.abs(pt.x - p.x) < 0.001 && Math.abs(pt.y - p.y) < 0.001) {
            t = result[i];
            break;
        }
    }

    return t;
}
