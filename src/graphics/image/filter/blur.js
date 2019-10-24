/**
 * @file 图像模糊
 * @author mengke01(kekee000@gmail.com)
 */

import filteringImage from '../util/filteringImage';

function getMatrix(radius) {
    let matrix = [];
    // 均值滤波
    let size = Math.pow(2 * radius + 1, 2);
    let value = 1 / size;

    for (let i = 0; i < size; i++) {
        matrix[i] = value;
    }

    return matrix;
}

/**
 * 灰度图像模糊
 *
 * @param  {Object} imageData  图像数据
 * @param  {number} radius 取样区域半径, 正数, 可选, 默认为 3
 *
 * @return {Object}
 */
export default function blur(imageData, radius) {

    radius = Math.floor((radius || 3) / 2);

    let data = imageData.data;
    let width = imageData.width;
    let height = imageData.height;
    let matrix = getMatrix(radius);

    imageData.data = filteringImage(data, width, height, radius, matrix);
    return imageData;
}
