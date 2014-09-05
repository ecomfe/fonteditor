/**
 * @file isBezierCross.js
 * @author mengke01
 * @date 
 * @description
 * 求两个bezier曲线的交点
 */


define(
    function(require) {
        var computeBoundingBox = require('./computeBoundingBox');
        var isBoundingBoxCross = require('./isBoundingBoxCross');
        var bezierQ2Equation = require('../math/bezierQ2Equation');
        var bezierQ4Equation = require('../math/bezierQ4Equation');
        var bezierCubeEquation = require('../math/bezierCubeEquation');

        /**
         * 矩阵乘
         * 
         * @param {Array.<number>} matrix 一维矩阵
         * @param {number} a 乘数算子
         * @return {Array.<number>} 数组
         */
        function multi(matrix, a) {
            return matrix.map(function(item) {
                return item * a;
            });
        }

        /**
         * 矩阵减
         * 
         * @param {Array.<number>} matrix1 一维矩阵
         * @param {Array.<number>} matrix2 一维矩阵
         * @return {Array.<number>} 数组
         */
        function minus(matrix1, matrix2) {
            return matrix1.map(function(item, index) {
                return item - matrix2[index];
            });
        }

        /**
         * 矩阵加
         * 
         * @param {Array.<number>} matrix1 一维矩阵
         * @param {Array.<number>} matrix2 一维矩阵
         * @return {Array.<number>} 数组
         */
        function plus(matrix1, matrix2) {
            return matrix1.map(function(item, index) {
                return item + matrix2[index];
            });
        }

        /**
         * 求两个bezier曲线的交点
         */
        function isBezierCross(p0, p1, p2, t0, t1, t2) {
            // t二项式系数
            // a = p0 + p2 - 2p1
            // b = 2(p1 - p0)
            // c = p0
            var bounding1 = computeBoundingBox.quadraticBezier(p0, p1, p2);
            var bounding2 = computeBoundingBox.quadraticBezier(t0, t1, t2);

            // 包围盒是否有交点
            if(isBoundingBoxCross(bounding1, bounding2)) {

                // 求解x1, x2二项式系数
                // x系数
                var xmatrix = [
                    p0.x + p2.x - 2*p1.x, 2 * (p1.x - p0.x), p0.x - t0.x, t0.x + t2.x - 2*t1.x, 2 * (t1.x - t0.x)
                ];
                // y系数
                var ymatrix = [
                    p0.y + p2.y - 2*p1.y, 2 * (p1.y - p0.y), p0.y - t0.y, t0.y + t2.y - 2*t1.y, 2 * (t1.y - t0.y)
                ];

                // 临时系数
                var tmatrix;

                // 消元法求二元二次方程
                
                var tResult = false;

                // 二次系数不为0
                if(xmatrix[3] != 0 && ymatrix[3] != 0) {
                    tmatrix = minus(multi(xmatrix, ymatrix[3]), multi(ymatrix, xmatrix[3]));

                    // 退化成一元二次方程
                    if(tmatrix[4] == 0) {
                        tResult = bezierQ2Equation.apply(this, tmatrix);
                    }
                    // 高次方程 1
                    else {
                        // 求t2的参数方程
                        tmatrix = multi(tmatrix, 1 / tmatrix[4]);
                        var t4 = multi([
                            Math.pow(tmatrix[0], 2),
                            2 * tmatrix[0] * tmatrix[1],
                            2 * tmatrix[0] * tmatrix[2] + Math.pow(tmatrix[1], 2),
                            2 * tmatrix[1] * tmatrix[2],
                            Math.pow(tmatrix[2], 2)
                        ], ymatrix[3]);

                        var t3 = multi([0, tmatrix[0], tmatrix[1], tmatrix[2], 0], ymatrix[4]);

                        // 四次方程系数
                        var t5 = plus(t4, t3);
                        t5[2] = t5[2] - ymatrix[0];
                        t5[3] = t5[3] - ymatrix[1];
                        t5[4] = t5[4] - ymatrix[2];

                        tResult = bezierQ4Equation.apply(this, t5);
                         console.log(tResult);

                        // var t4 = multi([
                        //     Math.pow(tmatrix[0], 2),
                        //     2 * tmatrix[0] * tmatrix[1],
                        //     2 * tmatrix[0] * tmatrix[2] + Math.pow(tmatrix[1], 2),
                        //     2 * tmatrix[1] * tmatrix[2],
                        //     Math.pow(tmatrix[2], 2)
                        // ], xmatrix[3]);

                        // var t3 = multi([0, tmatrix[0], tmatrix[1], tmatrix[2], 0], xmatrix[4]);

                        // // 四次方程系数
                        // var t5 = plus(t4, t3);
                        // t5[2] = t5[2] - xmatrix[0];
                        // t5[3] = t5[3] - xmatrix[1];
                        // t5[4] = t5[4] - xmatrix[2];

                        // tResult = bezierQ4Equation.apply(this, t5);
                        // console.log(tResult);
                        // console.log('----------------------------');
                    }

                }
                // 二次系数都为0 ，曲线2退化成直线
                else if(xmatrix[3] == 0 && ymatrix[3] == 0){

                    if(xmatrix[4] != 0 && ymatrix[4] != 0) {
                        tmatrix = minus(multi(xmatrix, ymatrix[4]), multi(ymatrix, xmatrix[4]));
                        tResult = bezierQ2Equation.apply(this, tmatrix);
                    }
                    // matrix[4] 系数为0, 曲线2退化成垂直线
                    else if(xmatrix[4] == 0) {
                        tResult = bezierQ2Equation.apply(this, xmatrix);
                    }
                    else if(ymatrix[4] == 0) {
                        tResult = bezierQ2Equation.apply(this, ymatrix);
                    }
                }
                // 二次系数有一个为0
                else {
                    // 代入法
                    // 置换矩阵
                    if (ymatrix[3] == 0) {
                        tmatrix = xmatrix;
                        xmatrix = ymatrix;
                        ymatrix = tmatrix;
                    }
                    
                    // 退化成一元二次方程
                    if(xmatrix[4] == 0) {
                        tResult = bezierQ2Equation.apply(this, xmatrix);
                    }
                    // 同高次方程1
                    else {
                        tmatrix = multi(xmatrix, 1 / xmatrix[4]);
                        // 代入法求四次方程系数
                        tmatrix = [
                            ymatrix[3] * Math.pow(tmatrix[0], 2), // 4
                            2 * ymatrix[3] * tmatrix[0] * tmatrix[1] + ymatrix[4] * tmatrix[0], // 3
                            ymatrix[3] * (2 * tmatrix[0] * tmatrix[2] + Math.pow(tmatrix[1], 2)) + ymatrix[4] * tmatrix[2] - ymatrix[0], // 2
                            ymatrix[3] * 2 * tmatrix[1] * tmatrix[2] + ymatrix[4] * tmatrix[2] - ymatrix[1], // 1
                            ymatrix[3] * tmatrix[2] * tmatrix[2] - ymatrix[2] // 0
                        ];
                        tResult = bezierQ4Equation.apply(this, tmatrix);
                    }
                }

                // t1 有解
                if(tResult) {
                    var pair = [];
                    for (var i = 0, l = tResult.length; i < l; i++) {
                        var t1 = tResult[i];
                        // 代入求t2
                        var t2Result = bezierQ2Equation([
                            xmatrix[3],
                            xmatrix[4],
                            -(xmatrix[0] * Math.pow(t1, 2) + xmatrix[1] * t1 + xmatrix[2])
                        ]);
                        console.log(t2Result);
                        if(t2Result) {
                            // 验证根是否成立
                            for (var j = 0, ll = t2Result.length; j < ll; j++) {
                                var t2 = t2Result[j];
                                // 控制舍入误差，非必需
                                if(
                                    true &&
                                    0.0005 > Math.abs(
                                    ymatrix[0] * Math.pow(t1, 2) + ymatrix[1] * t1 + ymatrix[2]
                                    - ymatrix[3] * Math.pow(t2, 2) + ymatrix[4] * t2
                                    )
                                ) {
                                    pair.push([t1, t2]);
                                }
                            }

                            console.log(pair);
                        }
                    }
                }

            }

            return false;
        }


        return isBezierCross;
    }
);
