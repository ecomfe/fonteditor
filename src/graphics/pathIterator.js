/**
 * @file pathIterator.js
 * @author mengke01
 * @date 
 * @description
 * 遍历路径的路径集合，包括segment和 bezierline
 */


define(
    function(require) {
        
        /**
         * 遍历路径的路径集合
         * 
         * @param {Array} contour 坐标点集
         */
        function pathIterator(contour, callBack) {

            var curPoint, prevPoint, nextPoint; 
            var cursorPoint; // cursorPoint 为当前单个绘制命令的起点

            for (var i = 0, l = contour.length; i < l; i++) {
                curPoint = contour[i];
                prevPoint = i === 0 ? contour[l - 1] : contour[i - 1];
                nextPoint =  i === l - 1 ? contour[0] : contour[i + 1];

                // 起始坐标
                if (i == 0) {
                    if (curPoint.onCurve) {
                        cursorPoint = curPoint;
                    }
                    else {
                        if (prevPoint.onCurve) {
                            cursorPoint = prevPoint;
                        }
                        else {
                            cursorPoint = {
                                x: (prevPoint.x + curPoint.x) / 2, 
                                y: (prevPoint.y + curPoint.y) / 2
                            };
                        }
                    }
                }

                // 直线
                if (curPoint.onCurve && nextPoint.onCurve) {
                    if (false === callBack('L', cursorPoint, nextPoint)) {
                        break;
                    }
                    cursorPoint = nextPoint;
                }
                else if (!curPoint.onCurve) {

                    if (nextPoint.onCurve) {
                        if (false === callBack('Q', cursorPoint, curPoint, nextPoint)) {
                            break;
                        }
                        cursorPoint = nextPoint;
                    }
                    else {
                        var last = {
                            x: (curPoint.x + nextPoint.x) / 2,
                            y: (curPoint.y + nextPoint.y) / 2
                        };
                        if (false === callBack('Q', cursorPoint, curPoint, last)) {
                            break;
                        }
                        cursorPoint = last;
                    }
                }
            }
        }

        return pathIterator;
    }
);
