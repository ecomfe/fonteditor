/**
 * @file 路径的布尔操作，使用paper.js进行路径操作
 * @author mengke01(kekee000@gmail.com)
 */

define(function (require) {
    var contours2svg = require('fonteditor-core/ttf/util/contours2svg');
    var path2contours = require('fonteditor-core/ttf/svg/path2contours');
    var reducePath = require('./reducePath');
    var paper = require('paper');

    var RELATION = {
        intersect: 0, // 相交
        join: 1, // 合并
        differ: 2, // 不同
        tangency: 3 // 相切
    };

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
     * 路径布尔操作
     *
     * @param  {Array} paths    路径集合
     * @param  {number} relation 路径关系
     * @return {Array}          操作后结果
     */
    function pathBoolean(paths, relation) {
        if (paths.length < 2) {
            return paths;
        }
        initPaper();

        // 设置最后一个contour为切分路径
        var subject = getPath(paths.slice(0, paths.length - 1));
        var clipper = getPath(paths.slice(paths.length - 1));
        var resultPath;
        if (relation === RELATION.intersect) {
            resultPath = subject.intersect(clipper);
        }
        else if (relation === RELATION.join) {
            resultPath = subject.unite(clipper);
        }
        else if (relation === RELATION.differ) {
            resultPath = subject.subtract(clipper);
        }
        else if (relation === RELATION.tangency) {
            resultPath = subject.exclude(clipper);
        }

        var contours = resultPath ? getContours(resultPath) : paths;
        paper.clear();

        // 清除重复的冗余节点
        for (var i = 0, l = contours.length; i < l; i++) {
            contours[i] = reducePath(contours[i]);
        }

        return contours;
    }

    pathBoolean.Relation = RELATION;

    return pathBoolean;
});
