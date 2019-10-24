/**
 * @file 图像滤波函数
 * @author mengke01(kekee000@gmail.com)
 */

/**
 * 滤波函数
 *
 * @param  {Array} data   图像数据
 * @param  {number} width  宽度
 * @param  {number} height 高度
 * @param  {number} radius 半径
 * @param  {Array} matrix 滤波矩阵
 *
 * @return {Array}        滤波后数据
 */
export default function filteringImage(data, width, height, radius, matrix) {
    let x;
    let y;
    let i;
    let j;
    let k;
    let value;
    let posX;
    let posY;

    for (y = 0; y < height; y++) {
        for (x = 0; x < width; x++) {
            value = 0;
            for (k = 0, i = -radius; i <= radius; i++) {
                for (j = -radius; j <= radius; j++) {
                    posX = x + i;

                    if (posX < 0 || posX >= width) {
                        posX = x - i;
                    }

                    posY = y + j;
                    if (posY < 0 || posY >= height) {
                        posY = y - j;
                    }

                    value += data[posX + posY * width] * matrix[k++];
                }
            }

            data[x + y * width] = Math.floor(value);
        }
    }

    return data;
}
