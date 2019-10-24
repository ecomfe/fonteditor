/**
 * @file 求boundingbox和线段的关系
 * @author mengke01(kekee000@gmail.com)
 */


import {isPointInBound} from './util';
import isSegmentCross from './isSegmentCross';

/**
 * 求boundingbox和线段的关系
 *
 * @param {Object} bound bounding box
 * @param {Object} s0 线段点1
 * @param {Object} s1 线段点2
 * @return {boolean} 是否相交
 */
export default function isBoundingBoxSegmentCross(bound, s0, s1) {
    if (isPointInBound(bound, s0) || isPointInBound(bound, s1)) {
        return true;
    }

    if (
        isSegmentCross(bound, {x: bound.x, y: bound.y + bound.height}, s0, s1)
        || isSegmentCross(bound, {x: bound.x + bound.width, y: bound.y}, s0, s1)
        || isSegmentCross(
            {x: bound.x + bound.width, y: bound.y},
            {x: bound.x + bound.width, y: bound.y + bound.height},
            s0, s1)
        || isSegmentCross(
            {x: bound.x, y: bound.y + bound.height},
            {x: bound.x + bound.width, y: bound.y + bound.height},
            s0, s1)
    ) {
        return true;
    }

    return false;
}
