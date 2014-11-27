/**
 * @file join2Path.js
 * @author mengke01
 * @date 
 * @description
 * 合并2个路径
 */


define(
    function(require) {

        var isPathCross = require('../isPathCross');
        var isInsidePath = require('../isInsidePath');
        //var isPathOverlap = require('../isPathOverlap');
        var getBezierQ2Point = require('math/getBezierQ2Point');
        var util = require('../util');
        var Relation = require('./relation');
        var interpolate = require('./interpolate');
        var pathSplit = require('./pathSplit');
        var pathCombine = require('./pathCombine');

        /**
         * 获取另一个路径和分割路径的交点情况
         * 
         * @param {Array} path 要比较的路径
         * @param {Array} splitedPath 分割后的路径
         * @return {boolean} 是否相交
         */
        function getPathCross(path, splitedPath) {

            // if (isPathOverlap(splitedPath, path)) {
            //     return 0;
            // }

            var inPath = isInsidePath(
                path, 
                splitedPath[1].onCurve 
                    ? splitedPath[1]
                    : getBezierQ2Point(splitedPath[0], splitedPath[1], splitedPath[2], 0.5)
            );
            return inPath ? 1 : 0;
        }

        /**
         * 求路径并集
         * 
         * @param {Object} path0 路径对象
         * @param {Object} path1 路径对象
         * @param {number} relation 关系
         * @return {Array} 新的路径集合
         */
        function join2Path(path0, path1, relation) {
            // 方向， 0 顺时针， 1 逆时针
            var direction0 = util.isClockWise(path0);
            var direction1 = util.isClockWise(path1);

            var newPath0 = interpolate(path0);
            var newPath1 = interpolate(path1);
            var joint = isPathCross(newPath0, newPath1);
            var splitedPaths0;
            var splitedPaths1;

            // 获取组合后的路径
            var getJoinedPath = function(joint) {

                splitedPaths0 = pathSplit(newPath0, joint.map(function(p) {
                    p.index = p.index0;
                    return p;
                }));

                // 求路径是否在另一个路径内
                var inPath = false;
                var partInPath = false;
                var inPathBefore = -1;
                var isOverlap = false;

                // 判断path0的相交情况
                splitedPaths0 = splitedPaths0.map(function(splitedPath) {

                    splitedPath.cross = getPathCross(path1, splitedPath);

                    if (splitedPath.cross) {
                        inPath = true;
                    }

                    if (2 === splitedPath.cross) {
                        isOverlap = true;
                    }

                    // 这里需要判断整个曲线有相交区域，但是部分曲线只有交点没有相交轮廓的情况
                    if (inPathBefore === splitedPath.cross && 0 === inPathBefore) {
                        partInPath = true;
                    }
                    

                    inPathBefore = splitedPath.cross;
                    return splitedPath;
                });


                // 只有相交的点，没有相交的轮廓
                if (!inPath) {
                    if (relation === Relation.join || relation === Relation.tangency) {
                        return [path0, path1];
                    }
                    else if (relation === Relation.intersect) {
                        return [];
                    }
                }


                // 求path1的分割曲线
                splitedPaths1 = pathSplit(newPath1, joint.map(function(p) {
                    p.index = p.index1;
                    return p;
                }));

                // 部分只有交点没有轮廓，需要去掉此交点
                if (partInPath) {
                    console.warn('part cross');
                }
                else {
                    // 没有重叠的部分只需要判断第一个就可以知道曲线相交情况了
                    if (!isOverlap) {
                        inPath = getPathCross(path0, splitedPaths1[0]);
                        splitedPaths1 = splitedPaths1.map(function(path) {
                            path.cross = inPath;
                            inPath = !inPath;
                            return path;
                        });
                    }
                    else {
                        // 判断path1的相交情况
                        splitedPaths1 = splitedPaths1.map(function(splitedPath) {
                            splitedPath.cross = getPathCross(path0, splitedPath);
                            return splitedPath;
                        });
                    }
                }

                //异向的 combine 等于相切
                if (relation === Relation.join && direction0 !== direction1) {
                    relation = Relation.tangency;
                }
                // 异向的相交等于空
                if (relation === Relation.intersect && direction0 !== direction1) {
                    return [];
                }

                splitedPaths0.direction = direction0;
                splitedPaths1.direction = direction1;

                return pathCombine(splitedPaths0, splitedPaths1, relation);
                
            };


            if (relation === Relation.join || relation === Relation.tangency) {
                if (!joint) {
                    return [path0, path1];
                }
                // 0 包含 1
                else if (joint === 2) {
                    if (direction0 == direction1) {
                        return [path0];
                    }
                    else {
                        return [path0, path1];
                    }
                }
                // 1 包含 0
                else if (joint === 3) {
                    if (direction0 == direction1) {
                        return [path1];
                    }
                    else {
                        return [path0, path1];
                    }
                }
                else {
                    return getJoinedPath(joint);
                }
            }
            else if (relation === Relation.intersect) {

                if (!joint) {
                    return [];
                }
                else if (joint === 2) {
                    if (direction0 == direction1) {
                        return [path1];
                    }
                    else {
                        return [];
                    }
                }
                else if (joint === 3) {
                    if (direction0 == direction1) {
                        return [path0];
                    }
                    else {
                        return [];
                    }
                }
                else {
                    return getJoinedPath(joint);
                }
            }

            return [path0, path1];
        }

        return join2Path;
    }
);
