/**
 * @file 寻找关键点
 * @author mengke01(kekee000@gmail.com)
 */

import pathUtil from 'graphics/pathUtil';
import vector from 'graphics/vector';
const getCos = vector.getCos;

const THETA_CORNER = 1.0; // 拐点抑制
const THRESHOLD_FAR_DIST = 80; // 远距离抑制
const THRESHOLD_LONG_DIST = 30; // 长距离抑制
const THRESHOLD_SHORT_DIST = 12; // 短距离抑制
const THRESHOLD_TINY_DIST = 3; // 微距离抑制，可能是噪音点

function dist(p0, p1) {
    return Math.sqrt(Math.pow(p0.x - p1.x, 2) + Math.pow(p0.y - p1.y, 2));
}


/**
 * 查找轮廓中的关键点
 *
 * @param  {Array} contour 轮廓点集合
 * @param  {number} scale scale
 * @return {Array}         轮廓点集合
 */
export default function getBreakPoints(contour, scale) {

    contour = pathUtil.makeLink(contour);

    let farDist = THRESHOLD_FAR_DIST * scale;
    let longDist = THRESHOLD_LONG_DIST * scale;
    let shortDist = THRESHOLD_SHORT_DIST * scale;
    let tinyDist = THRESHOLD_TINY_DIST * scale;

    let start = contour[0];
    let cur = start;

    // 标记距离和theta
    do {

        cur.ndist = cur.next.pdist = dist(cur, cur.next);

        // 距离比较近的点判断切角会不准确，需要特殊处理
        if (Math.abs(cur.x - cur.next.x) <= tinyDist && Math.abs(cur.y - cur.next.y) <= tinyDist) {
            cur.ntiny = true;
            cur.next.ptiny = true;
        }

        let cos = getCos(
            cur.ptiny ? cur.prev.prev : cur.prev,
            cur,
            cur.ntiny ? cur.next.next : cur.next
        );

        cur.theta = Math.acos(cos > 1 ? 1 : cos);

        // 判断水平和竖直线
        if (
            (Math.abs(cur.next.x - cur.x) < scale)
            && Math.abs(cur.next.y - cur.y) >= shortDist
        ) {
            cur.next.vertical = true;
            cur.vertical = true;
        }
        else if (
            (Math.abs(cur.next.y - cur.y) < scale)
            && Math.abs(cur.next.x - cur.x) >= shortDist
        ) {
            cur.next.hoz = true;
            cur.hoz = true;
        }

        // 判断边界点
        if (cur.x <= cur.prev.x && cur.x <= cur.next.x) {
            cur.xTop = true;
            cur.apex = true;
        }

        if (cur.y <= cur.prev.y && cur.y <= cur.next.y) {
            cur.yTop = true;
            cur.apex = true;
        }

        if (cur.x >= cur.prev.x && cur.x >= cur.next.x) {
            cur.xBottom = true;
            cur.apex = true;
        }

        if (cur.y >= cur.prev.y && cur.y >= cur.next.y) {
            cur.yBottom = true;
            cur.apex = true;
        }

        cur = cur.next;
    } while (cur !== start);



    cur = start;
    // 判断角点
    do {

        if (cur.theta > THETA_CORNER) {
            cur.corner = true;
            cur.visited = true;
            cur.breakPoint = true;
        }

        // 判断超长线段两端最好用直线连接
        if (
            !cur.visited && cur.theta > 0.3
            && (cur.ndist > farDist && cur.pdist > farDist || cur.pdist > farDist && cur.ndist > farDist)
        ) {
            cur.corner = true;
            cur.visited = true;
            cur.breakPoint = true;
        }

        if (!cur.visited && cur.apex && cur.theta > 0.5 && (cur.ndist > longDist || cur.pdist > longDist)) {
            cur.corner = true;
            cur.visited = true;
            cur.breakPoint = true;
        }

        // 判断折线段
        if (!cur.visited && cur.theta > 0.5 && (cur.ndist > longDist || cur.pdist > longDist)) {
            cur.corner = true;
            cur.visited = true;
            cur.breakPoint = true;
        }

        cur = cur.next;
    } while (cur !== start);

    // 判断是否存在角点，不存在角点则为连续弧线
    if (!contour.some(function (p) {
        return p.corner;
    })) {
        return false;
    }

    // 判断切线点
    cur = start;
    do {

        if (cur.visited) {
            cur = cur.next;
            continue;
        }

        // 判断切线点，但是不是连续切线点的情况
        if (!cur.visited && !cur.breakpoint && cur.theta < 0.5 && cur.theta > 0.2
            && (cur.pdist > longDist && cur.ndist < longDist || cur.ndist > longDist && cur.pdist < longDist)
        ) {
            cur.visited = true;
            cur.breakPoint = true;
        }

        cur = cur.next;
    } while (cur !== start);

    // 对特殊点做修复
    cur = start;
    do {

        // 修正直角连接点的x，y坐标
        if (cur.corner && cur.hoz && cur.vertical) {
            cur.x = (Math.abs(cur.prev.x - cur.x) <= scale) ? cur.prev.x : cur.next.x;
            cur.y = (Math.abs(cur.prev.y - cur.y) <= scale) ? cur.prev.y : cur.next.y;
        }
        // 修复比较小的顶角点为平滑点
        else if (cur.corner && cur.pdist < shortDist && cur.ndist < shortDist) {
            cur.tangency = true;
        }
        // 修复比较大的切线点位置，使曲线更平滑
        else if (cur.apex && cur.next.apex
            && cur.prev.theta < 0.4 && cur.next.theta < 0.4
            && cur.pdist > shortDist && cur.ndist > shortDist
        ) {
            let minus;
            // 修正切线点位置
            if (cur.xTop && cur.next.xTop || cur.xBottom && cur.next.xBottom) {
                minus = Math.max(Math.floor(Math.abs(cur.next.y - cur.y) / 4), 4 * scale);
                cur.y = cur.y > cur.next.y ? cur.y - minus : cur.y + minus;
                cur.next.y = cur.next.y > cur.y ? cur.next.y - minus : cur.next.y + minus;
            }

            if (cur.yTop && cur.next.yTop || cur.yBottom && cur.next.yBottom) {
                minus = Math.max(Math.floor(Math.abs(cur.next.x - cur.x) / 4), 4 * scale);
                cur.x = cur.x > cur.next.x ? cur.x - minus : cur.x + minus;
                cur.next.x = cur.next.x > cur.x ? cur.next.x - minus : cur.next.x + minus;
            }
        }


        cur = cur.next;
    } while (cur !== start);

    let breakPoints = contour.filter(function (p) {
        return p.breakPoint;
    });


    breakPoints.sort(function (a, b) {
        return a.index - b.index;
    });

    return breakPoints;
}
