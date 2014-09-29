/**
 * @file glyfwriter.js
 * @author mengke01
 * @date 
 * @description
 * glyf 相关的写方法
 */


define(
    function(require) {

        var glyFlag = require('../enum/glyFlag');
        var componentFlag = require('../enum/componentFlag');

        /**
         * 获取glyf的大小
         * 
         * @param {Object} glyf glyf对象
         * @return {number} 大小
         */
        function sizeof(glyf, glyfSupport) {
            if (!glyf.contours.length) {
                return 0;
            }

            //fixed header + instructions + endPtsOfContours
            var result = 10
                + 2
                + (glyf.instructions ? glyf.instructions.length : 0) 
                + glyf.contours.length * 2
                + glyfSupport.flags.length;

            
            glyfSupport.xCoord.forEach(function(x) {
                result += 0 <= x && x <= 0xFF ? 1 : 2;
            });

            glyfSupport.yCoord.forEach(function(y) {
                result += 0 <= y && y <= 0xFF ? 1 : 2;
            });

            return result;
        }

       /**
         * 复合图元size
         * 
         * @param {Object} glyf glyf对象
         * @return {number} 大小
         */
        function sizeofCompound(glyf) {
            var size = 10;
            glyf.glyfs.forEach(function(g) {
                // flags + glyfIndex
                size += 4;

                // a, b, c, d, e
                // xy values or points
                if(g.e >= -0xFF && g.e <= 0xFF && g.f >= 0xFF && g.f <= 0xFF) {
                    size += 2;
                }
                else {
                    size += 4;
                }

                // scale
                if (g.a != 1 || g.d != 1) {
                    size += g.a == g.d ? 2 : 4;
                }

                // 01 , 10
                if (g.b || g.c) {
                    size += 4;
                }
            });

            if (glyf.instructions) {
                size += 2 + glyf.instructions.length;
            }

            return size;
        }



        /**
         * 获取flags
         * 
         * @param {Object} glyf glyf对象
         * @return {Array}
         */
        function getFlags(glyf, glyfSupport) {

            if (!glyf.contours.length) {
                return glyfSupport;
            }


            var prev = {};
            var flags = [];
            var xCoord = [];
            var yCoord = [];
            var first = true;

            glyf.contours.forEach(function(contour) {
                contour.forEach(function(p) {
                    if (first) {
                        xCoord.push(p.x);
                        yCoord.push(p.y);
                    }
                    else {
                        xCoord.push(p.x - prev.x);
                        yCoord.push(p.y - prev.y);
                    }
                    flags.push(p.onCurve ? glyFlag.ONCURVE : 0);
                    prev = p;
                    first = false;
                });
            });

            // compress
            var flagsC = [];
            var xCoordC = [];
            var yCoordC = [];
            var x, y, prevX, prevY, prevFlag, repeatPoint = -1;

            flags.forEach(function(flag, index) {

                x = xCoord[index];
                y = yCoord[index];

                // 第一个
                if (index == 0) {

                    if (-0xFF <= x && x <= 0xFF) {
                        flag += glyFlag.XSHORT;
                        if(x >= 0) {
                            flag += glyFlag.XSAME;
                        }

                        x = Math.abs(x);
                    }


                    if (-0xFF <= y && y <= 0xFF) {
                        flag += glyFlag.YSHORT;
                        if(y >= 0) {
                            flag += glyFlag.YSAME;
                        }

                        y = Math.abs(y);
                    }


                    flagsC.push(prevFlag = flag);
                    xCoordC.push(x);
                    yCoordC.push(y);
                }
                //后续
                else {
                    prevX = xCoord[index - 1];
                    prevY = yCoord[index - 1];

                    if (x == 0) {
                        flag += glyFlag.XSAME;
                    }
                    else {
                        if (-0xFF <= x && x <= 0xFF) {
                            flag += glyFlag.XSHORT;
                            if(x > 0) {
                                flag += glyFlag.XSAME;
                            }

                            x = Math.abs(x);
                        }

                        xCoordC.push(x);
                    }

                    if (y == 0) {
                        flag += glyFlag.YSAME;
                    }
                    else {
                        if (-0xFF <= y && y <= 0xFF) {
                            flag += glyFlag.YSHORT;
                            if(y > 0) {
                                flag += glyFlag.YSAME;
                            }
                            y = Math.abs(y);
                        }
                        yCoordC.push(y);
                    }

                    // repeat
                    if (flag == prevFlag) {
                        // 记录重复个数
                        if (-1 == repeatPoint) {
                            repeatPoint = flagsC.length - 1;
                            flagsC[repeatPoint] |= glyFlag.REPEAT;
                            flagsC.push(1);
                        }
                        else {
                            ++flagsC[repeatPoint + 1];
                        }
                    }
                    else {
                        repeatPoint = -1;
                        flagsC.push(prevFlag = flag);
                    }
                }

            });

            glyfSupport.flags = flagsC;
            glyfSupport.xCoord = xCoordC;
            glyfSupport.yCoord = yCoordC;

            return glyfSupport;
        }


        return {
            write: function(writer, ttf) {
                    
                ttf.glyf.forEach(function(glyf, index) {

                    if (!glyf.compound && 0 == glyf.contours.length) {
                        return;
                    }

                    // header
                    writer.writeUint16(glyf.compound ? -1 : glyf.contours.length);
                    writer.writeInt16(glyf.xMin);
                    writer.writeInt16(glyf.yMin);
                    writer.writeInt16(glyf.xMax);
                    writer.writeInt16(glyf.yMax);

                    // 复合图元
                    if (glyf.compound) {
                        
                        for (var i = 0, l = glyf.glyfs; i < l; i++) {

                            var flags = componentFlag.ARGS_ARE_XY_VALUES; // xy values

                            // more components
                            if (i < l - 1) {
                                flags += componentFlag.MORE_COMPONENTS;
                            }

                            var g = glyf.glyfs[i];

                            // instructions
                            flags += glyf.instructions ? componentFlag.WE_HAVE_INSTRUCTIONS : 0;
                            // use my metrics
                            flags += g.useMyMetrics ? componentFlag.USE_MY_METRICS : 0;
                            // overlap compound
                            flags += g.overlapCompound ? componentFlag.OVERLAP_COMPOUND : 0;

                            var a = g.a;
                            var b = g.b;
                            var c = g.c;
                            var d = g.d;
                            var e = g.e;
                            var f = g.f;

                            // xy values or points
                            if(e < -0xFF || e > 0xFF || f < 0xFF || f > 0xFF) {
                                flags += componentFlag.ARG_1_AND_2_ARE_WORDS;
                            }

                            if (b || c) {
                                flags += componentFlag.WE_HAVE_A_TWO_BY_TWO;
                            }
                            else {
                                if (a != 1 || d != 1 && a == d) {
                                    flags += componentFlag.WE_HAVE_A_SCALE;
                                }
                                else if (a != 1 || d != 1) {
                                    flags += componentFlag.WE_HAVE_AN_X_AND_Y_SCALE;
                                }
                            }

                            writer.writeUint16(e);

                            if (componentFlag.ARG_1_AND_2_ARE_WORDS & flags) {
                                writer.writeInt16(e);
                                writer.writeInt16(f);

                            }
                            else {
                                writer.writeInt8(e);
                                writer.writeInt8(f);
                            }

                            if (componentFlag.WE_HAVE_A_SCALE & flags) {
                                writer.writeInt16(Math.round(a * 16384));
                            }
                            else if (componentFlag.WE_HAVE_AN_X_AND_Y_SCALE & flags) {
                                writer.writeInt16(Math.round(a * 16384));
                                writer.writeInt16(Math.round(d * 16384));
                            }
                            else if (componentFlag.WE_HAVE_A_TWO_BY_TWO & flags) {
                                writer.writeInt16(Math.round(a * 16384));
                                writer.writeInt16(Math.round(b * 16384));
                                writer.writeInt16(Math.round(c * 16384));
                                writer.writeInt16(Math.round(d * 16384));
                            }
                        }

                        if (glyf.instructions) {
                            var instructions = glyf.instructions;
                            writer.writeUint16(instructions.length);
                            for (var i = 0, l = instructions.length; i < l; i++) {
                                writer.writeUint8(instructions[i] & 0xFF);
                            }
                        }

                    }
                    else {
                        var endPtsOfContours = -1;
                        glyf.contours.forEach(function(contour) {
                            endPtsOfContours += contour.length;
                            writer.writeUint16(endPtsOfContours);
                        });

                        // not support instruction
                        if (glyf.instructions) {
                            var instructions = glyf.instructions;
                            writer.writeUint16(instructions.length);
                            for (var i = 0, l = instructions.length; i < l; i++) {
                                writer.writeUint8(instructions[i] & 0xFF);
                            }
                        }
                        else {
                            writer.writeUint16(0);
                        }
                        
                        // 获取暂存中的flags
                        var flags = ttf.support.glyf[index].flags;
                        for (var i = 0, l = flags.length; i < l; i++) {
                            writer.writeUint8(flags[i]);
                        }

                        var xCoord = ttf.support.glyf[index].xCoord;
                        for (var i = 0, l = xCoord.length; i < l; i++) {
                            if (0 <= xCoord[i] && xCoord[i] <= 0xFF) {
                                writer.writeUint8(xCoord[i]);
                            }
                            else {
                                writer.writeInt16(xCoord[i]);
                            }
                        }

                        var yCoord = ttf.support.glyf[index].yCoord;
                        for (var i = 0, l = yCoord.length; i < l; i++) {
                            if (0 <= yCoord[i] && yCoord[i] <= 0xFF) {
                                writer.writeUint8(yCoord[i]);
                            }
                            else {
                                writer.writeInt16(yCoord[i]);
                            }
                        }
                    }

                    // 4字节对齐
                    var glyfSize = ttf.support.glyf[index].glyfSize;
                    if (glyfSize % 4) {
                        for (var i = 0, l = 4 - glyfSize % 4; i < l; i++) {
                            writer.writeUint8(0);
                        }
                    }
                });

                return writer;
            },
            size: function(ttf) {

                ttf.support.glyf = [];
                var tableSize = 0;
                ttf.glyf.forEach(function(glyf) {
                    var glyfSupport = {};
                    var glyfSupport = glyf.compound ? glyfSupport : getFlags(glyf, glyfSupport);
                    var contoursSize = glyf.compound ? sizeofCompound(glyf) : sizeof(glyf, glyfSupport);
                    var size = contoursSize;

                    // 记录实际size, 用于4字节对齐
                    var glyfSize = size;

                     // glyph size must be divisible by 4.
                    if (size % 4) {
                        size += 4 - size % 4;
                    }

                    glyfSupport.glyfSize = glyfSize;
                    glyfSupport.size = size;

                    ttf.support.glyf.push(glyfSupport);

                    tableSize += size;
                });

                ttf.support.glyf.tableSize = tableSize;

                // 设置其他表的信息
                var xMin = 16384, yMin = 16384, xMax = -16384, yMax = -16384;
                ttf.glyf.forEach(function(glyf) {
                    if (glyf.xMin < xMin) {
                        xMin = glyf.xMin;
                    }
                    if (glyf.yMin < yMin) {
                        yMin = glyf.yMin;
                    }
                    if (glyf.xMax > xMax) {
                        xMax = glyf.xMax;
                    }
                    if (glyf.yMax > yMax) {
                        yMax = glyf.yMax;
                    }
                });

                ttf.head.xMin = xMin;
                ttf.head.yMin = yMin;
                ttf.head.xMax = xMax;
                ttf.head.yMax = yMax;
                ttf.head.indexToLocFormat = tableSize > 65536 ? 1 : 0;

                return ttf.support.glyf.tableSize;
            }
        };
    }
);
