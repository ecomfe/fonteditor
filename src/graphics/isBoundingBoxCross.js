/**
 * @file 求两个boundingbox的关系
 * @author mengke01(kekee000@gmail.com)
 */

import {isPointInBound} from './util';


/**
 * 求两个boundingbox的关系
 *
 * @param {Object} b1 bounding 1
 * @param {Object} b2 bounding 2
 * @return {number} 包含关系
 *
 * 2 :  b2 包含 b1
 * 3 :  b1 包含 b2
 * 1 :  有交点
 */
export default function isBoundingBoxCross(b1, b2) {
    let b1lt = isPointInBound(b2, b1, true); // 左上
    let b1rt = isPointInBound(b2, {x: b1.x + b1.width, y: b1.y}, true); // 右上
    let b1lb = isPointInBound(b2, {x: b1.x, y: b1.y + b1.height}, true); // 左下
    let b1rb = isPointInBound(b2, {x: b1.x + b1.width, y: b1.y + b1.height}, true); // 右下

    // b2 包含 b1
    if (b1lt && b1rt && b1lb && b1rb) {
        return 2;
    }

    let b2lt = isPointInBound(b1, b2, true); // 左上
    let b2rt = isPointInBound(b1, {x: b2.x + b2.width, y: b2.y}, true); // 右上
    let b2lb = isPointInBound(b1, {x: b2.x, y: b2.y + b2.height}, true); // 左下
    let b2rb = isPointInBound(b1, {x: b2.x + b2.width, y: b2.y + b2.height}, true); // 右下

    // b1 包含 b2
    if (b2lt && b2rt && b2lb && b2rb) {
        return 3;
    }

    // 无交点
    if (false === (b1lt || b1rt || b1lb || b1rb || b2lt || b2rt || b2lb || b2rb)) {
        // 判断十字架
        if (
            (b1.x > b2.x && b1.x < b2.x + b2.width)
            || (b1.y > b2.y && b1.y < b2.y + b2.height)
        ) {
            return 1;
        }

        return false;
    }

    // 有交点
    return 1;
}
