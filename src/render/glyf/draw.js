/**
 * @file draw.js
 * @author mengke01
 * @date 
 * @description
 * 绘制glyf曲线
 */


define(
    function(require) {
        
        /**
         * 绘制glyf曲线
         * 
         * @param {CanvasContext} ctx canvas绘制对象
         * @param {Object} glyf glyf文本格式
         */
        function draw(ctx, glyf) {

            var x = glyf.x || 0;
            var y = glyf.y || 0;

            glyf.width = glyf.xMax - glyf.xMin;
            glyf.height = glyf.yMax - glyf.yMin;

            ctx.translate(x, y);

            var startPts = 0; // 起始点
            var currentPts = 0; // 结束点
            var coordinates = glyf.coordinates;
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
                            if (currentPoint.onCurve) {
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
                                && currentPoint.onCurve
                                && prevPoint != undefined
                                && prevPoint.onCurve
                            ) {
                                commandQueue.push('L');
                            }
                            // 当前点不在曲线上
                            else if (
                                !currentPoint.onCurve
                                && prevPoint != undefined
                                && !prevPoint.onCurve
                            ) {

                                var midPoint = {
                                    x : (prevPoint.x + currentPoint.x) / 2,
                                    y : (prevPoint.y + currentPoint.y) / 2
                                };
                                commandQueue.push(midPoint);
                            } 
                            // 当前坐标不在曲线上
                            else if (!currentPoint.onCurve) {
                                commandQueue.push('Q');
                            }
                            commandQueue.push(currentPoint);
                        }
                    }

                    // 处理最后一个点
                    if (
                        !currentPoint.onCurve
                        && coordinates[startPts] != undefined
                    ) {

                        // 轮廓起始点在曲线上
                      if (coordinates[startPts].onCurve) {
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

            ctx.translate(-x, -y);
        }


        return draw;
    }
);
