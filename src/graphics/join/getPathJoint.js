/**
 * @file getPathJoint.js
 * @author mengke01
 * @date 
 * @description
 * 获取路径交点
 */


define(
    function(require) {
        var getJoint = require('./getJoint');
        var pathIterator = require('../pathIterator');

        /**
         * 求两个路径的交点集合 
         * @param {Array} path0 路径0
         * @param {Array} path1 路径1
         * 
         * @return {Array} 交点数组
         */
        function getPathJoint(path0, path1) {

            var joint = [];
            var result;
            pathIterator(path0, function (c, p0, p1, p2, i) {
                if (c === 'L') {
                    result = getJoint(path1, 'L', p0, p1, 0, i);
                }
                else if(c === 'Q') {
                    result = getJoint(path1, 'Q', p0, p1, p2, i);
                }

                if (result) {
                    joint = joint.concat(result);
                }
            });

            return joint.length ? joint : false;
        }

        return getPathJoint;
    }
);
