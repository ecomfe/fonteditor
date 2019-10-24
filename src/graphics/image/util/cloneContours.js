/**
 * @file 克隆轮廓数组
 * @author mengke01(kekee000@gmail.com)
 */

/**
 * 克隆轮廓点集
 *
 * @param  {Array} contours 轮廓点集
 * @return {Array}          克隆后的点集
 */
export default function cloneContours(contours) {
    let newContours = [];
    contours.forEach(function (contour) {
        let newContour = [];
        contour.forEach(function (p) {
            newContour.push({
                x: p.x,
                y: p.y,
                onCurve: !!p.onCurve
            });
        });
    });

    return newContours;
}
