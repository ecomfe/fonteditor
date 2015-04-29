/**
 * @file 一元四次方程求解，仅给出实根部分
 * @author mengke01(kekee000@gmail.com)
 *
 * see:
 * http://www.99cankao.com/algebra/quartic-equation.php
 */


define(
    function (require) {

        var cubeEquation = require('./cubeEquation');

        /**
         * 求解四次方程
         *
         * @param {number} a a系数
         * @param {number} b b系数
         * @param {number} c c系数
         * @param {number} d d系数
         * @param {number} e e系数
         * @return {Array} 解数组，仅给出实根部分
         */
        function quarticEquation(a, b, c, d, e) {
            if (a === 0) {
                return cubeEquation(b, c, d, e);
            }

            if (e === 0) {
                return cubeEquation(a, b, c, d);
            }

            if (a !== 1) {
                b /= a;
                c /= a;
                d /= a;
                e /= a;
            }

            // Coefficients for cubic solver
            var cb;
            var cc;
            var cd;
            var discrim;
            var q;
            var r;
            var RRe;
            var RIm;
            var DRe;
            var DIm;
            var dum1;
            var ERe;
            var EIm;
            var s;
            var t;
            var term1;
            var r13;
            var sqR;
            var y1;
            var z1Re;
            var z1Im;
            var z2Re;

            // 根据求根公式计算
            cb = -c;
            cc = -4.0 * e + d * b;
            cd = -(b * b * e + d * d) + 4.0 * c * e;

            // if (cd === 0) {
            //     // TODO
            // }
            q = (3.0 * cc - (cb * cb)) / 9.0;
            r = -(27.0 * cd) + cb * (9.0 * cc - 2.0 * (cb * cb));
            r /= 54.0;

            discrim = q * q * q + r * r;
            term1 = (cb / 3.0);

            if (discrim > 0) {
                // 1 root real, 2 are complex
                s = r + Math.sqrt(discrim);
                s = ((s < 0) ? -Math.pow(-s, (1.0 / 3.0)) : Math.pow(s, (1.0 / 3.0)));
                t = r - Math.sqrt(discrim);
                t = ((t < 0) ? -Math.pow(-t, (1.0 / 3.0)) : Math.pow(t, (1.0 / 3.0)));
                y1 = -term1 + s + t;
            }
            else {
                if (discrim === 0) {
                    r13 = ((r < 0) ? -Math.pow(-r, (1.0 / 3.0)) : Math.pow(r, (1.0 / 3.0)));
                    y1 = -term1 + 2.0 * r13;
                }
                else {
                    q = -q;
                    dum1 = q * q * q;
                    dum1 = Math.acos(r / Math.sqrt(dum1));
                    r13 = 2.0 * Math.sqrt(q);
                    y1 = -term1 + r13 * Math.cos(dum1 / 3.0);
                }
            }

            // Determined y1, a real root of the resolvent cubic.
            term1 = b / 4.0;
            sqR = -c + term1 * b + y1;
            RRe = RIm = DRe = DIm = ERe = EIm = z1Re = z1Im = z2Re = 0;

            if (sqR >= 0) {
                if (sqR === 0) {
                    dum1 = -(4.0 * e) + y1 * y1;
                    // D and E will be complex
                    if (dum1 < 0) {
                        z1Im = 2.0 * Math.sqrt(-dum1);
                    }
                    else {
                        z1Re = 2.0 * Math.sqrt(dum1);
                        z2Re = -z1Re;
                    }
                }
                else {
                    RRe = Math.sqrt(sqR);
                    z1Re = -(8.0 * d + b * b * b) / 4.0 + b * c;
                    z1Re /= RRe;
                    z2Re = -z1Re;
                }
            }
            else {
                RIm = Math.sqrt(-sqR);
                z1Im = -(8.0 * d + b * b * b) / 4.0 + b * c;
                z1Im /= RIm;
                z1Im = -z1Im;
            }
            z1Re += -(2.0 * c + sqR) + 3.0 * b * term1;
            z2Re += -(2.0 * c + sqR) + 3.0 * b * term1;

            // At this point, z1 and z2 should be the terms under the square root for D and E
            if (z1Im === 0) { // Both z1 and z2 real
                if (z1Re >= 0) {
                    DRe = Math.sqrt(z1Re);
                }
                else {
                    DIm = Math.sqrt(-z1Re);
                }
                if (z2Re >= 0) {
                    ERe = Math.sqrt(z2Re);
                }
                else {
                    EIm = Math.sqrt(-z2Re);
                }
            }
            else {
                r = Math.sqrt(z1Re * z1Re + z1Im * z1Im);
                r = Math.sqrt(r);
                dum1 = Math.atan2(z1Im, z1Re);
                dum1 /= 2; // Divide this angle by 2
                ERe = DRe = r * Math.cos(dum1);
                DIm = r * Math.sin(dum1);
                EIm = -DIm;
            }


            var real = [];

            // check virtual root
            if (0 === RIm + DIm) {
                real.push(-term1 + (RRe + DRe) / 2);
            }

            if (0 === -DIm + RIm) {
                real.push(-(term1 + DRe / 2) + RRe / 2);
            }

            if (0 === -RIm + EIm) {
                real.push(-(term1 + RRe / 2) + ERe / 2);
            }

            if (0 === RIm + EIm) {
                real.push(-(term1 + (RRe + ERe) / 2));
            }

            // 去重根
            var unique = {};
            var result = [];
            for (var i = 0, l = real.length; i < l; i++) {
                if (!unique[real[i]]) {
                    result.push(real[i]);
                    unique[real[i]] = true;
                }
            }

            return result.length ? result : false;
        }

        return quarticEquation;
    }
);
