/**
 * @file relation.js
 * @author mengke01
 * @date
 * @description
 * 路径相交关系
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
