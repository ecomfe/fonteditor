/**
 * @file 对图像进行二值化
 * @author mengke01(kekee000@gmail.com)
 */

/**
 * 二值化图像数据
 *
 * @param  {Object} imageData 图像数据
 * @param  {number} threshold 阈值
 * @return {Array}           二值化后的数据
 */
export default function binarize(imageData, threshold) {

    threshold = threshold || 200;
    let width = imageData.width;
    let height = imageData.height;
    let data = imageData.data;

    for (let y = 0, row = 0; y < height; y++) {
        row = y * width;
        for (let x = 0; x < width; x++) {
            data[row + x] = data[row + x] < threshold ? 0 : 255;
        }
    }

    imageData.binarize = true;

    return imageData;
}

