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
        var isPathOverlap = require('../isPathOverlap');
        var getBezierQ2Point = require('math/getBezierQ2Point');
        var Relation = require('./relation');
        var util = require('../pathUtil');
        var interpolate = util.interpolate;
        var removeLinePoint = util.removeLinePoint;
        var pathSplit = require('./pathSplit');
        var pathCombine = require('./pathCombine');
        var getVirtualJoint = require('./getVirtualJoint');


        /**
         * 获取一个路径段和另一个路径的关系
         * 
         * @param {Array} path0 路径段
         * @param {Array} path1 要比较的路径
         * @return {number} 0 在外部，1 在内部，2 在路径上
         */
        function getPathCross(path0, path1) {

            if (isPathOverlap(path0, path1)) {
                return 2;
            }
            
            // 这里取第一个路径段的第一段中间结点作为检查点
            var inPath = isInsidePath(
                path1, 
                path0[1].onCurve 
                    ? {x: (path0[0].x + path0[1].x) / 2, y: (path0[0].y + path0[1].y) / 2}
                    : getBezierQ2Point(path0[0], path0[1], path0[2], 0.5)
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

            var direction0 = util.isClockWise(path0);
            var direction1 = util.isClockWise(path1);

            // 完全重叠
            if (2 == isPathOverlap(path0, path1)) {
                // 同向合并或者相交，只留一个
                if ((relation === Relation.join || relation === Relation.intersect) && direction0 === direction1) {
                    return [path0];
                }
                else {
                    return [];
                }
            }


            // 这里对路径进行插值，以便于求交运算
            var newPath0 = interpolate(removeLinePoint(path0));
            var newPath1 = interpolate(removeLinePoint(path1));
            var joint = isPathCross(newPath0, newPath1);


            // 检查是否都是虚交点
            if (joint) {
                var virtualJoint = getVirtualJoint(newPath0, newPath1, joint);
                //console.log(virtualJoint);

                // 0在1内部
                if (virtualJoint.inCount === joint.length) {
                    joint = 3;
                }
                // 1在0内部
                else if (virtualJoint.outCount === joint.length) {
                    joint = 2;
                }  
            }

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
                var inPathBefore = -1;
                // 是否部分在路径内
                var onlyPointCross = false;
                // 是否拥有重叠区域
                var isOverlap = false;

                // 判断path0的相交情况
                splitedPaths0 = splitedPaths0.map(function(path) {

                    var splited = {};
                    splited.path = path;
                    splited.cross = getPathCross(path, path1);
                    splited.direction = direction0;
                    splited.origin = path0;

                    if (splited.cross) {
                        inPath = true;
                    }

                    if (2 === splited.cross) {
                        isOverlap = true;
                    }

                    // 这里需要判断整个曲线有相交区域，但是部分曲线只有交点没有相交轮廓的情况
                    if (inPathBefore === splited.cross && 0 === inPathBefore) {
                        onlyPointCross = true;
                    }
                    

                    inPathBefore = splited.cross;
                    return splited;
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

                // 部分只有交点没有轮廓，不需要处理，原样返回
                if (onlyPointCross) {
                    console.warn('only point cross');
                    return [path0, path1];
                }
                else {
                    // 没有重叠的部分只需要判断第一个就可以知道曲线相交情况了
                    if (!isOverlap) {
                        var isCross = getPathCross(splitedPaths1[0], path0);
                        splitedPaths1 = splitedPaths1.map(function(path) {
                            var splited = {};
                            splited.path = path;
                            splited.cross = isCross ? 1 : 0;
                            splited.direction = direction1;
                            splited.origin = newPath1;
                            isCross = !isCross;
                            return splited;
                        });
                    }
                    else {
                        // 判断path1的相交情况
                        splitedPaths1 = splitedPaths1.map(function(path) {
                            var splited = {};
                            splited.path = path;
                            splited.cross = getPathCross(path, path0);
                            splited.direction = direction1;
                            splited.origin = newPath1;
                            return splited;
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
