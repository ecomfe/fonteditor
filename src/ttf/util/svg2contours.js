/**
 * @file svg2contours.js
 * @author mengke01
 * @date 
 * @description
 * svg d 转换为contours
 */


define(
    function(require) {

        var bezierCubic2Q2 = require('math/bezierCubic2Q2');

        function cubic2Points(cubicList, contour) {
            // 三次贝塞尔转二次
            var q2List = [];
            cubicList.forEach(function(c) {
                q2List = q2List.concat(bezierCubic2Q2(c[0], c[1], c[2], c[3]));
            });

            var q2, prevq2;
            for (var i = 0, l = q2List.length; i < l; i++) {
                q2 = q2List[i];
                if (i == 0) {
                    contour.push({
                        x: q2[1].x,
                        y: q2[1].y
                    });
                    contour.push({
                        x: q2[2].x,
                        y: q2[2].y,
                        onCurve: true
                    });
                }
                else {
                    prevq2 = q2List[i - 1];
                    // 检查是否存在切线点
                    if (prevq2[1].x + q2[1].x == 2 * q2[0].x && prevq2[1].y + q2[1].y == 2 * q2[0].y) {
                        contour.pop();
                    }
                    contour.push({
                        x: q2[1].x,
                        y: q2[1].y
                    });
                }
            }

            contour.push({
                x: q2[2].x,
                y: q2[2].y,
                onCurve: true
            });

            return contour;
        }



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
            var contours = [], contour = [], prevX = 0, prevY = 0, prevc1;
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
                    
                    // 这里可能会连续绘制，最后一个是终点
                    var q = 0, ql = segment.args.length - 2;
                    var cubicList = [];

                    for (; q < ql ; q += 4) {
                        var cubic = [];
                        var c1 = {
                            x: prevX + segment.args[q],
                            y: prevY + segment.args[q + 1]
                        };
                        var c2 = {
                            x: prevX + segment.args[q + 2],
                            y: prevY + segment.args[q + 3]
                        };

                        // 计算中间点
                        if (q == 0) {
                            cubic.push({x: prevX, y: prevY});
                            cubic.push(c1);
                            cubic.push(c2);
                        }
                        else {
                            var prevC2 = cubicList[cubicList.length - 1][2];
                            var p1 = {
                                x: (prevC2.x + c1.x) / 2,
                                y: (prevC2.y + c1.y) / 2
                            }
                            cubicList[cubicList.length - 1][3] = p1;

                            cubic.push(p1);
                            cubic.push(c1);
                            cubic.push(c2);
                        }

                        cubicList.push(cubic);
                    }

                    prevX += segment.args[ql];
                    prevY += segment.args[ql + 1];

                    cubicList[cubicList.length - 1].push({x: prevX, y: prevY});
                    cubic2Points(cubicList, contour);
                    prevc1 = cubicList[cubicList.length - 1][2];
                }
                // 三次贝塞尔平滑
                else if (segment.cmd === 'S') {
                    
                    // 这里需要移除上一个曲线的终点
                    var p1 = contour.pop();
                    var c1 = {
                        x: 2 * p1.x - prevc1.x,
                        y: 2 * p1.y - prevc1.y
                    };
                    var c2 = {
                        x: prevX + segment.args[0],
                        y: prevX + segment.args[1]
                    };

                    prevX += segment.args[2];
                    prevY += segment.args[3];

                    var p2 = {
                        x: prevX,
                        y: prevY
                    };

                    cubic2Points([[p1, c1, c2, p2]], contour);
                    prevc1 = c2;
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
