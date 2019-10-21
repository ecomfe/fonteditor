/**
 * @file 图像锐化滤镜
 * @author mengke01(kekee000@gmail.com)
 *
 * @reference
 * http://dsqiu.iteye.com/blog/1638589
 * https://github.com/AlloyTeam/AlloyImage
 */

/**
 * 灰度图像锐化
 * @param  {Object} imageData 图像数据
 * @param  {number} lamta   锐化参数
 * @return {Object}         处理后图像
 */
export default function sharp(imageData, lamta = 0.6) {
    let width = imageData.width;
    let height = imageData.height;
    let data = imageData.data;
    for (let line = 0, y = 1; y < height; y++) {
        line = y * width;
        for (let x = 1; x < width; x++) {
            let idx = x + line;
            // 当前点减去 左侧三个像素点的平均值
            let delta = data[idx] - (data[idx - 1] + data[idx - width] + data[idx - width - 1]) / 3;
            data[idx] += Math.floor(delta * lamta);
        }
    }

    return imageData;

}
