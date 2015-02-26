/**
 * @file isBezierCross.js
 * @author mengke01
 * @date
 * @description
 * 求两个bezier曲线的交点
 */


define(
    function (require) {
        var computeBoundingBox = require('./computeBoundingBox');
        var isBoundingBoxCross = require('./isBoundingBoxCross');
        var bezierQ2Equation = require('../math/bezierQ2Equation');
        var bezierQ4Equation = require('../math/bezierQ4Equation');
        var ceilPoint = require('./util').ceilPoint;
        var matrix = require('./matrix');
        var multi = matrix.multi;
        var minus = matrix.minus;
        var plus = matrix.plus;

        /* eslint-disable fecs-max-statements, max-params */
        /**
         * 求两个bezier曲线的交点
         *
         * @param {Object} p0 bezier1 p0
         * @param {Object} p1 bezier1 p1
         * @param {Object} p2 bezier1 p2
         * @param {Object} t0 bezier2 p0
         * @param {Object} t1 bezier2 p1
         * @param {Object} t2 bezier2 p2
         * @return {Array|boolean} 交点数组或false
         */
        function isBezierCross(p0, p1, p2, t0, t1, t2) {
            // t二项式系数
            // a = p0 + p2 - 2p1
            // b = 2(p1 - p0)
            // c = p0
            var bounding1 = computeBoundingBox.quadraticBezier(p0, p1, p2);
            var bounding2 = computeBoundingBox.quadraticBezier(t0, t1, t2);

            // 包围盒是否有交点
            if (isBoundingBoxCross(bounding1, bounding2)) {

                // 求解x1, x2二项式系数
                // x系数
                var xmatrix = [
                    p0.x + p2.x - 2 * p1.x, 2 * (p1.x - p0.x), p0.x - t0.x, t0.x + t2.x - 2 * t1.x, 2 * (t1.x - t0.x)
                ];
                // y系数
                var ymatrix = [
                    p0.y + p2.y - 2 * p1.y, 2 * (p1.y - p0.y), p0.y - t0.y, t0.y + t2.y - 2 * t1.y, 2 * (t1.y - t0.y)
                ];

                // 临时系数
                var tmatrix;
                var t3;
                var t4;
                var t5;

                // 消元法求二元二次方程
                var tResult = false;

                // 二次系数不为0
                if (xmatrix[3] !== 0 && ymatrix[3] !== 0) {
                    tmatrix = minus(multi(xmatrix, ymatrix[3]), multi(ymatrix, xmatrix[3]));

                    // 退化成一元二次方程
                    if (tmatrix[4] === 0) {
                        tResult = bezierQ2Equation.apply(this, tmatrix);
                    }
                    // 高次方程 1
                    else {
                        // 求t2的参数方程
                        tmatrix = multi(tmatrix, 1 / tmatrix[4]);
                        t4 = multi([
                            Math.pow(tmatrix[0], 2),
                            2 * tmatrix[0] * tmatrix[1],
                            2 * tmatrix[0] * tmatrix[2] + Math.pow(tmatrix[1], 2),
                            2 * tmatrix[1] * tmatrix[2],
                            Math.pow(tmatrix[2], 2)
                        ], ymatrix[3]);

                        t3 = multi([0, 0, tmatrix[0], tmatrix[1], tmatrix[2]], ymatrix[4]);

                        // 四次方程系数
                        t5 = plus(t4, t3);
                        t5[2] = t5[2] - ymatrix[0];
                        t5[3] = t5[3] - ymatrix[1];
                        t5[4] = t5[4] - ymatrix[2];

                        tResult = bezierQ4Equation.apply(this, t5);
                    }

                }
                // 二次系数都为0 ，曲线2退化成直线
                else if (xmatrix[3] === 0 && ymatrix[3] === 0) {

                    if (xmatrix[4] !== 0 && ymatrix[4] !== 0) {
                        tmatrix = minus(multi(xmatrix, ymatrix[4]), multi(ymatrix, xmatrix[4]));
                        tResult = bezierQ2Equation.apply(this, tmatrix);
                    }
                    // xmatrix[4] 系数为0, 曲线2退化成垂直线
                    else if (xmatrix[4] === 0) {
                        tResult = bezierQ2Equation.apply(this, xmatrix);
                    }
                    else if (ymatrix[4] === 0) {
                        tResult = bezierQ2Equation.apply(this, ymatrix);

                        // 保证ymatrix可解
                        tmatrix = xmatrix;
                        xmatrix = ymatrix;
                        ymatrix = tmatrix;
                    }
                }
                // 二次系数有一个为0
                else {
                    // 代入法
                    // 置换矩阵, 保持xmatrix[3]为 0
                    if (ymatrix[3] === 0) {
                        tmatrix = xmatrix;
                        xmatrix = ymatrix;
                        ymatrix = tmatrix;
                    }

                    // 退化成一元二次方程
                    if (xmatrix[4] === 0) {
                        tResult = bezierQ2Equation.apply(this, xmatrix);
                    }
                    // 同高次方程1
                    else {
                        // 求t2的参数方程
                        tmatrix = multi(xmatrix, 1 / xmatrix[4]);
                        t4 = multi([
                            Math.pow(tmatrix[0], 2),
                            2 * tmatrix[0] * tmatrix[1],
                            2 * tmatrix[0] * tmatrix[2] + Math.pow(tmatrix[1], 2),
                            2 * tmatrix[1] * tmatrix[2],
                            Math.pow(tmatrix[2], 2)
                        ], ymatrix[3]);

                        t3 = multi([0, 0, tmatrix[0], tmatrix[1], tmatrix[2]], ymatrix[4]);

                        // 四次方程系数
                        t5 = plus(t4, t3);
                        t5[2] = t5[2] - ymatrix[0];
                        t5[3] = t5[3] - ymatrix[1];
                        t5[4] = t5[4] - ymatrix[2];

                        tResult = bezierQ4Equation.apply(this, t5);
                    }
                }

                // t1 有解
                if (tResult) {

                    var tr1;
                    var t2Result;
                    var tr2;
                    var px;
                    var tx;
                    for (var i = tResult.length - 1; i >= 0; i--) {
                        tr1 = tResult[i];

                        // 方程联和求解
                        t2Result = bezierQ2Equation(
                            ymatrix[3] - xmatrix[3],
                            ymatrix[4] - xmatrix[4],
                            xmatrix[0] * Math.pow(tr1, 2)
                                + xmatrix[1] * tr1
                                + xmatrix[2]
                                - (ymatrix[0] * Math.pow(tr1, 2) + ymatrix[1] * tr1 + ymatrix[2])
                        );

                        if (!t2Result) {
                            tResult.splice(i, 1);
                        }
                        else {
                            for (var j = t2Result.length - 1; j >= 0; j--) {

                                tr2 = t2Result[j];

                                // 这里有些情况会出现4个解，需要舍去
                                px = p0.x * Math.pow(1 - tr1, 2) + 2 * p1.x * tr1 * (1 - tr1) + p2.x * Math.pow(tr1, 2);
                                tx = t0.x * Math.pow(1 - tr2, 2) + 2 * t1.x * tr2 * (1 - tr2) + t2.x * Math.pow(tr2, 2);

                                if (0.001 < Math.abs(px - tx)) {
                                    t2Result.splice(j, 1);
                                }
                            }

                            if (!t2Result.length) {
                                tResult.splice(i, 1);
                            }

                        }
                    }

                    // 求解x，y坐标
                    return tResult.length
                        ? tResult.sort(function (t1, t2) {
                            return t1 - t2;
                        }).map(function (t) {
                            return ceilPoint({
                                x: p0.x * Math.pow(1 - t, 2) + 2 * p1.x * t * (1 - t) + p2.x * Math.pow(t, 2),
                                y: p0.y * Math.pow(1 - t, 2) + 2 * p1.y * t * (1 - t) + p2.y * Math.pow(t, 2)
                            });
                        })
                        : false;
                }

            }

            return false;
        }
        /* eslint-enable fecs-max-statements, max-params */

        return isBezierCross;
    }
);
