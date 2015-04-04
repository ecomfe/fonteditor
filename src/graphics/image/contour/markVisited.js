/**
 * @file 标记点集访问过
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {


        /**
         * 标记点的左右已经被访问过了
         *
         * @param  {Object} p 点
         * @param  {number} rl 左半径
         * @param  {number} rr 右半径
         */
        function markVisited(p, rl, rr) {
            var j;
            var left = p;
            var right = p;
            p.visited = true;

            if (undefined === rr || rr === rl) {
                j = 0;
                while (j++ < rl) {
                    left = left.prev;
                    right = right.next;
                    left.visited = right.visited = true;
                }
            }
            else {
                j = 0;
                while (j++ < rl) {
                    left = left.prev;
                    left.visited = true;
                }

                j = 0;
                while (j++ < rr) {
                    right = right.next;
                    right.visited = true;
                }
            }
        }

        return markVisited;
    }
);
