/**
 * @file quadraticEquation.js
 * @author mengke01
 * @date 
 * @description
 * 求解二次方程
 */

define(
    function(require) {

        /**
         * 求解二次方程
         * 
         * @param {number} a a系数
         * @param {number} b b系数
         * @param {number} c c系数
         * @return {Array} 系数解
         */
        function quadraticEquation(a, b, c) {

            if(a == 0) {
                return [-c / b];
            }

            if(b == 0) {
                if(c == 0) {
                    return [0];
                }

                if(a > 0 && c < 0 || a < 0 && c > 0) {
                    var x2 = Math.sqrt(-c / a);
                    return [x2, -x2];
                }
                else {
                    return false;
                }
            }

            if(c == 0) {
                return [0, -b / a];
            }

            var b4ac = Math.pow(b, 2) - 4 * a *c;

            if(b4ac >= 0) {
                var x1  =  (-b + Math.sqrt(b4ac, 2)) / a / 2;
                var x2 = (-b - Math.sqrt(b4ac, 2)) / a / 2;
                if(x1 == x2) {
                    return [x1];
                }
                else {
                    return [x1, x2];
                }
            }
            else {
                return false;
            }
        }



        return quadraticEquation;
    }
);
