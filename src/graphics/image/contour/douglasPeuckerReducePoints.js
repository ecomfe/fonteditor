/**
 * @file 消减非必要的点
 * @author mengke01(kekee000@gmail.com)
 */

import vector from 'graphics/vector';

const THRESHOLD_DEFAULT = 1; // 默认消减点的阈值

function reduce(contour, firstIndex, lastIndex, threshold, splitArray) {

    if (lastIndex - firstIndex < 3) {
        return;
    }

    let start = contour[firstIndex];
    let end = contour[lastIndex];
    let splitIndex = -1;
    let maxDistance = 0;
    for (let i = firstIndex + 1; i < lastIndex; i++) {
        let dist = vector.getDist(start, end, contour[i]);
        if (dist > maxDistance) {
            maxDistance = dist;
            splitIndex = i;
        }
    }

    if (maxDistance > threshold) {
        splitArray.push(splitIndex);
        reduce(contour, firstIndex, splitIndex, threshold, splitArray);
        reduce(contour, splitIndex, lastIndex, threshold, splitArray);
    }
}


/**
 * 消减非必要的点
 *
 * @param  {Array} contour 轮廓点集
 * @param  {number} firstIndex   起始索引
 * @param  {number} lastIndex    结束索引
 * @param  {number} scale    缩放级别
 * @param  {number} threshold    消减阈值
 * @return {Array}  消减后的点集
 */
export default function reducePoint(contour, firstIndex = 0, lastIndex, scale, threshold) {
    lastIndex = lastIndex || contour.length - 1;
    threshold = threshold || THRESHOLD_DEFAULT * (scale || 1);
    let splitArray = [];

    reduce(contour, firstIndex, lastIndex, threshold, splitArray);

    if (splitArray.length) {
        splitArray.unshift(firstIndex);
        splitArray = splitArray.map(function (index) {
            contour[index].contourIndex = index;
            return contour[index];
        });

        splitArray.sort(function (a, b) {
            return a.contourIndex - b.contourIndex;
        });
        return splitArray;
    }

    return contour;
}
