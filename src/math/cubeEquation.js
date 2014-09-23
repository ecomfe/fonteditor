/**
 * @file cubeEquation.js
 * @author mengke01
 * @date
 * @description
 * 三次方程求解，仅给出实根部分
 * see:
 * http://www.99cankao.com/algebra/cubic-equation.php
 * 
 *  盛金公式判别法
    当A=B=0时，方程有一个三重实根。
    当Δ=B^2－4AC>0时，方程有一个实根和一对共轭虚根。
    当Δ=B^2－4AC=0时，方程有三个实根，其中有一个二重根。
    当Δ=B^2－4AC<0时，方程有三个不相等的实根。
 */


define(

function(require) {

    var quadraticEquation = require('./quadraticEquation');

    /**
     * 求解三次方程
     *
     * @param {number} a a系数
     * @param {number} b b系数
     * @param {number} c c系数
     * @param {number} d d系数
     * @return {Array} 解数组，仅给出实根部分
     */

    function cubeEquation(a, b, c, d) {
        if (a === 0) {
            return quadraticEquation(b, c, d);
        }

        if (d === 0) {
            return quadraticEquation(a, b, c);
        }

        if(a !== 1) {
            b /= a;
            c /= a;
            d /= a; 
        }

        var disc, q, r, dum1, s, t, term1, r13;

        q = (3.0 * c - (b * b)) / 9.0;
        r = -(27.0 * d) + b * (9.0 * c - 2.0 * (b * b));
        r /= 54.0;
        disc = q * q * q + r * r;
        term1 = (b / 3.0);

        // one root real, two are complex
        if (disc > 0) {
            s = r + Math.sqrt(disc);
            s = ((s < 0) ? -Math.pow(-s, (1.0 / 3.0)) : Math.pow(s, (1.0 / 3.0)));
            t = r - Math.sqrt(disc);
            t = ((t < 0) ? -Math.pow(-t, (1.0 / 3.0)) : Math.pow(t, (1.0 / 3.0)));

            return [-term1 + s + t];

            //r1 = -term1 + s + t;
            // term1 += (s + t) / 2.0;
            //r3 = dataForm.x2Re.value = -term1;
            // term1 = Math.sqrt(3.0) * (-t + s) / 2;
            // i2 = term1;
            // i3 = -term1;
        }

        // The remaining options are all real
        // i2 = 0;
        // i3 = 0;
        if (disc === 0) { // All roots real, at least two are equal.
            r13 = ((r < 0) ? -Math.pow(-r, (1.0 / 3.0)) : Math.pow(r, (1.0 / 3.0)));
            var r1 = -term1 + 2.0 * r13;
            var r2 = -(r13 + term1);
            var r3 = r2;
            return r1 == r2 ? r1 : [r1, r2];
        }

        // Only option left is that all roots are real and unequal (to get here, q < 0)
        q = -q;
        dum1 = q * q * q;
        dum1 = Math.acos(r / Math.sqrt(dum1));
        r13 = 2.0 * Math.sqrt(q);
        var r1 = -term1 + r13 * Math.cos(dum1 / 3.0);
        var r2 = -term1 + r13 * Math.cos((dum1 + 2.0 * Math.PI) / 3.0);
        var r3 = -term1 + r13 * Math.cos((dum1 + 4.0 * Math.PI) / 3.0);
        
        return [r1, r2, r3];
    }


    return cubeEquation;
});