/**
 * @file 克隆一个图像对象
 * @author mengke01(kekee000@gmail.com)
 */


export default function (imageData) {
    return {
        width: imageData.width,
        height: imageData.height,
        gray: imageData.gray,
        binarize: imageData.binarize,
        data: imageData.data.slice(0)
    };
}
