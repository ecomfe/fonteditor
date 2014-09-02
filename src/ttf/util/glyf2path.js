/**
 * @file glyf2path.js
 * @author mengke01
 * @date 
 * @description
 * glyf转换成path结构
 */


define(
    function(require) {
       

var glyfAdjust = require('ttf/util/glyfAdjust');

        /**
         * glyf转换成path结构，以便于控制
         * 
         * @param {Object} glyf glyf数据
         * @param {Context} ctx canvas的context
         * @param {Object} options 绘制参数
         */
        function glyf2path(glyf, options){

            if(!glyf) {
                return;
            }
            
            options = options || {};

            // 对轮廓进行反向，以及坐标系调整，取整
            glyf = glyfAdjust(glyf, options.scale);

            
            var coordinates = glyf.coordinates;
            var startPts = 0; // 起始点
            var currentPts = 0; // 结束点

            var pathArr = []; // 路径序列

            // 处理glyf轮廓
            for ( var i = 0, l = glyf.endPtsOfContours.length; i < l; i++) {
                try {

                    var commandQueue = [];
                    var curBezier = null;
                    // 处理glyf坐标
                    for ( var endPts = glyf.endPtsOfContours[i]; currentPts < endPts + 1; currentPts++) {

                        var currentPoint = coordinates[currentPts];
                        var prevPoint = (currentPts === startPts) 
                            ? coordinates[endPts]
                            : coordinates[currentPts - 1];
                        var nextPoint = (currentPts === endPts) 
                            ? coordinates[startPts]
                            : coordinates[currentPts + 1];

                        if (currentPoint == undefined) {
                            continue;
                        }

                        // 处理起始点
                        if (currentPts === startPts) {
                            if (currentPoint.isOnCurve) {
                                commandQueue.push({
                                    c: 'M',
                                    p: {
                                        x: currentPoint.x,
                                        y: currentPoint.y
                                    }
                                });
                            }
                            // 起始点不在曲线上
                            else {

                                var midPoint = {
                                    x : (prevPoint.x + currentPoint.x) / 2,
                                    y : (prevPoint.y + currentPoint.y) / 2
                                };

                                commandQueue.push({
                                    c: 'M',
                                    p: midPoint
                                });

                                commandQueue.push(curBezier = {
                                    c: 'Q',
                                    p1: {
                                        x: currentPoint.x,
                                        y: currentPoint.y
                                    }
                                });
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
                                if(curBezier) {
                                    curBezier.p = prevPoint;
                                    curBezier = null;
                                }
                                commandQueue.push({
                                    c: 'L',
                                    p: {
                                        x: currentPoint.x,
                                        y: currentPoint.y
                                    }
                                });
                            }
                            // 当前点不在曲线上，并且上一个点不在曲线上
                            // 贝塞尔曲线的连续情况
                            else if (
                                !currentPoint.isOnCurve
                                && prevPoint != undefined
                                && !prevPoint.isOnCurve
                            ) {

                                var midPoint = {
                                    x : (prevPoint.x + currentPoint.x) / 2,
                                    y : (prevPoint.y + currentPoint.y) / 2
                                };

                                if(curBezier) {
                                    curBezier.p = midPoint;
                                }
                                
                                commandQueue.push(curBezier = {
                                    c: 'Q',
                                    p1: {
                                        x: currentPoint.x,
                                        y: currentPoint.y
                                    }
                                });

                            } 
                            // 当前坐标不在曲线上
                            else if (!currentPoint.isOnCurve) {
                                commandQueue.push(curBezier = {
                                    c: 'Q',
                                    p1: {
                                        x: currentPoint.x,
                                        y: currentPoint.y
                                    }
                                });

                            }
                        }
                    }

                    // 处理最后一个点
                    if (
                        !currentPoint.isOnCurve
                        && coordinates[startPts] != undefined
                    ) {

                        // 轮廓起始点在曲线上
                      if (coordinates[startPts].isOnCurve) {
                            if(curBezier) {
                                curBezier.p = {
                                    x: coordinates[startPts].x,
                                    y: coordinates[startPts].y
                                };
                            }
                        } 
                        else {

                            var midPoint = {
                                x : (currentPoint.x + coordinates[startPts].x) / 2,
                                y : (currentPoint.y + coordinates[startPts].y) / 2
                            };

                            if(curBezier) {
                                curBezier.p = midPoint;
                            }
                        }
                    }

                    commandQueue.push({
                        c: 'Z',
                        p: {
                            x: coordinates[startPts].x,
                            y: coordinates[startPts].y
                        }
                    });

                    pathArr.push(commandQueue);
                    // 处理下一个轮廓
                    startPts = glyf.endPtsOfContours[i] + 1;
                } catch (e) {
                    throw e;
                }
            }

            return pathArr;

        }


        return glyf2path;
    }
);
