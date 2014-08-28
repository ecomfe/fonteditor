/**
 * @file glyf2svg.js
 * @author mengke01
 * @date 
 * @description
 * glyf转换svg
 * 
 * thanks to：
 * ynakajima/ttf.js
 * https://github.com/ynakajima/ttf.js
 */


define(
    function(require) {
        
        /**
         * glyf转换svg 
         * 
         * @param {Object} glyf 解析后的glyf结构
         * @return {string} svg文本
         */
        function glyf2svg(glyf) {

            var pathArray = [];
            var startPts = 0; // 起始点
            var currentPts = 0; // 结束点

            if(!glyf) {
                return null;
            }

            // 处理glyf轮廓
            for ( var i = 0, l = glyf.endPtsOfContours.length; i < l; i++) {
                try {
                    // 处理glyf坐标
                    for ( var endPts = glyf.endPtsOfContours[i]; currentPts < endPts + 1; currentPts++) {

                        var path = "";
                        var currentPoint = glyf.coordinates[currentPts];
                        var prevPoint = (currentPts === startPts) 
                            ? glyf.coordinates[endPts]
                            : glyf.coordinates[currentPts - 1];
                        var nextPoint = (currentPts === endPts) 
                            ? glyf.coordinates[startPts]
                            : glyf.coordinates[currentPts + 1];

                        if (currentPoint == undefined) {
                            continue;
                        }

                        // 处理起始点
                        if (currentPts === startPts) {
                            if (currentPoint.isOnCurve) {
                                path += "M" 
                                    + currentPoint.x 
                                    + "," 
                                    + currentPoint.y
                                    + " ";
                            }
                            // 起始点不在曲线上
                            else {

                                var midPoint = {
                                    x : (prevPoint.x + currentPoint.x) / 2,
                                    y : (prevPoint.y + currentPoint.y) / 2
                                };

                                path += "M" 
                                    + midPoint.x 
                                    + "," 
                                    + midPoint.y 
                                    + " Q"  
                                    + currentPoint.x 
                                    + "," 
                                    + currentPoint.y
                                    + " ";
                            }
                        } 
                        else {

                            // 直线
                            if (
                                currentPoint != undefined
                                && currentPoint.isOnCurve
                                && prevPoint != undefined
                                && prevPoint.isOnCurve
                            ) {
                                path += " L";
                            }
                            // 当前点不在曲线上
                            else if (
                                !currentPoint.isOnCurve
                                && prevPoint != undefined
                                && !prevPoint.isOnCurve
                            ) {

                                var midPoint = {
                                    x : (prevPoint.x + currentPoint.x) / 2,
                                    y : (prevPoint.y + currentPoint.y) / 2
                                };
                                path += midPoint.x 
                                    + "," 
                                    + midPoint.y
                                    + " ";
                            } 
                            // 当前坐标不在曲线上
                            else if (!currentPoint.isOnCurve) {
                                path += " Q";
                            }

                            // 当前坐标
                            path += currentPoint.x + "," + currentPoint.y + " ";
                        }
                        pathArray.push(path);
                    }

                    // 当前点不在曲线上
                    if (
                        !currentPoint.isOnCurve
                        && glyf.coordinates[startPts] != undefined
                    ) {

                        // 轮廓起始点在曲线上
                      if (glyf.coordinates[startPts].isOnCurve) {
                            pathArray.push(
                                glyf.coordinates[startPts].x 
                                + ","
                                + glyf.coordinates[startPts].y 
                                + " "
                            );
                        } 
                        else {
                            var midPoint = {
                                x : (currentPoint.x + glyf.coordinates[startPts].x) / 2,
                                y : (currentPoint.y + glyf.coordinates[startPts].y) / 2
                            };
                            pathArray.push(midPoint.x + "," + midPoint.y + " ");
                        }
                    }

                    // 结束轮廓
                    pathArray.push(" Z ");

                    // 处理下一个轮廓
                    startPts = glyf.endPtsOfContours[i] + 1;
                } catch (e) {
                    throw e;
                }
            }
            return pathArray.join(" ");
        }



        return glyf2svg;
    }
);
