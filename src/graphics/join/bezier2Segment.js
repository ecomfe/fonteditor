/**
 * @file bezier曲线拟合成线段
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function(require) {

        var util = require('graphics/util');
        var ceilPoint = util.ceilPoint;
        var getPointHash = util.getPointHash;
        var getBezierQ2Point = require('math/getBezierQ2Point');

        /**
         * 将bezier曲线转换成clipper可处理的直线
         *
         * @param  {Array} contour 轮廓
         * @param  {Array} bezierHash 记录bezier的哈希，以便于转换回去
         * @return {Array}
         */
        function bezier2Segment(contour, bezierHash) {
            var curPoint;
            var prevPoint;
            var nextPoint;
            var result = [];

            for (var i = 0, l = contour.length; i < l; i++) {
                if (!contour[i].onCurve) {
                    curPoint = contour[i];
                    prevPoint = i === 0 ? contour[l - 1] : contour[i - 1];
                    nextPoint =  i === l - 1 ? contour[0] : contour[i + 1];
                    var firstPoint = ceilPoint(getBezierQ2Point(prevPoint, curPoint, nextPoint, 0.1));
                    var lastPoint = ceilPoint(getBezierQ2Point(prevPoint, curPoint, nextPoint, 0.9));
                    bezierHash[getPointHash(firstPoint)] = curPoint;
                    bezierHash[getPointHash(lastPoint)] = curPoint;

                    result.push(firstPoint);
                    for (var j = 2; j < 9; j++) {
                        result.push(ceilPoint(getBezierQ2Point(prevPoint, curPoint, nextPoint, j * 0.1)));
                    }
                    result.push(lastPoint);
                }
                else {
                    result.push(contour[i]);
                }
            }
            return result;
        }


        return bezier2Segment;
    }
);
