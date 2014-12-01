/**
 * @file pathJoin.js
 * @author mengke01
 * @date 
 * @description
 * 求路径的并集
 */


define(
    function(require) {

        var join2Path = require('./join/join2Path');
        var Relation = require('./join/relation');

        /**
         * 求路径交集、并集、差集
         * 
         * @param {Array} paths 路径集合
         * @param {number} relation 关系
         * @return {Array} 合并后的路径
         */
        function pathJoin(paths, relation) {
            if (paths.length == 1) {
                if (relation == Relation.intersect) {
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
                // 2. 从已选集合中和待选集合中各取一个轮廓求合并
                // 3. 如果有合并项目，则除去已选集合和待选集合中的路径，把新路径加入待选集合，继续2
                //    否则将待选集合中的当前路径加入已选集合，继续2
                // 4. 继续2、3步骤直到待选集合为空

                // 已选集合
                var startPaths = [paths[0]];
                var leftPath = paths.slice(1);
                var curPath;
                // 两个轮廓如果是由同一个合并生成的，则不需要进行比较了
                // 这里用位来标记是哪个路径分割出来的
                var joinFlag = 0; 

                while (curPath = leftPath.shift()) {
                    for (var i = 0, l = startPaths.length; i < l; i++) {

                        if (curPath.joinFlag && startPaths[i].joinFlag && (curPath.joinFlag & startPaths[i].joinFlag)) {
                            continue;
                        }

                        var result = join2Path(curPath, startPaths[i], relation);

                        // 相交关系，有个无交集则返回空
                        if (relation == Relation.intersect && !result.length) {
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


        pathJoin.Relation = Relation;

        return pathJoin;
    }
);
