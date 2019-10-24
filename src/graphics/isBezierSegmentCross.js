/**
 * @file 判断贝塞尔曲线与线段相交
 * @author mengke01(kekee000@gmail.com)
 */

import computeBoundingBox from './computeBoundingBox';
import isBezierLineCross from './isBezierLineCross';
import isBoundingBoxCross from './isBoundingBoxCross';
import {isPointInBound} from './util';

/**
 * 判断贝塞尔曲线与线段相交
 *
 * @param {Object} p0 起点
 * @param {Object} p1 控制点
 * @param {Object} p2 终点
 * @param {Object} s0 线段点1
 * @param {Object} s1 线段点2
 * @return {Array.<Object>|boolean} 交点数组或者false
 */
export default function isBezierSegmentCross(p0, p1, p2, s0, s1) {
    let b1 = computeBoundingBox.quadraticBezier(p0, p1, p2);
    let bound = {
        x: Math.min(s0.x, s1.x),
        y: Math.min(s0.y, s1.y),
        width: Math.abs(s0.x - s1.x),
        height: Math.abs(s0.y - s1.y)
    };

    if (isBoundingBoxCross(b1, bound)) {
        let result = isBezierLineCross(p0, p1, p2, s0, s1);
        if (result) {
            return result.filter(function (p) {
                return isPointInBound(bound, p, true);
            });
        }
    }

    return false;
}
