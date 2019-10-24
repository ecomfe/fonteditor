/**
 * @file 分割二次贝塞尔曲线
 * @author mengke01(kekee000@gmail.com)
 */

import getBezierQ2T from './getBezierQ2T';
import getPoint from './getBezierQ2Point';

/**
 * 分割贝塞尔曲线
 *
 * @param {Object} p0 p0
 * @param {Object} p1 p1
 * @param {Object} p2 p2
 * @param {number|Object} point 分割点t或者坐标
 * @return {Array} 分割后的贝塞尔
 */
export default function bezierQ2Split(p0, p1, p2, point) {
    var t;
    var p;

    if (typeof point === 'number') {
        t = point;
        p = getPoint(p0, p1, p2, t);
    }
    else if (typeof point === 'object') {
        p = point;
        t = getBezierQ2T(p0, p1, p2, p);

        if (false === t) {
            return false;
        }
    }

    if (t === 0 || t === 1) {
        return [[p0, p1, p2]];
    }

    return [
        [
            p0,
            {
                x: p0.x + (p1.x - p0.x) * t,
                y: p0.y + (p1.y - p0.y) * t
            },
            p
        ],
        [
            p,
            {
                x: p1.x + (p2.x - p1.x) * t,
                y: p1.y + (p2.y - p1.y) * t
            },
            p2
        ]
    ];
}
