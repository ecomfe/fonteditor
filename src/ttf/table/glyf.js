/**
 * @file glyf.js
 * @author mengke01
 * @date 
 * @description
 * glyf表
 * 
 * modified from svg2ttf
 * https://github.com/fontello/svg2ttf
 */

define(
    function(require) {
        var glyFlag = require('../enum/glyFlag');
        var componentFlag = require('../enum/componentFlag');
        var table = require('./table');
        var TTFglyf = require('./ttfglyf');

        /**
         * 获取glyf的大小
         * 
         * @param {Object} glyf glyf对象
         * @return {number} 大小
         */
        function sizeof(glyf, flags) {
            if (!glyf.contours.length) {
                return 0;
            }

            //fixed header + instructions + endPtsOfContours
            var result = 10
                + 2
                + (glyf.instructions ? glyf.instructions.length : 0) 
                + glyf.contours.length * 2;

            flags.forEach(function(flag) {
                result += flag & glyFlag.XSHORT ? 1 : 2;
                result += flag & glyFlag.YSHORT ? 1 : 2;
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
         * 获取flats
         * 
         * @param {Object} glyf glyf对象
         * @return {Array}
         */
        function getFlags(glyf) {
            var flags = [];
            var prev = {};
            glyf.contours.forEach(function(contour) {
                contour.forEach(function(p) {
                    var flag = p.onCurve ? glyFlag.ONCURVE : 0;

                    if (-0xFF <= p.x && p.x <= 0xFF) {
                        flag += glyFlag.XSHORT;
                    }

                    if (p.x == prev.x) {
                        flag += glyFlag.XSAME;
                    }

                    if (-0xFF <= p.y && p.y <= 0xFF) {
                        flag += glyFlag.YSHORT;
                    }

                    if (p.y == prev.y) {
                        flag += glyFlag.YSAME;
                    }

                    flags.push(flag);
                });
            });

            // remove repeating flags
            var result = [], prev = -1;
            flags.forEach(function(flag) {
                if (prev == flag) {
                    result[result.length - 1] |= glyFlag.REPEAT;
                }
                else {
                    prev = flag;
                    result.push(flag);
                }
            });

            return result;
        }


        var glyf = table.create(
            'glyf', 
            [], 
            {
                /**
                 * 解析glyfl表
                 */
                read: function(reader, ttf) {
                    var glyfOffset = this.offset;
                    var loca = ttf.loca;
                    var numGlyphs = ttf.maxp.numGlyphs;
                    var glyf = [];
                    var glyfPath = new TTFglyf();

                    reader.seek(glyfOffset);

                    // 解析字体轮廓
                    for ( var i = 0, l = numGlyphs; i < l; i++) {
                        var offset = glyfOffset + loca[i];

                        // 空路径
                        if(i + 1 < l && loca[i] === loca[i + 1]) {
                            glyf[i] = TTFglyf.empty();
                        }
                        else {
                            glyfPath.offset = offset;
                            glyf[i] = glyfPath.read(reader, ttf);
                        }
                    }
                    return glyf;
                },
                write: function(writer, ttf) {
                    
                    ttf.glyf.forEach(function(glyf, index) {

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

                            // //write x coord
                            // glyf.contours.forEach(function(contour) {
                            //     contour.forEach(function(p) {
                            //         if (-0xFF <= p.x && p.x <= 0xFF) {
                            //             writer.writeUint8(Math.abs(p.x));
                            //         }
                            //         else {
                            //             writer.writeInt16(p.x);
                            //         }
                            //     });
                            // });

                            // //write y coord
                            // glyf.contours.forEach(function(contour) {
                            //     contour.forEach(function(p) {
                            //         if (-0xFF <= p.y && p.y <= 0xFF) {
                            //             writer.writeUint8(Math.abs(p.y));
                            //         }
                            //         else {
                            //             writer.writeInt16(p.y);
                            //         }
                            //     });
                            // });
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

                        var flags = glyf.compound ? [] : getFlags(glyf);
                        var contours = glyf.compound ? sizeofCompound(glyf) : sizeof(glyf, flags);
                        var size = contours + flags.length;

                        // 记录实际size, 用于4字节对齐
                        var glyfSize = size;

                         // glyph size must be divisible by 4.
                        if (size % 4) {
                            size += 4 - size % 4;
                        }

                        ttf.support.glyf.push({
                            flags: flags,
                            size: size,
                            glyfSize: glyfSize
                        });

                        tableSize += size;
                    });

                    return tableSize;
                }
            }
        );

        return glyf;
    }
);