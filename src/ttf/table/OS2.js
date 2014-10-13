/**
 * @file OS2.js
 * @author mengke01
 * @date 
 * @description
 * OS/2表
 * 字体的发行商，上标，下标，删除线位置
 * http://www.microsoft.com/typography/otspec/os2.htm
 */
define(
    function(require) {
        var table = require('./table');
        var struct = require('./struct');
        var lang = require('common/lang');
        var error = require('../error');
        
        var OS2 = table.create(
            'OS/2', 
            [
                ['version', struct.Uint16],

                ['xAvgCharWidth', struct.Int16],
                ['usWeightClass', struct.Uint16],
                ['usWidthClass', struct.Uint16],

                ['fsType', struct.Uint16],

                ['ySubscriptXSize', struct.Uint16],
                ['ySubscriptYSize', struct.Uint16],
                ['ySubscriptXOffset', struct.Uint16],
                ['ySubscriptYOffset', struct.Uint16],

                ['ySuperscriptXSize', struct.Uint16],
                ['ySuperscriptYSize', struct.Uint16],
                ['ySuperscriptXOffset', struct.Uint16],
                ['ySuperscriptYOffset', struct.Uint16],

                ['yStrikeoutSize', struct.Uint16],
                ['yStrikeoutPosition', struct.Uint16],

                ['sFamilyClass', struct.Uint16],

                //Panose
                ['bFamilyType', struct.Uint8],
                ['bSerifStyle', struct.Uint8],
                ['bWeight', struct.Uint8],
                ['bProportion', struct.Uint8],
                ['bContrast', struct.Uint8],
                ['bStrokeVariation', struct.Uint8],
                ['bArmStyle', struct.Uint8],
                ['bLetterform', struct.Uint8],
                ['bMidline', struct.Uint8],
                ['bXHeight', struct.Uint8],

                // unicode range
                ['ulUnicodeRange1', struct.Uint32],
                ['ulUnicodeRange2', struct.Uint32],
                ['ulUnicodeRange3', struct.Uint32],
                ['ulUnicodeRange4', struct.Uint32],

                // char 4
                ['achVendID', struct.String, 4],

                ['fsSelection', struct.Uint16],
                ['usFirstCharIndex', struct.Uint16],
                ['usLastCharIndex', struct.Uint16],

                ['sTypoAscender', struct.Int16],
                ['sTypoDescender', struct.Int16],
                ['sTypoLineGap', struct.Int16],

                ['usWinAscent', struct.Uint16],
                ['usWinDescent', struct.Uint16],

                ['ulCodePageRange1', struct.Uint32],
                ['ulCodePageRange2', struct.Uint32],

                ['sxHeight', struct.Int16],
                ['sCapHeight', struct.Int16],

                ['usDefaultChar', struct.Uint16],
                ['usBreakChar', struct.Uint16],
                ['usMaxContext', struct.Uint16]
            ],

            {
                size: function(ttf) {

                    //更新其他表的统计信息

                    // header
                    var xMin = 16384,
                        yMin = 16384,
                        xMax = -16384,
                        yMax = -16384;

                    //hhea
                     var advanceWidthMax = -1,
                        minLeftSideBearing = 16384,
                        minRightSideBearing = 16384,
                        xMaxExtent = -16384;

                    // os2 count
                    var xAvgCharWidth = 0,
                        usFirstCharIndex = 0xFFFF,
                        usLastCharIndex = -1;

                    // maxp
                    var maxPoints = 0,
                        maxContours = 0,
                        maxCompositePoints = 0,
                        maxCompositeContours = 0,
                        maxSizeOfInstructions = 0,
                        maxComponentElements = 0;

                    var glyfNotEmpty = 0; // 非空glyf

                    var checkUnicodeRepeat = {}; // 检查是否有重复代码点

                    ttf.glyf.forEach(function(glyf, index) {

                        // 统计control point信息
                        if (glyf.compound) {
                            var compositeContours = 0;
                            var compositePoints = 0;
                            glyf.glyfs.forEach(function(g) {
                                var cglyf = ttf.glyf[g.glyphIndex];
                                compositeContours += cglyf.contours ? cglyf.contours.length : 0;
                                if (cglyf.contours && cglyf.contours.length) {
                                    cglyf.contours.forEach(function(contour) {
                                        compositePoints += contour.length;
                                    });
                                }

                            });

                            maxComponentElements ++;
                            maxCompositePoints = Math.max(maxCompositePoints, compositePoints);
                            maxCompositeContours = Math.max(maxCompositeContours, compositeContours);
                        }
                        // 简单图元
                        else if (glyf.contours && glyf.contours.length) {
                            maxContours = Math.max(maxContours, glyf.contours.length);
                            
                            var points = 0;
                            glyf.contours.forEach(function(contour) {
                                points += contour.length;
                            });
                            maxPoints = Math.max(maxPoints, points);
                        }

                        // 统计边界信息
                        if (glyf.compound || glyf.contours && glyf.contours.length) {

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
                            advanceWidthMax = Math.max(advanceWidthMax, glyf.advanceWidth);
                            minLeftSideBearing = Math.min(minLeftSideBearing, glyf.leftSideBearing);
                            minRightSideBearing = Math.min(minRightSideBearing, glyf.advanceWidth - glyf.xMax);
                            xMaxExtent = Math.max(xMaxExtent, glyf.xMax);

                            xAvgCharWidth += glyf.advanceWidth;

                            glyfNotEmpty++;
                        }

                        var unicodes = glyf.unicode;
                        if (typeof glyf.unicode == 'number') {
                            unicodes = [glyf.unicode];
                        }

                        if (lang.isArray(unicodes)) {
                            unicodes.forEach(function(unicode) {
                                if (unicode !== 0xFFFF) {
                                    usFirstCharIndex = Math.min(usFirstCharIndex, unicode);
                                    usLastCharIndex = Math.max(usLastCharIndex, unicode);
                                }

                                if (checkUnicodeRepeat[unicode]) {
                                    error.raise(10200, index);
                                }
                                else {
                                    checkUnicodeRepeat[unicode] = true;
                                }

                            });
                        }
                    });

                    // os2
                    ttf['OS/2'].achVendID = (ttf['OS/2'].achVendID + '    ').slice(0, 4);
                    ttf['OS/2'].xAvgCharWidth = xAvgCharWidth / (glyfNotEmpty || 1);
                    ttf['OS/2'].ulUnicodeRange2 = 268435456;
                    ttf['OS/2'].usFirstCharIndex = usFirstCharIndex;
                    ttf['OS/2'].usLastCharIndex = usLastCharIndex;

                    // rewrite hhea
                    ttf.hhea.advanceWidthMax = advanceWidthMax;
                    ttf.hhea.minLeftSideBearing = minLeftSideBearing;
                    ttf.hhea.minRightSideBearing = minRightSideBearing;
                    ttf.hhea.xMaxExtent = xMaxExtent;

                    // rewrite head
                    ttf.head.xMin = xMin;
                    ttf.head.yMin = yMin;
                    ttf.head.xMax = xMax;
                    ttf.head.yMax = yMax;

                    ttf.support.maxp = {
                        version: 1.0,
                        numGlyphs: ttf.glyf.length,
                        maxPoints: maxPoints,
                        maxContours: maxContours,
                        maxCompositePoints: maxCompositePoints,
                        maxCompositeContours: maxCompositeContours,
                        maxZones: 2,
                        maxTwilightPoints: 0,
                        maxStorage: 0,
                        maxFunctionDefs: 0,
                        maxStackElements: 0,
                        maxSizeOfInstructions: maxSizeOfInstructions,
                        maxComponentElements: maxComponentElements,
                        maxComponentDepth: maxComponentElements ? 1 : 0
                    };

                    return table.size.call(this, ttf);
                }
            }
        );

        return OS2;
    }
);