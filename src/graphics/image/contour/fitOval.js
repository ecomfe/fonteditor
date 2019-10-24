/**
 * @file 拟合圆
 * @author mengke01(kekee000@gmail.com)
 */


import pathUtil from 'graphics/pathUtil';
import computeBoundingBox from 'graphics/computeBoundingBox';
import pathAdjust from 'graphics/pathAdjust';
import circlePath from 'graphics/path/circle';
import lang from 'common/lang';

/**
 * 拟合椭圆
 *
 * @param  {Array} points 轮廓
 * @return {Object}         bound
 */
export default function fitOval(points) {
    let b = computeBoundingBox.computeBounding(points);
    let bound = computeBoundingBox.computePath(circlePath);
    let scaleX = b.width / bound.width;
    let scaleY = b.height / bound.height;
    let contour = lang.clone(circlePath);
    pathAdjust(contour, scaleX, scaleY);
    pathAdjust(contour, 1, 1, b.x - bound.x, b.y - bound.y);
    return pathUtil.isClockWise(points) === -1 ? contour : contour.reverse();
}

