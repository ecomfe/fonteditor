/**
 * @file 判断贝塞尔曲线与直线相交
 * @author mengke01(kekee000@gmail.com)
 */

import bezierQ2Equation from '../math/bezierQ2Equation';
import {ceilPoint} from './util';

/**
 * 判断贝塞尔曲线与直线相交
 *
 * @param {Object} p0 起点
 * @param {Object} p1 控制点
 * @param {Object} p2 终点
 * @param {Object} s0 直线点1
 * @param {Object} s1 直线点2
 * @return {Array.<Object>|boolean} 交点数组或者false
 */
export default function isBezierLineCross(p0, p1, p2, s0, s1) {

    // y = kx + b
    // x = at^2 + bt + c
    // y = dt^2 + et + f
    // (ka-d)t^2 + (kb-e)t + (kc+b-f) = 0
    let result;

    // 垂直x
    if (s0.y === s1.y) {
        result = bezierQ2Equation(
            p0.y  + p2.y - 2 * p1.y,
            2 * (p1.y - p0.y),
            p0.y - s0.y
        );
    }
    // 垂直y
    else if (s0.x === s1.x) {
        result = bezierQ2Equation(
            p0.x  + p2.x - 2 * p1.x,
            2 * (p1.x - p0.x),
            p0.x - s0.x
        );
    }
    else {

        let k = (s1.y - s0.y) / (s1.x - s0.x);
        let b1 = s0.y - k * s0.x;

        let a = p0.x  + p2.x - 2 * p1.x;
        let b = 2 * (p1.x - p0.x);
        let c = p0.x;

        let d = p0.y  + p2.y - 2 * p1.y;
        let e = 2 * (p1.y - p0.y);
        let f = p0.y;

        result = bezierQ2Equation(
            k * a - d,
            k * b - e,
            k * c + b1 - f
        );
    }

    if (result) {
        return result.sort(function (t1, t2) {
            return t1 - t2;
        }).map(function (t) {
            return ceilPoint({
                x: p0.x * Math.pow(1 - t, 2) + 2 * p1.x * t * (1 - t) + p2.x * Math.pow(t, 2),
                y: p0.y * Math.pow(1 - t, 2) + 2 * p1.y * t * (1 - t) + p2.y * Math.pow(t, 2)
            });
        });
    }

    return false;
}
