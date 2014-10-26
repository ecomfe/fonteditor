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
        var util = require('./util');

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
                            -  Math.pow(p1.x - cur.x, 2) + Math.pow(p1.y - cur.y, 2);
                    }
                    else if (!cur.onCurve){
                        var prev = p0.index == 0 ? path[length - 1] : path[p0.index - 1];
                        var t1 = getBezierQ2T(prev, cur, next, p0);
                        var t2 = getBezierQ2T(prev, cur, next, p1);
                        return t1 < t2 ? -1 : 1;
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
                else {
                    throw 'can\'t get here';
                }
            }

            // 分割曲线
            var splitPaths = [];
            var start;
            var end;
            for (var i = 0, l = joint.length - 1; i < l; i++) {
                start = joint[i];
                end = joint[i + 1];
                splitPaths.push(path.slice(start.index, end.index + 1));
            }

            // 闭合轮廓
            start = end;
            end = joint[0];
            splitPaths.push(path.slice(start.index).concat(path.slice(0, end.index + 1)));
            return splitPaths;
        }

        /**
         * 获取分割的路径hash
         * 
         * @param {Array} splitPath 分割的路径
         * @return {Object} 哈希值
         */
        function getSplitPathHash(splitPath) {
            var splitHash = {};
            var code;

            // 根据起始点创建hash
            splitPath.forEach(function(path) {
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
         * @param {Array} splitPaths0 分割后的路径1
         * @param {Array} splitPaths1 分割后的路径2
         * @param {number} relation 分割关系
         * @return {Array} 组合后的路径
         */
        function combinePath(splitPaths0, splitPaths1, relation) {

            var newPaths = [];
            var splice = Array.prototype.splice;

            // 交集
            if (relation == pathJoin.INTERSECT) {

            }
            else {

                // 相切，分割图形
                if (relation == pathJoin.TANGENCY) {

                    // 计算哈希，用来辅助组合点
                    var splitHash0 = getSplitPathHash(splitPaths0);
                    var splitHash1 = getSplitPathHash(splitPaths1);

                    for (var i = 0; i < splitPaths0.length; i++) {
                        var length = splitPaths0[i].length;
                        var newPath = splitPaths0[i].slice(0, length - 1);

                        var start = splitPaths0[i][0];
                        var end = splitPaths0[i][length - 1];
                        
                        var nextHash = splitHash1;
                        var cross = splitPaths0[i].cross; // 起始cross
                        var loops = 0; // 防止死循环，最多组合100个路径段

                        while (loops++ < 100 && (Math.abs(start.x - end.x) > 0.0001 || Math.abs(start.y - end.y) > 0.0001)) {

                            var paths = nextHash[hashcode(end)];

                            // 选取异向
                            var p = paths[0];
                            if (cross == p.cross) {
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
                                // 这里需要去掉已经使用的splitPaths0上的点
                                splitPaths0.splice(splitPaths0.indexOf(p), 1);
                            }
                        }

                        newPaths.push(newPath);

                    }


                }

                // 合并两图形
                else {

                }
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
        function pathJoin(path0, path1, relation) {
            // 方向， 0 顺时针， 1 逆时针
            var direction0 = util.isClockWise(path0);
            var direction1 = util.isClockWise(path1);

            var newPath0 = util.interpolate(path0);
            var newPath1 = util.interpolate(path1);
            var joint = isPathCross(newPath0, newPath1);

            // 获取组合后的路径
            var getJoinPaths = function(joint) {

                var splitPaths0 = splitPath(newPath0, joint.map(function(p) {
                    p.index = p.index0;
                    return p;
                }));

                // 求路径是否在另一个路径内
                var inPath = isInsidePath(path1, splitPaths0[0][1]);
                splitPaths0 = splitPaths0.map(function(path) {
                    path.direction = direction0;
                    path.cross = inPath;
                    inPath = !inPath;
                    return path;
                });

                var splitPaths1 = splitPath(newPath1, joint.map(function(p) {
                    p.index = p.index1;
                    return p;
                }));

                inPath = isInsidePath(path0, splitPaths1[0][1]);
                splitPaths1 = splitPaths1.map(function(path) {
                    path.direction = direction1;
                    path.cross = inPath;
                    inPath = !inPath;
                    return path;
                });
                
                //异向的 combine 等于相切
                if (relation == pathJoin.JOIN && direction0 !== direction1) {
                    relation = pathJoin.TANGENCY;
                }

                return combinePath(splitPaths0, splitPaths1, relation);
                
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

        pathJoin.JOIN = 1; // 并集
        pathJoin.INTERSECT = 2; // 交集
        pathJoin.TANGENCY = 4; // 相切


        return pathJoin;
    }
);
