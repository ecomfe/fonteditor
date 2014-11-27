/**
 * @file pathCombine.js
 * @author mengke01
 * @date 
 * @description
 * 组合分割的路径
 */


define(
    function(require) {
        var deInterpolate = require('./deInterpolate');
        var Relation = require('./relation');
        var splice = Array.prototype.splice;

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
        function pathCombine(splitedPaths0, splitedPaths1, relation) {
            var direction0 = splitedPaths0.direction;
            var direction1 = splitedPaths1.direction;
            var newPaths = [];

            // 过滤路径
            var filterPath = function(path){
                if (relation === Relation.intersect) {
                    return path.cross;
                }
                else if (relation === Relation.join) {
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
                var cross = !!curPath.cross; // 起始cross
                var length = curPath.length;
                
                // 对于求相切的情况，外轮廓不需要处理，内轮廓需要根据另一个轮廓的方向调整反向
                if (relation === Relation.tangency && cross && direction0 == direction1) {
                    curPath = curPath.reverse();
                }
                
                var newPath = curPath.slice(0, length - 1);
                var start = curPath[0];
                var end = curPath[length - 1];
                
                var nextHash = splitHash1;
                var loops = 0; // 防止死循环，最多组合100个路径段

                while (++loops < 100 && (Math.abs(start.x - end.x) > 0.001 || Math.abs(start.y - end.y) > 0.001)) {

                    var paths = nextHash[hashcode(end)];

                    // 这里如果是相交或者合并的情况，不需要处理，如果是相切的情况则需要取反向的曲线
                    var p = paths[0];
                    if (relation === Relation.tangency && cross == !!p.cross && paths.length > 1) {
                        p = paths[1];
                    }

                    // 选取异向
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
                throw 'can\'t find paths to combine.';
                return [];
            }

            if (newPaths.length) {
                return newPaths.map(function(path){
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
