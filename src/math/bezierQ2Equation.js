/**
 * @file bezierQ2Equation.js
 * @author mengke01
 * @date 
 * @description
 * 求解二次方程贝塞尔根
 */

define(
    function(require) {

        var quadraticEquation = require('./quadraticEquation');

        /**
         * 求解二次方程
         * 
         * @param {number} a a系数
         * @param {number} b b系数
         * @param {number} c c系数
         * @return {Array} 系数解
         */
        function bezierQ2Equation(a, b, c) {
            var result = quadraticEquation(a, b, c);
            
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

        return bezierQ2Equation;
    }
);

