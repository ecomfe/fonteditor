/**
 * @file pathIterator.js
 * @author mengke01
 * @date 
 * @description
 * path遍历
 */


define(
    function(require) {

        /**
         * 路径迭代器
         * 
         * @param {Array} path 路径点集合
         * @param {Function} iterator 迭代器，参数：command, points, index
         * @return {Array} path 路径点集合
         */
        function pathIterator(path, iterator) {
            var i = -1;
            var l = path.length;
            var prev, point;
            while (++i < l) {
                point = path[i];
                switch (point.c) {
                    case 'M':
                    case 'L':
                    case 'Z':
                        iterator && iterator(point.c, i, point.p);
                        prev = point.p;
                        break;
                    case 'Q':
                        iterator && iterator('Q', i, prev, point.p1, point.p);
                        prev = point.p;
                        break;
                }
            }
            return path;
        }

        return pathIterator;
    }
);
