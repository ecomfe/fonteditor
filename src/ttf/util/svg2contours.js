/**
 * @file svg2contours.js
 * @author mengke01
 * @date 
 * @description
 * svg d 转换为contours
 */


define(
    function(require) {

        /**
         * svg path 转 contours
         * 
         * @param {string} path path对象
         * @return {Array} contours
         */
        function svg2contours(path) {
            
            if (!path || !path.length) {
                return null;
            }

            // 获取segments
            var segments = [];
            var cmd, lastIndex, args, segReg = /\-?\d+(?:\.\d+)?\b/g;
            for (var i = 0, l = path.length;i < l; i++) {
                var c = path.charAt(i).toUpperCase();
                switch (c) {
                    case 'M':
                        if (i == 0) {
                            cmd = c;
                            lastIndex = 1;
                            break;
                        }
                    case 'Q':
                    case 'T':
                    case 'C':
                    case 'S':
                    case 'H':
                    case 'V':
                    case 'L':
                    case 'A':
                    case 'Z':
                        if (cmd == 'Z') {
                            segments.push({cmd:'Z'});
                        }
                        else {
                            args = path.slice(lastIndex, i);
                            segments.push({
                                cmd: cmd,
                                args: args.match(segReg).map(function(d) {
                                    return +d.trim();
                                })
                            });
                        }

                        cmd = c;
                        lastIndex = i + 1;
                        break;
                }
            }

            segments.push({cmd:'Z'});

            // 解析segments
            var contours = [], contour = [], prevX = 0, prevY = 0;
            for (var i = 0, l = segments.length;i < l; i++) {
                segment = segments[i];

                if (segment.cmd === 'Z') {
                    contours.push(contour);
                    contour = [];
                }
                else if (segment.cmd === 'M') {
                    prevX = segment.args[0];
                    prevY = segment.args[1];
                    contour.push({
                        x: prevX,
                        y: prevY,
                        onCurve: true
                    });
                }
                else if (segment.cmd === 'H') {
                    prevX += segment.args[0];
                    contour.push({
                        x: prevX,
                        y: prevY,
                        onCurve: true
                    });
                }
                else if (segment.cmd === 'V') {
                    prevY += segment.args[0];
                    contour.push({
                        x: prevX,
                        y: prevY,
                        onCurve: true
                    });
                }
                else if (segment.cmd === 'L') {
                    prevX += segment.args[0];
                    prevY += segment.args[1];
                    contour.push({
                        x: prevX,
                        y: prevY,
                        onCurve: true
                    });
                }
                // 二次贝塞尔
                else if (segment.cmd === 'Q') {
                    // 这里可能会连续绘制，最后一个是终点
                    var q = 0, ql = segment.args.length - 2;
                    for (; q < ql ; q += 2) {
                        contour.push({
                            x: prevX + segment.args[q],
                            y: prevY + segment.args[q + 1]
                        });
                    }

                    prevX += segment.args[ql];
                    prevY += segment.args[ql + 1];

                    contour.push({
                        x: prevX,
                        y: prevY,
                        onCurve: true
                    });
                }
                // 二次贝塞尔平滑
                else if (segment.cmd === 'T') {

                    var pc = contour[contour.length - 2];
                    
                    // 这里需要移除上一个曲线的终点
                    contour.pop();

                    contour.push({
                        x: 2 * prevX - pc.x,
                        y: 2 * prevY - pc.y
                    });

                    prevX += segment.args[0];
                    prevY += segment.args[1];
                    contour.push({
                        x: prevX,
                        y: prevY,
                        onCurve: true
                    });
                }
                // 三次贝塞尔
                else if (segment.cmd === 'C') {
                    throw 'not support cubic bezier';
                }
                // 三次贝塞尔平滑
                else if (segment.cmd === 'S') {
                    throw 'not support cubic bezier';
                }
                // 圆弧
                else if (segment.cmd === 'A') {
                    throw 'not support arc';
                }
            }

            return contours;
        }



        return svg2contours;
    }
);
