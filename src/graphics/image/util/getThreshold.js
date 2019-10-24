/**
 * @file 获取二值化阈值
 * @author mengke01(kekee000@gmail.com)
 */

import thresholdTypes from './threshold';


/**
 * 获取图像的二值阈值
 *
 * @param  {Array} histogram     灰度分布数组
 * @param  {string} thresholdType 阈值类型
 * @return {number}               阈值
 */
export default function getThreshold(histogram, thresholdType) {
    let thrFunction = thresholdTypes[thresholdType] || thresholdTypes.mean;
    return thrFunction(histogram);
}

