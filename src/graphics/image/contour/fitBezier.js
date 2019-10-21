/**
 * @file 曲线拟合成二次bezier曲线
 * @author mengke01(kekee000@gmail.com)
 */

import fitCurve from './fitCurve';
import bezierCubic2Q2 from 'math/bezierCubic2Q2';
import vector from 'graphics/vector';

/**
 * 三次bezier曲线点拟合点集
 *
 * @param  {Array} points 点集合
 * @param  {number} scale  当前点的scale
 * @param  {Object} tHat1  开始点单位向量
 * @param  {Object} tHat2  结束点单位向量
 * @return {Array}  结果点集
 */
export default function fitBezier(points, scale, tHat1, tHat2) {
    scale = scale || 1;

    let maxError = 2 * scale * scale;

    let cubicBezier = fitCurve(points, maxError, tHat1, tHat2);
    let start = points[0];
    let result = [];
    for (let i = 0, l = cubicBezier.length; i < l; i += 3) {

        let cos = vector.getCos(
            start,
            cubicBezier[i],
            cubicBezier[i + 1]
        );

        let theta = Math.acos(cos > 1 ? 1 : cos);

        if (theta > 3) {
            if (!i) {
                start.onCurve = true;
                result.push(start);
            }
        }
        else {
            let quadBezier = bezierCubic2Q2(start, cubicBezier[i], cubicBezier[i + 1], cubicBezier[i + 2]);
            // 三次bezier曲线可能转成1条二次bezier曲线
            if (quadBezier.length === 1) {
                quadBezier[0][2].onCurve = true;
                result.push(quadBezier[0][1]);
                result.push(quadBezier[0][2]);
            }
            else {
                quadBezier[0][2].onCurve = true;
                result.push(quadBezier[0][1]);
                result.push(quadBezier[0][2]);
                quadBezier[1][2].onCurve = true;
                result.push(quadBezier[1][1]);
                result.push(quadBezier[1][2]);
            }
        }

        start = cubicBezier[i + 2];
    }

    return result.map(function (p) {
        return {
            x: p.x,
            y: p.y,
            onCurve: !!p.onCurve
        };
    });
}
