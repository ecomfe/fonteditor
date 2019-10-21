/**
 * @file 线段切割路径
 * @author mengke01(kekee000@gmail.com)
 */

import path2contours from 'fonteditor-core/ttf/svg/path2contours';
import contours2svg from 'fonteditor-core/ttf/util/contours2svg';
import pathUtil from './pathUtil';
import reducePath from './reducePath';
const paper = window.paper;

function initPaper() {
    if (!paper.project) {
        paper.setup(document.createElement('canvas'));
    }
}

function getPath(contours) {
    // 根据contours获取paper.Path对象
    let d = contours2svg(contours);
    return new paper.CompoundPath(d);
}

function getContours(path) {
    // 根据path获取contours数组
    let d = path.getPathData();
    return path2contours(d);
}

/**
 * 线段切割路径
 *
 * @param {Array} paths 路径数组
 * @param {Object} p0 起始点
 * @param {Object} p1 结束点
 * @return {Array|false} 切割后路径或者false
 */
export default function pathSplitBySegment(paths, p0, p1) {
    initPaper();
    let subject = getPath(paths);
    let clipper = new paper.Path({
        segments: [
            [p0.x, p0.y],
            [p1.x, p1.y]
        ],
        closed: false
    });

    let intersections = subject.getIntersections(clipper); // 分割
    if (!intersections || !intersections.length) {
        return paths;
    }
    // 根据交点分割路径
    intersections.forEach(function (spliter) {
        let result = spliter.split();
    });
    // 闭合路径
    subject.children.forEach(function (path) {
        path.segments[0].clearHandles();
        path.segments[path.segments.length - 1].clearHandles();
        path.closePath();
    });
    subject.resolveCrossings().reorient();
    let contours = getContours(subject) ;
    paper.clear();

    // 清除重复的冗余节点
    for (let i = 0, l = contours.length; i < l; i++) {
        contours[i] = pathUtil.deInterpolate(contours[i]);
        contours[i] = reducePath(contours[i]);
    }
    return contours;
}
