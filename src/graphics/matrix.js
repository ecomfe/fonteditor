/**
 * @file 一维矩阵操作
 * @author mengke01(kekee000@gmail.com)
 */

/**
 * 矩阵乘系数
 *
 * @param {Array.<number>} matrix 一维矩阵
 * @param {number} a 乘数算子
 * @return {Array.<number>} 数组
 */
export function multi(matrix, a) {
    return matrix.map(function (item) {
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
export function minus(matrix1, matrix2) {
    return matrix1.map(function (item, index) {
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
export function plus(matrix1, matrix2) {
    return matrix1.map(function (item, index) {
        return item + matrix2[index];
    });
}
