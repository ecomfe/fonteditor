/**
 * @file 对图像进行灰度化处理
 * @author mengke01(kekee000@gmail.com)
 */

/**
 * 对图像进行灰度化处理
 *
 * @param  {Object} imageData 图像数据
 * @param  {boolean} reverse 是否反转图像
 *
 * @return {Object}           处理后的数据
 */
export default function grayImage(imageData, reverse) {

    let width = imageData.width;
    let height = imageData.height;
    let line = 0;
    let data = imageData.data;
    let newData = [];

    for (let y = 0; y < height; y++) {
        line = y * width;
        for (let x = 0; x < width; x++) {
            let idx = (x + line) * 4;
            let gray = 255;
            if (data[idx + 3] < 25) {
                gray = 255;
            }
            else {
                let r = data[idx + 0];
                let g = data[idx + 1];
                let b = data[idx + 2];
                gray = Math.floor(0.299 * r + 0.587 * g + 0.114 * b);
            }
            newData[x + line] = reverse ? 255 - gray : gray;
        }
    }

    return {
        width: width,
        height: height,
        gray: true,
        data: newData
    };
}
