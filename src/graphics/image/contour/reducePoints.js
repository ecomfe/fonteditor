/**
 * @file 消减点
 * @author mengke01(kekee000@gmail.com)
 */

import douglasPeuckerReducePoints from './douglasPeuckerReducePoints';
import pathUtil from '../../pathUtil';
import vector from '../../vector';



/**
 * 消减非必要的点
 *
 * @param  {Array} contour 轮廓点集
 * @param  {number} firstIndex   起始索引
 * @param  {number} lastIndex    结束索引
 * @param  {number} scale    缩放级别
 * @param  {number} threshold    消减阈值，see `douglasPeuckerReducePoints`
 * @return {Array}  消减后的点集
 */
export default function reducePoints(contour, firstIndex, lastIndex, scale, threshold) {
    let points = douglasPeuckerReducePoints(contour, firstIndex, lastIndex, scale, threshold);
    points = pathUtil.makeLink(points);

    let start = points[0];
    let tinyDist = 3 * scale;
    let rightAngle = Math.PI / 2;

    let cur = start;
    do {

        if (cur.visited) {
            cur = cur.next;
            continue;
        }

        if (Math.abs(cur.x - cur.next.x) <= tinyDist && Math.abs(cur.y - cur.next.y) <= tinyDist) {
            let cos = vector.getCos(
                cur.x - cur.prev.x,
                cur.y - cur.prev.y,
                cur.next.next.x - cur.next.x,
                    cur.next.next.y - cur.next.y
            );
            let theta = Math.acos(cos > 1 ? 1 : cos);
            // 小于直角则考虑移除点
            if (theta < rightAngle) {
                // 顶角
                if (
                    cur.x >= cur.prev.x && cur.x >= cur.next.x
                    || cur.x <= cur.prev.x && cur.x <= cur.next.x
                    || cur.y >= cur.prev.y && cur.y >= cur.next.y
                    || cur.y <= cur.prev.y && cur.y <= cur.next.y

                ) {
                    cur.next.deleted = true;
                }
                else {
                    cur.deleted = true;
                }
            }

            cur.visited = cur.next.visited = true;
        }

        cur = cur.next;
    } while (cur !== start);

    return points.filter(function (p) {
        delete p.visited;
        return !p.deleted;
    });
}
