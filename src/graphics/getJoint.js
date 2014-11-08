/**
 * @file getJoint.js
 * @author mengke01
 * @date 
 * @description
 * 获取曲线段和路径的交点
 */


define(
    function(require) {

        var isSegmentCross = require('./isSegmentCross');
        var isBezierCross = require('./isBezierCross');
        var isBezierSegmentCross = require('./isBezierSegmentCross');
        var pathIterator = require('./pathIterator');

        /**
         * 求路径和曲线段的交点集合
         * @param {Array} path 路径
         * @param {string} command 命令
         * @param {Object} p0 
         * @param {Object} p1 
         * @param {Object} p2 
         * @param {Object} i 曲线段的索引
         *  
         * @return {Array} 交点数组
         */
        function getJoint(path, command, p0, p1, p2, i) {

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
                else if(c === 'Q') {
                    if (command === 'L') {
                        result = isBezierSegmentCross(
                                t0, t1, t2, p0, p1);
                    }
                    else if (command === 'Q') {
                        result = isBezierCross(t0, t1, t2, p0, p1, p2);
                    }
                }

                if (result) {
                    joint = joint.concat(result.map(function(p) {
                        p.index0 = i; // 第一个path交点的索引
                        p.index1 = j; // 第二个path交点的索引
                        return p;
                    }));
                }
            });

            return joint.length ? joint : false;
        }

        return getJoint;
    }
);
