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
        var bezierQuadeEquation = require('../math/bezierQuadraticEquation');

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
         * @param {number} scale 乘数算子
         * @return {Array.<number>} 数组
         */
        function minus(matrix1, matrix2) {
            return matrix1.map(function(item, index) {
                return item - matrix2[index];
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
                        tResult = bezierQuadeEquation.apply(this, tmatrix);
                    }
                    // 高次方程
                    else {
                        // TODO
                    }

                }
                // 二次系数都为0
                else if(xmatrix[3] == 0 && ymatrix[3] == 0){

                    // 一次系数都为0，退化成一元二次方程
                    if(xmatrix[4] == 0 && ymatrix[4] == 0) {
                        tResult = bezierQuadeEquation.apply(this, tmatrix);
                    }
                    // 消去一次系数
                    else if(xmatrix[4] != 0 && ymatrix[4] != 0) {
                        tmatrix = minus(multi(xmatrix, ymatrix[4]), multi(ymatrix, xmatrix[4]));
                        tResult = bezierQuadeEquation.apply(this, tmatrix);
                    }
                    // 一次系数有一个为0
                    else {
                        //TODO
                    }

                }
                // 二次系数有一个为0
                else {
                    //TODO
                }

            }

            return false;
        }


        return isBezierCross;
    }
);
