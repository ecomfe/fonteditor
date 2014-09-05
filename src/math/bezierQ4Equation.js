/**
 * @file bezierQ4Equation.js
 * @author mengke01
 * @date 
 * @description
 * 求解四次方程贝塞尔根
 */

define(
    function(require) {

        var quarticEquation = require('./quarticEquation');

        /**
         * 求解二次方程
         * 
         * @param {number} a a系数
         * @param {number} b b系数
         * @param {number} c c系数
         * @param {number} d d系数
         * @param {number} e e系数
         * @return {Array} 系数解
         */
        function bezierQuarticEquation(a, b, c, d, e) {
            var result = quarticEquation(a, b, c, d, e);

            if(!result) {
                return result;
            }

            var filter = result.filter(function(item) {
                return item >= 0 && item <= 1;
            });
            return filter.length 
                ? filter
                : false;
        }

        return bezierQuarticEquation;
    }
);

