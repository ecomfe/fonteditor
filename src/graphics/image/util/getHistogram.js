/**
 * @file 获取灰度图像的直方图信息
 * @author mengke01(kekee000@gmail.com)
 */


/**
 * 获取图像的灰度分布信息
 *
 * @param  {Object} imageData 图像数据
 * @return {Array}            灰度统计信息
 */
export default function getHistogram(imageData) {
    let histogram = [];
    let i = 0;
    let l = 256;
    for (; i < l; i++) {
        histogram[i] = 0;
    }

    let data = imageData.data;
    for (i = 0, l = data.length; i < l; i++) {
        histogram[data[i]]++;
    }

    return histogram;
}
