/**
 * @file pathCombine.js
 * @author mengke01
 * @date 
 * @description
 * 组合分割的路径
 */


define(
    function(require) {
        var util = require('../pathUtil');
        var deInterpolate = util.deInterpolate;
        var Relation = require('./relation');
        var getPathHash = util.getPathHash;
        var splice = Array.prototype.splice;

        // 最多组合50个路径段组成轮廓
        var MAX_COMBINE_PATHS = 50;

        /**
         * 两个交点的hash
         * 
         * @param {Object} p0
         * @param {Object} p1
         * @return {number}
         */
        function hashcode(p0) {
            return p0.x * 31 + p0.y;
        }

        /**
         * 获取分割的路径hash
         * 
         * @param {Array} splitedPath 分割的路径
         * @return {Object} 哈希值
         */
        function getPathStartHash(paths) {
            var pathHash = {};
            var code;

            // 根据起始点创建hash
            paths.forEach(function(splitedPath) {
                var path = splitedPath.path;

                // 开始点
                code = hashcode(path[0]);
                if (!pathHash[code]) {
                    pathHash[code] = [];
                }
                pathHash[code].push(splitedPath);

                // 结束点
                code = hashcode(path[path.length - 1]);
                if (!pathHash[code]) {
                    pathHash[code] = [];
                }

                pathHash[code].push(splitedPath);
            });
            return pathHash;
        }

        /**
         * 组合路径
         * 
         * @param {Array} splitedPaths0 分割后的路径1
         * @param {Array} splitedPaths1 分割后的路径2
         * @param {number} relation 分割关系
         * @return {Array} 组合后的路径
         */
        function pathCombine(splitedPaths0, splitedPaths1, relation) {

            // 待选集合
            var selectedPaths = [];
            // 重叠部分只需要一条路径
            var overlapHash = {};
            [splitedPaths0, splitedPaths1].forEach(function(splitedPaths) {
                for (var i = 0, l = splitedPaths.length; i < l ; i ++) {

                    // 重叠部分
                    if (splitedPaths[i].cross == 2) {
                        var hash = getPathHash(splitedPaths[i].path);
                        if (!overlapHash[hash]) {
                            selectedPaths.push(splitedPaths[i]);
                            overlapHash[hash] = 1;
                            overlapHash[getPathHash(splitedPaths[i].path.reverse())] = 1;
                        }
                    }
                    else {
                        if (relation === Relation.join && splitedPaths[i].cross == 0) {
                            selectedPaths.push(splitedPaths[i]);
                        }
                        else if (relation === Relation.intersect && splitedPaths[i].cross == 1) {
                            selectedPaths.push(splitedPaths[i]);
                        }
                        else if (relation === Relation.tangency) {
                            selectedPaths.push(splitedPaths[i]);
                        }
                    }

                }
            });

            //console.log(selectedPaths);

            // 起始点hash
            var pathStartHash = getPathStartHash(selectedPaths);
            // 待选的起始路径集合
            var startPaths = selectedPaths.filter(function(path) {
                if (relation === Relation.join || relation === Relation.tangency) {
                    return path.cross === 0;
                }
                else if (relation === Relation.intersect) {
                    return path.cross === 1;
                }
                return false;
            });

            var combinedPaths = [];
            for (var pathIndex = 0; pathIndex < startPaths.length; pathIndex++) {
                var curPath = startPaths[pathIndex];
                var combinedPath = curPath.path.slice(0, curPath.path.length - 1);
                var start = curPath.path[0];
                var end = curPath.path[curPath.path.length - 1];

                // 防止找不到可组合的轮廓，最多组合MAX_COMBINE_PATHS个路径段
                var loops = 0;
                var paths;
                while (++loops < MAX_COMBINE_PATHS && (Math.abs(start.x - end.x) > 0.001 || Math.abs(start.y - end.y) > 0.001)) {

                    paths = pathStartHash[hashcode(end)];

                    if (!paths.length) {
                        throw 'can\'t find paths to combine.';
                        return [];
                    }

                    // 下一个路径
                    var path = null;

                    if (paths.length === 2 && paths[0] === curPath) {
                        path = paths[1];
                    }
                    else if (paths.length === 2 && paths[1] === curPath) {
                        path = paths[0];
                    }
                    else {
                        var overlapPath;
                        for (var i = 0, l = paths.length; i < l ; i++) {
                            if (paths[i] !== curPath) {
                                if (paths[i].cross === 2) {
                                    overlapPath = paths[i];
                                }
                                // 相切的情况需要优先寻找与当前相交性质相反并且不在同一路径上的路径段
                                else if (relation === Relation.tangency 
                                    && curPath.cross !== paths[i].cross && curPath.origin !== paths[i].origin
                                ) {
                                   path =  paths[i];
                                   break;
                                }
                                else if (relation === Relation.join && paths[i].cross == 0) {
                                   path =  paths[i];
                                   break;
                                }
                                else if (relation === Relation.intersect && paths[i].cross == 1) {
                                   path =  paths[i];
                                   break;
                                }
                            }
                        }

                        // 如果找不到，则使用重叠的路径
                        if (!path) {
                            if (overlapPath) {
                                // 这里由于相切需要取另一路径上的路径段，
                                // 因此这里需要重新设置origin
                                overlapPath.origin = curPath.origin;
                                path = overlapPath;
                            }
                            else {
                                console.warn('can\'t find paths to combine.');
                                break;
                            }
                        }
                    }

                    // 反转起始点
                    var pathPoints = path.path.slice();
                    if ((Math.abs(end.x - path.path[0].x) > 0.001 || Math.abs(end.y - path.path[0].y) > 0.001)) {
                        pathPoints = pathPoints.reverse();
                    }

                    splice.apply(combinedPath, [combinedPath.length, 0].concat(pathPoints.slice(0, pathPoints.length - 1)));
                    end = path.path[path.path.length - 1];
                    curPath = path;

                    // 有一种边缘重叠的情况，没有相交区域，不应该移除相切路径段
                    // 否则会导致组合错误
                    if (relation === Relation.tangency && path.cross === 2) {
                        // do nothing
                    }
                    // 使用过的路径在哈希中移除
                    else {
                        [path.path[0], end].forEach(function(p) {
                            paths = pathStartHash[hashcode(p)];
                            var index = paths.indexOf(path);
                            if (index >= 0) {
                                paths.splice(index, 1);
                                if (!paths.length) {
                                    delete pathStartHash[hashcode(p)];
                                }
                            }
                        });
                    }


                    // 这里需要去掉已经使用的待选路径
                    var index = startPaths.indexOf(path);
                    if (index >= 0) {
                        startPaths.splice(index, 1);
                    }

                }

                if (loops >= MAX_COMBINE_PATHS) {
                    throw 'can\'t find paths to combine.';
                    return [];
                }

                combinedPaths.push(combinedPath);
                
            }

            if (combinedPaths.length) {
                return combinedPaths.map(function(path){
                    return deInterpolate(path); 
                });
            }
            else {
                return [];
            }
           
        }


        return pathCombine;
    }
);
