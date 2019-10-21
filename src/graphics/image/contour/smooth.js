/**
 * @file 平滑轮廓
 * @author mengke01(kekee000@gmail.com)
 */

/**
 * 平滑图像轮廓
 * @param  {Array} contour 轮廓点集
 * @param  {number} smooth 平滑边界
 * @return {Array}         平滑后轮廓
 */
export default function smooth(contour, smooth) {

    smooth = Math.floor((smooth || 2) / 2);
    let div = smooth * 2 + 1;

    for (let i = 0, l = contour.length; i < l; i++) {
        let p = contour[i];
        let xAvg = p.x;
        let yAvg = p.y;
        let index;
        for (let j = 0; j < smooth; j++) {
            index = (i + l - j) % l;
            xAvg += contour[index].x;
            yAvg += contour[index].y;

            index = (i + l + j) % l;
            xAvg += contour[index].x;
            yAvg += contour[index].y;
        }
        p.x = Math.floor(xAvg / div);
        p.y = Math.floor(yAvg / div);
    }

    return contour;
}
