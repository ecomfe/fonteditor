/**
 * @file contour2svg.js
 * @author mengke01
 * @date 
 * @description
 * 将路径转换为svg路径
 */


define(
    function(require) {

        /**
         * 将路径转换为svg路径
         * 
         * @param {Array} contour 轮廓序列
         * @return {string} 路径
         */
        function contour2svg(contour) {

            var pathArr = [];

            var curPoint, prevPoint, nextPoint;
            for (var i = 0, l = contour.length; i < l; i++) {
                curPoint = contour[i];
                prevPoint = i === 0 ? contour[l - 1] : contour[i - 1];
                nextPoint =  i === l - 1 ? contour[0] : contour[i + 1];

                // 起始坐标
                if (i == 0) {
                    if (curPoint.onCurve) {
                        pathArr.push('M' + curPoint.x + ' ' + curPoint.y);
                    }
                    else {
                        if (prevPoint.onCurve) {
                            pathArr.push('M' + prevPoint.x + ' ' + prevPoint.y);
                        }
                        else {
                            pathArr.push('M' + ((prevPoint.x + curPoint.x) / 2) + ' ' + ((prevPoint.y + curPoint.y) / 2));
                        }
                    }
                }

                // 直线
                if (curPoint.onCurve && nextPoint.onCurve) {
                    pathArr.push('L' + nextPoint.x + ' ' + nextPoint.y);
                }
                else if (!curPoint.onCurve) {
                    if (nextPoint.onCurve) {
                        pathArr.push('Q' + curPoint.x + ' ' + curPoint.y + ' ' + nextPoint.x + ' ' + nextPoint.y);
                    }
                    else {
                        pathArr.push('Q' + curPoint.x + ' ' + curPoint.y + ' '
                            + ((curPoint.x + nextPoint.x) / 2) + ' ' + ((curPoint.y + nextPoint.y) / 2));
                    }
                }
            }
            pathArr.push('Z');
            return pathArr.join(' ');
        }

        return contour2svg;
    }
);
