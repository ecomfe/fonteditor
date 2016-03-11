/**
 * @file 线段切割路径
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {
        var path2contours = require('fonteditor-core/ttf/svg/path2contours');
        var contours2svg = require('fonteditor-core/ttf/util/contours2svg');
        var pathUtil = require('./pathUtil');
        var reducePath = require('./reducePath');
        var paper = require('paper');



        function initPaper() {
            if (!paper.project) {
                paper.setup(document.createElement('canvas'));
            }
        }

        function getPath(contours) {
            // 根据contours获取paper.Path对象
            var d = contours2svg(contours);
            return new paper.CompoundPath(d);
        }

        function getContours(path) {
            // 根据path获取contours数组
            var d = path.getPathData();
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
        function pathSplitBySegment(paths, p0, p1) {
            initPaper();
            var subject = getPath(paths);
            var clipper = new paper.Path({
                segments: [
                    [p0.x, p0.y],
                    [p1.x, p1.y]
                ],
                closed: false
            });

            var intersections = subject.getIntersections(clipper); // 分割
            if (!intersections || !intersections.length) {
                return paths;
            }
            // 根据交点分割路径
            intersections.forEach(function (spliter) {
                var result = spliter.split();
            });
            // 闭合路径
            subject.children.forEach(function (path) {
                path.segments[0].clearHandles();
                path.segments[path.segments.length - 1].clearHandles();
                path.closePath();
            });
            subject.resolveCrossings().reorient();
            var contours = getContours(subject) ;
            paper.clear();

            // 清除重复的冗余节点
            for (var i = 0, l = contours.length; i < l; i++) {
                contours[i] = pathUtil.deInterpolate(contours[i]);
                contours[i] = reducePath(contours[i]);
            }
            return contours;
        }

        return pathSplitBySegment;
    }
);
