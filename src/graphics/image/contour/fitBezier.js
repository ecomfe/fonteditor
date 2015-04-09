/**
 * @file 曲线拟合成二次bezier曲线
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        var fitCurve = require('./fitCurve');
        var bezierCubic2Q2 = require('math/bezierCubic2Q2');
        var vector = require('graphics/vector');
        var getCos = vector.getCos;

        /**
         * 三次bezier曲线点拟合点集
         *
         * @param  {Array} points 点集合
         * @param  {number} scale  当前点的scale
         * @param  {Object} tHat1  开始点单位向量
         * @param  {Object} tHat2  结束点单位向量
         * @return {Array}  结果点集
         */
        function fitBezier(points, scale, tHat1, tHat2) {
            scale = scale || 1;

            var maxError = 2 * scale * scale;

            var cubicBezier = fitCurve(points, maxError, tHat1, tHat2);
            var start = points[0];
            var result = [];
            for (var i = 0, l = cubicBezier.length; i < l; i += 3) {

                var cos = getCos(
                    start,
                    cubicBezier[i],
                    cubicBezier[i + 1]
                );

                var theta = Math.acos(cos > 1 ? 1 : cos);

                if (theta > 3) {
                    if (!i) {
                        start.onCurve = true;
                        result.push(start);
                    }
                }
                else {
                    var quadBezier = bezierCubic2Q2(start, cubicBezier[i], cubicBezier[i + 1], cubicBezier[i + 2]);
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


        return fitBezier;
    }
);
