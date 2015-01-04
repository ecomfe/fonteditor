/**
 * @file getJoint.js
 * @author mengke01
 * @date
 * @description
 * 获取曲线段和路径的交点
 */


define(
    function (require) {

        var isSegmentCross = require('../isSegmentCross');
        var isBezierCross = require('../isBezierCross');
        var isBezierSegmentCross = require('../isBezierSegmentCross');
        var pathIterator = require('../pathIterator');

        function hashcode(p) {
            return (p.x * 31 + p.y) * 31;
        }

        /* eslint-disable max-params */
        /**
         * 求路径和曲线段的交点集合
         * @param {Array} path 路径
         * @param {string} command 命令
         * @param {Object} p0 p0
         * @param {Object} p1 p1
         * @param {Object=} p2 p2，如果为直线则p2不使用
         * @param {number=} index 曲线段的索引
         *
         * @return {Array} 交点数组
         */
        function getJoint(path, command, p0, p1, p2, index) {

            var joint = [];
            var result;
            pathIterator(path, function (c, t0, t1, t2, j) {
                if (c === 'L') {
                    if (command === 'L') {
                        result = isSegmentCross(p0, p1, t0, t1);
                    }
                    else if (command === 'Q') {
                        result = isBezierSegmentCross(p0, p1, p2, t0, t1, t2);
                    }
                }
                else if (c === 'Q') {
                    if (command === 'L') {
                        result = isBezierSegmentCross(
                                t0, t1, t2, p0, p1);
                    }
                    else if (command === 'Q') {
                        result = isBezierCross(t0, t1, t2, p0, p1, p2);
                    }
                }

                if (result) {
                    joint = joint.concat(result.map(function (p) {
                        p.index0 = index; // 第一个path交点的索引
                        p.index1 = j; // 第二个path交点的索引
                        return p;
                    }));
                }
            });

            // 对结果集合进行筛选，去除重复点
            var hash = {};
            for (var i = joint.length - 1; i >= 0; i--) {
                var p = joint[i];
                if (hash[hashcode(p)]) {
                    joint.splice(i, 1);
                }
                else {
                    hash[hashcode(p)] = true;
                }
            }

            return joint.length ? joint : false;
        }
        /* eslint-enable max-params */

        return getJoint;
    }
);
