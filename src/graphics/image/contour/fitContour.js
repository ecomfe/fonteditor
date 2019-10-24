/**
 * @file bezier曲线拟合2
 * @author mengke01(kekee000@gmail.com)
 */


import computeBoundingBox from 'graphics/computeBoundingBox';
import reducePoints from 'graphics/image/contour/reducePoints';
import vector from 'graphics/vector';
import findBreakPoints from './findBreakPoints';
import fitBezier from './fitBezier';
import fitOval from './fitOval';

function isNaNPoint(p) {
    return !isNaN(p.x) && !isNaN(p.y);
}

/**
 * 去除路径中的插值点
 *
 * @param {Array} path 路径
 * @param {number} scale 缩放
 * @return {Array} 路径
 */
function reducePath(path, scale) {
    let newPath = [];
    let delta = scale;
    for (let i = 0, l = path.length; i < l; i++) {
        let cur = path[i];
        let next = path[i === l - 1 ? 0 : i + 1];
        let prev = path[i === 0 ? l - 1 : i - 1];

        if (cur.onCurve
            && Math.abs(cur.x - next.x) < delta
            && Math.abs(cur.y - next.y) < delta
        ) {
            continue;
        }

        // 插值
        if (
            !prev.onCurve && cur.onCurve && !next.onCurve
            && Math.abs(2 * cur.x - prev.x - next.x) < delta
            && Math.abs(2 * cur.y - prev.y - next.y) < delta
        ) {
            continue;
        }

        newPath.push(cur);
    }

    return newPath;
}


/**
 * 判断轮廓是否圆
 *
 * @param  {Array}  contour contour
 * @return {boolean}
 */
function isCircle(contour) {
    let start = contour[0];
    let cur = start;
    let bound = computeBoundingBox.computeBounding(contour);

    if (Math.abs(bound.width - bound.height) / bound.width > 0.1) {
        return false;
    }

    do {
        if (Math.abs(cur.theta - cur.next.theta) > 0.15) {
            return false;
        }
        cur = cur.next;
    } while (cur !== start);
    return true;
}



/**
 * 拟合轮廓点曲线
 *
 * @param  {Array} data        轮廓点数组
 * @param  {number} scale       缩放级别
 * @param {?Object} options 参数
 * @return {Array}             拟合后轮廓
 */
export default function fitContour(data, scale = 1, options = {}) {
    let reducedData = reducePoints(data, 0, data.length - 1, scale);

    // 仅线段
    if (options.segment) {
        return reducedData.map(function (p) {
            return {
                x: p.x,
                y: p.y,
                onCurve: true
            };
        });
    }

    let breakPoints = findBreakPoints(reducedData, scale);
    let resultContour = [];

    if (false === breakPoints) {

        if (isCircle(reducedData)) {
            return fitOval(reducedData);
        }

        reducedData.forEach(function (p) {
            resultContour.push({
                x: p.x,
                y: p.y
            });
        });
    }
    else {
        let isLast;
        let start;
        let end;
        let curvePoints;
        let bezierCurve;

        for (let i = 0, l = breakPoints.length, j, jl; i < l; i++) {
            isLast = i === (l - 1);
            start = breakPoints[i];
            end = breakPoints[isLast ? 0 : i + 1];

            if (start.right === 1) {
                resultContour.push({
                    x: start.x,
                    y: start.y,
                    onCurve: true
                });
            }
            else {

                resultContour.push({
                    x: start.x,
                    y: start.y,
                    onCurve: !start.tangency
                });

                if (isLast) {
                    curvePoints = reducedData.slice(start.index)
                        .concat(reducedData.slice(0, end.index + 1));
                }
                else {
                    curvePoints = reducedData.slice(start.index, end.index + 1);
                }

                if (curvePoints.length <= 2) {
                    continue;
                }

                bezierCurve = fitBezier(curvePoints, scale);
                if (bezierCurve.length && bezierCurve.every(isNaNPoint)) {
                    for (j = 0, jl = bezierCurve.length - 1; j < jl; j++) {
                        resultContour.push({
                            x: bezierCurve[j].x,
                            y: bezierCurve[j].y,
                            onCurve: bezierCurve[j].onCurve
                        });
                    }
                }
                else {

                    for (j = 1, jl = curvePoints.length - 1; j < jl; j++) {
                        resultContour.push({
                            x: curvePoints[j].x,
                            y: curvePoints[j].y
                        });
                    }

                    // console.warn('error fitting curve');
                }
            }

        }
    }

    // 去除直线
    if (resultContour.length <= 2) {
        return [];
    }
    // 去除拟合后变成了直线轮廓
    else if (
        resultContour.length <= 4
        && vector.getDist(resultContour[0], resultContour[1], resultContour[2]) < scale
    ) {
        return [];
    }

    return reducePath(resultContour.map(function (p) {
        p.x = Math.round(p.x);
        p.y = Math.round(p.y);
        return p;
    }), scale);

}
