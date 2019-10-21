/**
 * @file 获取曲线段和路径的交点
 * @author mengke01(kekee000@gmail.com)
 */

import isSegmentCross from '../isSegmentCross';
import isBezierCross from '../isBezierCross';
import isBezierSegmentCross from '../isBezierSegmentCross';
import pathIterator from '../pathIterator';

function hashcode(p) {
    return (p.x * 31 + p.y) * 31;
}


/**
 * 求路径和曲线段的交点集合
 * @param {Array} path 路径
 * @param {string} command 命令
 * @param {Object} p0 p0
 * @param {Object} p1 p1
 * @param {Object=} p2 p2，如果为直线则p2不使用
 * @param {number=} index 曲线段的索引
 *
 * @return {Array} 交点数组
 */
export default function getJoint(path, command, p0, p1, p2, index) {

    let joint = [];
    let result;
    pathIterator(path, function (c, t0, t1, t2, j) {
        if (c === 'L') {
            if (command === 'L') {
                result = isSegmentCross(p0, p1, t0, t1);
            }
            else if (command === 'Q') {
                result = isBezierSegmentCross(p0, p1, p2, t0, t1, t2);
            }
        }
        else if (c === 'Q') {
            if (command === 'L') {
                result = isBezierSegmentCross(
                        t0, t1, t2, p0, p1);
            }
            else if (command === 'Q') {
                result = isBezierCross(t0, t1, t2, p0, p1, p2);
            }
        }

        if (result) {
            joint = joint.concat(result.map(function (p) {
                p.index0 = index; // 第一个path交点的索引
                p.index1 = j; // 第二个path交点的索引
                return p;
            }));
        }
    });

    // 对结果集合进行筛选，去除重复点
    let hash = {};
    for (let i = joint.length - 1; i >= 0; i--) {
        let p = joint[i];
        if (hash[hashcode(p)]) {
            joint.splice(i, 1);
        }
        else {
            hash[hashcode(p)] = true;
        }
    }

    return joint.length ? joint : false;
}
