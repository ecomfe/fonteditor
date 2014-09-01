/**
 * @file glyf2canvas.js
 * @author mengke01
 * @date 
 * @description
 * glyf 的canvas绘制
 */


define(
    function(require) {

        var glyfAdjust = require('ttf/util/glyfAdjust');

        /**
         * glyf canvas绘制
         * 
         * @param {Object} glyf glyf数据
         * @param {Context} ctx canvas的context
         * @param {Object} options 绘制参数
         */
        function glyf2canvas(glyf, ctx, options){

            if(!glyf) {
                return;
            }
            
            options = options || {};

            if(options.stroke) {
                ctx.strokeWidth = options.strokeWidth || 1;
                ctx.strokeStyle = options.strokeStyle || 'black';
            }
            else {
                ctx.fillStyle = options.fillStyle || 'black';
            }


            // 对轮廓进行反向，以及坐标系调整，取整
            glyf = glyfAdjust(glyf, options.scale);

            
            var coordinates = glyf.coordinates;
            var startPts = 0; // 起始点
            var currentPts = 0; // 结束点

            var commandQueue = []; // 命令队列

            // 处理glyf轮廓
            for ( var i = 0, l = glyf.endPtsOfContours.length; i < l; i++) {
                try {
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
                                commandQueue.push('M');
                                commandQueue.push(currentPoint);
                            }
                            // 起始点不在曲线上
                            else {

                                var midPoint = {
                                    x : (prevPoint.x + currentPoint.x) / 2,
                                    y : (prevPoint.y + currentPoint.y) / 2
                                };

                                commandQueue.push('M');
                                commandQueue.push(midPoint);

                                commandQueue.push('Q');
                                commandQueue.push(currentPoint);
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
                                commandQueue.push('L');
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
                                commandQueue.push(midPoint);
                            } 
                            // 当前坐标不在曲线上
                            else if (!currentPoint.isOnCurve) {
                                commandQueue.push('Q');
                            }
                            commandQueue.push(currentPoint);
                        }
                    }

                    // 处理最后一个点
                    if (
                        !currentPoint.isOnCurve
                        && coordinates[startPts] != undefined
                    ) {

                        // 轮廓起始点在曲线上
                      if (coordinates[startPts].isOnCurve) {
                            commandQueue.push(coordinates[startPts]);
                        } 
                        else {
                            var midPoint = {
                                x : (currentPoint.x + coordinates[startPts].x) / 2,
                                y : (currentPoint.y + coordinates[startPts].y) / 2
                            };
                            commandQueue.push(midPoint);
                        }
                    }

                    // 结束轮廓
                    commandQueue.push('Z');

                    // 处理下一个轮廓
                    startPts = glyf.endPtsOfContours[i] + 1;
                } catch (e) {
                    throw e;
                }
            }

            var offset = 0;
            var command = 0;
            var cur, start;

            commandQueue.unshift('Z');
            ctx.beginPath();
            while(command = commandQueue.shift()) {
                
                switch(command) {
                    case 'M':
                        cur = commandQueue.shift();
                        ctx.moveTo(cur.x, cur.y);
                        break;
                    case 'L':
                        cur = commandQueue.shift();
                        ctx.lineTo(cur.x, cur.y);
                        break;
                    // Q 可能有多个轮廓片段，2个为一组
                    case 'Q':
                        var p;
                        cur = commandQueue.shift();
                        while(typeof cur !== 'string') {
                            p = commandQueue.shift();
                            ctx.quadraticCurveTo(cur.x, cur.y, p.x, p.y);
                            cur = commandQueue.shift();
                        }
                        commandQueue.unshift(cur);
                        break;
                    case 'Z':
                        // 处理闭合问题
                        if(start) {
                            ctx.lineTo(start.x, start.y);
                        }

                        start = commandQueue[1];
                        
                        break;
                }
            }

            if(options.stroke) {
                ctx.stroke();
            }
            else {
                ctx.fill();
            }                     

        }

        return glyf2canvas;
    }
);
