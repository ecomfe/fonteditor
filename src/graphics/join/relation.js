/**
 * @file 路径相交关系
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {
        return {
            intersect: 0, // 相交
            join: 1, // 合并
            differ: 2, // 不同
            tangency: 3 // 相切
        };
    }
);
