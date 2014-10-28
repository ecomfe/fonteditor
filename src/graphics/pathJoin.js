/**
 * @file pathJoin.js
 * @author mengke01
 * @date 
 * @description
 * 求路径的并集
 */


define(
    function(require) {
        var isPathCross = require('./isPathCross');
        var isInsidePath = require('./isInsidePath');
        var bezierQ2Split = require('math/bezierQ2Split');
        var getBezierQ2T = require('math/getBezierQ2T');
        var getBezierQ2Point = require('math/getBezierQ2Point');
        var util = require('./util');
        var splice = Array.prototype.splice;

        /**
         * 按索引号排序相交点，这里需要处理曲线段上有多个交点的问题
         * 
         * @param {Array} path 路径
         * @param {Array} joint 交点数组
         * @return {Array} 排序后
         */
        function sortJoint(path, joint) {

            var length = path.length;
            
            return joint.sort(function(p0, p1) {
                if (p0.index !== p1.index) {
                    return p0.index - p1.index;
                }
                else {
                    var cur = path[p0.index];
                    var next = p0.index == length - 1 ? path[0] : path[p0.index + 1];

                    // 直线
                    if (cur.onCurve && next.onCurve) {
                        return  Math.pow(p0.x - cur.x, 2) + Math.pow(p0.y - cur.y, 2)
                            -  (Math.pow(p1.x - cur.x, 2) + Math.pow(p1.y - cur.y, 2));
                    }
                    else if (!cur.onCurve){
                        var prev = p0.index == 0 ? path[length - 1] : path[p0.index - 1];
                        var t1 = getBezierQ2T(prev, cur, next, p0);
                        var t2 = getBezierQ2T(prev, cur, next, p1);
                        return t1 == t2 ? 0 : t1 < t2 ? -1 : 1;
                    }

                }
            });
        }

        /**
         * 两个交点的hash
         * 
         * @param {Object} p0
         * @param {Object} p1
         * @return {number}
         */
        function hashcode(p0) {
            return p0.x + ',' + p0.y;
        }

        /**
         * 分割路径
         * 
         * @param {Array} path 路径
         * @param {Array} joint 分割点
         * @param {string} indexProp 索引号
         * @return {Array} 分割后的路径集合
         */
        function splitPath(path, joint) {
            joint = sortJoint(path, joint);

            var jointOffset = 0; // 用来标记插入点产生的偏移

            // 插入分割点
            for (var i = 0, l = joint.length; i < l; i++) {

                var length = path.length;
                var p = joint[i];
                p.index += jointOffset;
                var cur = p.index;
                var next = cur == length - 1 ? 0 : cur + 1;

                // 直线
                if (path[cur].onCurve && path[next].onCurve) {
                    path.splice(cur + 1, 0, {
                        x: p.x,
                        y: p.y,
                        onCurve: true
                    });
                    p.index = cur + 1;
                    jointOffset ++;
                }

                // 贝塞尔开始点，插入2个节点
                else if (!path[cur].onCurve) {
                    var prev = cur == 0 ? length - 1 : cur - 1;
                    var bezierArray = bezierQ2Split(path[prev], path[cur], path[next], p);
                    
                    if (!bezierArray) {
                        throw 'can\'t split path';
                    }

                    // 端点情况
                    if (bezierArray.length === 1) {
                        p.index = bezierArray[0] === 0 ? prev : next;
                    }
                    else {
                        path.splice(cur, 1, 
                            bezierArray[0][1], 
                            {
                                x: p.x,
                                y: p.y,
                                onCurve: true
                            }, 
                            bezierArray[1][1]
                        );

                        p.index = cur + 1;
                        jointOffset += 2;
                    }
                }
                else {
                    throw 'can\'t get here';
                }
            }

            // 这里需要重新筛选排序
            joint.sort(function(p0, p1) {
                return p0.index - p1.index;
            });

            // 分割曲线
            var splitedPaths = [];
            var start;
            var end;
            for (var i = 0, l = joint.length - 1; i < l; i++) {
                start = joint[i];
                end = joint[i + 1];
                splitedPaths.push(path.slice(start.index, end.index + 1));
            }

            // 闭合轮廓
            start = end;
            end = joint[0];
            splitedPaths.push(path.slice(start.index).concat(path.slice(0, end.index + 1)));
            return splitedPaths;
        }

        /**
         * 获取分割的路径hash
         * 
         * @param {Array} splitedPath 分割的路径
         * @return {Object} 哈希值
         */
        function getSplitedPathHash(splitedPath) {
            var splitHash = {};
            var code;

            // 根据起始点创建hash
            splitedPath.forEach(function(path) {
                // 开始点
                code = hashcode(path[0]);
                if (!splitHash[code]) {
                    splitHash[code] = [];
                }
                splitHash[code].push(path);

                // 结束点
                code = hashcode(path[path.length - 1]);
                if (!splitHash[code]) {
                    splitHash[code] = [];
                }

                splitHash[code].push(path);
            });
            return splitHash;
        }

        /**
         * 组合路径
         * 
         * @param {Array} splitedPaths0 分割后的路径1
         * @param {Array} splitedPaths1 分割后的路径2
         * @param {number} relation 分割关系
         * @return {Array} 组合后的路径
         */
        function combinePath(splitedPaths0, splitedPaths1, relation) {
            var direction0 = splitedPaths0.direction;
            var direction1 = splitedPaths1.direction;
            var newPaths = [];

            // 过滤路径
            var filterPath = function(path){
                if (relation == pathJoin.INTERSECT) {
                    return path.cross;
                }
                else if (relation == pathJoin.JOIN) {
                    return !path.cross;
                }
                else {
                    return true;
                }
            };

            splitedPaths0 = splitedPaths0.filter(filterPath);
            splitedPaths1 = splitedPaths1.filter(filterPath);


            // 计算哈希，用来辅助组合点
            var splitHash0 = getSplitedPathHash(splitedPaths0);
            var splitHash1 = getSplitedPathHash(splitedPaths1);

            for (var i = 0; i < splitedPaths0.length; i++) {
                var curPath = splitedPaths0[i];
                var cross = curPath.cross; // 起始cross
                var length = curPath.length;
                
                // 对于求相切的情况，外轮廓不需要处理，内轮廓需要根据另一个轮廓的方向调整反向
                if (relation == pathJoin.TANGENCY && cross && direction0 == direction1) {
                    curPath = curPath.reverse();
                }
                
                var newPath = curPath.slice(0, length - 1);
                var start = curPath[0];
                var end = curPath[length - 1];
                
                var nextHash = splitHash1;
                var loops = 0; // 防止死循环，最多组合100个路径段

                while (++loops < 100 && (Math.abs(start.x - end.x) > 0.001 || Math.abs(start.y - end.y) > 0.001)) {

                    var paths = nextHash[hashcode(end)];

                    // 选取异向
                    var p = paths[0];
                    if (relation == pathJoin.TANGENCY && cross == p.cross && paths.length > 1) {
                        p = paths[1];
                    }

                    if (end.x == p[0].x && end.y == p[0].y) {
                    }
                    else {
                        p = p.reverse();
                    }

                    splice.apply(newPath, [newPath.length, 0].concat(p.slice(0, p.length - 1)));

                    cross = !cross;
                    end = p[p.length - 1];

                    if (nextHash === splitHash1) {
                        nextHash = splitHash0;
                    }
                    else {
                        nextHash = splitHash1;
                        // 这里需要去掉已经使用的splitedPaths0上的点
                        splitedPaths0.splice(splitedPaths0.indexOf(p), 1);
                    }
                }
                newPaths.push(newPath);
            }

            if (loops >= 100) {
                console.warn('no combination path');
                return [];
            }

            if (newPaths.length) {
                return newPaths.map(function(path){
                    return util.deInterpolate(path); 
                });
            }
            else {
                return [];
            }
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

            var newPath0 = util.interpolate(path0);
            var newPath1 = util.interpolate(path1);
            var joint = isPathCross(newPath0, newPath1);
            var splitedPaths0;
            var splitedPaths1;

            // 获取另一个路径和分割路径的交点情况
            var getPathCross = function (path, splitedPath) {
                var inPath = isInsidePath(
                    path, 
                    splitedPath[1].onCurve 
                        ? splitedPath[1]
                        : getBezierQ2Point(splitedPath[0], splitedPath[1], splitedPath[2], 0.5)
                );
                return inPath;
            };

            // 获取组合后的路径
            var getJoinPaths = function(joint) {

                splitedPaths0 = splitPath(newPath0, joint.map(function(p) {
                    p.index = p.index0;
                    return p;
                }));

                // 求路径是否在另一个路径内
                var inPath = false;
                var partInPath = false;
                var inPathBefore = -1;
                // 求path0的分割曲线
                splitedPaths0 = splitedPaths0.map(function(splitedPath) {

                    splitedPath.cross = getPathCross(path1, splitedPath);

                    // 这里需要判断整个曲线有相交区域，但是部分曲线只有交点没有相交轮廓的情况
                    if (inPathBefore == splitedPath.cross) {
                        partInPath = true; 
                    }

                    if (splitedPath.cross) {
                        inPath = true;
                    }

                    inPathBefore = splitedPath.cross;

                    return splitedPath;
                });

                // 部分只有交点没有轮廓
                if (partInPath) {
                    console.warn('part cross');
                }

                // 只有相交的点，没有相交的轮廓
                if (!inPath || partInPath) {
                    if (relation == pathJoin.JOIN || relation == pathJoin.TANGENCY) {
                        return [path0, path1];
                    }
                    else if (relation == pathJoin.INTERSECT) {
                        return [];
                    }
                }

                // 求path1的分割曲线
                splitedPaths1 = splitPath(newPath1, joint.map(function(p) {
                    p.index = p.index1;
                    return p;
                }));

                // 这里只需要判断第一个就可以知道曲线相交情况了
                inPath = getPathCross(path0, splitedPaths1[0]);
                splitedPaths1 = splitedPaths1.map(function(path) {
                    path.cross = inPath;
                    inPath = !inPath;
                    return path;
                });
                
                //异向的 combine 等于相切
                if (relation == pathJoin.JOIN && direction0 !== direction1) {
                    relation = pathJoin.TANGENCY;
                }
                // 异向的相交等于空
                if (relation == pathJoin.INTERSECT && direction0 !== direction1) {
                    return [];
                }

                splitedPaths0.direction = direction0;
                splitedPaths1.direction = direction1;

                return combinePath(splitedPaths0, splitedPaths1, relation);
                
            };


            if (relation == pathJoin.JOIN || relation == pathJoin.TANGENCY) {
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
                    return getJoinPaths(joint);
                }
            }
            else if (relation == pathJoin.INTERSECT) {

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
                    return getJoinPaths(joint);
                }
            }

            return [path0, path1];
        }


        /**
         * 求路径交集、并集、差集
         * 
         * @param {Array} paths 路径集合
         * @param {number} relation 关系
         * @return {Array} 合并后的路径
         */
        function pathJoin(paths, relation) {
            if (paths.length == 1) {
                if (relation == pathJoin.INTERSECT) {
                    return [];
                }
                else {
                    return paths;
                }
            }
            else if (paths.length == 2) {
                return join2Path(paths[0], paths[1], relation);
            }
            else {

                // 算法描述：
                // 1. 第一个路径为已选集合，后面依次为待选集合
                // 2. 从已选集合中和待选集合中各取一个轮廓求pathJoin
                // 3. 如果有合并项目，则除去已选集合和待选集合中的路径，把新路径加入待选集合，继续2
                //    否则将待选集合中的当前路径加入已选集合，继续2
                // 4. 继续2、3步骤直到待选集合为空

                // 已选集合
                var startPaths = [paths[0]];
                var leftPath = paths.slice(1);
                var curPath;
                var joinFlag = 0; // 两个轮廓如果是由同一个合并生成的，则不需要进行比较了

                while (curPath = leftPath.shift()) {
                    for (var i = 0, l = startPaths.length; i < l; i++) {

                        if (curPath.joinFlag && startPaths[i].joinFlag && (curPath.joinFlag & startPaths[i].joinFlag)) {
                            continue;
                        }

                        var result = join2Path(curPath, startPaths[i], relation);

                        // 相交关系，有个无交集则返回空
                        if (relation == pathJoin.INTERSECT && !result.length) {
                            return [];
                        }
                        
                        // 原样返回,继续比较
                        if (result.length == 2 &&  result[0] === curPath && result[1] === startPaths[i]) {
                            continue;
                        }
                        // 否则分割出来的点，加入待选集合
                        else {
                            startPaths.splice(i, 1);
                            joinFlag ++;
                            result.forEach(function(path) {
                                path.joinFlag = (path.joinFlag || 0) + (1 << joinFlag);
                                leftPath.push(path);
                            });
                            break;
                        }
                    }

                    // 没有找到
                    if (i == l) {
                        startPaths.push(curPath);
                    }
                    else if (!startPaths.length) {
                        startPaths.push(leftPath.shift());
                    }
                }

                return startPaths;
            }
        }


        pathJoin.JOIN = 1; // 并集
        pathJoin.INTERSECT = 2; // 交集
        pathJoin.TANGENCY = 4; // 相切


        return pathJoin;
    }
);
