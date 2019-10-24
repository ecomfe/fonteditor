/**
 * @file 亮度对比度计算
 * @author mengke01(kekee000@gmail.com)
 *
 * @reference
 * https://github.com/AlloyTeam/AlloyImage
 */

/**
 * 调节图像亮度对比度
 *
 * @param  {Object} imageData    图像数据
 * @param  {string} brightness 亮度 -50 ~ 50
 * @param  {number} contrast   对比度 -50 ~ 50
 * @return {Object}            调整后图像
 */
export default function brightness(imageData, brightness, contrast) {

    brightness = brightness || 0;
    contrast = contrast || 0;

    let data = imageData.data;
    let b = brightness / 50; // -1 , 1
    let c = contrast / 50; // -1 , 1
    let k = Math.tan((45 + 44 * c) * Math.PI / 180);

    for (let i = 0, l = data.length; i < l; i++) {
        data[i] = Math.floor((data[i] - 127.5 * (1 - b)) * k + 127.5 * (1 + b));
    }

    return imageData;
}
