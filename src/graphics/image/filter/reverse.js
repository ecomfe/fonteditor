/**
 * @file 反转图像
 * @author mengke01(kekee000@gmail.com)
*/

/**
 * 调节图像亮度对比度
 *
 * @param  {Object} imageData    图像数据
 * @return {Object}            调整后图像
 */
export default function reverse(imageData) {
    let data = imageData.data;
    for (let i = 0, l = data.length; i < l; i++) {
        data[i] = 255 - data[i];
    }

    return imageData;
}

