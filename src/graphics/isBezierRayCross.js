/**
 * @file 判断x轴射线是否与贝塞尔曲线相交
 * @author mengke01(kekee000@gmail.com)
 */

import isBezierLineCross from './isBezierLineCross';

/**
 * 判断x轴射线是否与贝塞尔曲线相交
 * @param {Object} p0 起点
 * @param {Object} p1 控制点
 * @param {Object} p2 终点
 * @param {Object} p 射线起点
 * @return {Array|boolean} 交点数组或者false
 */
export default function isBezierRayCross(p0, p1, p2, p) {

    // 3点都在同一侧
    if (0 === ((p0.y > p.y) + (p1.y > p.y) + (p2.y > p.y)) % 3) {
        return false;
    }

    let result = isBezierLineCross(p0, p1, p2, p, {x: 100000, y: p.y});
    if (result) {
        let filter = result.filter(function (item) {
            return item.x >= p.x;
        });
        return filter.length ? filter : false;
    }

    return false;
}
