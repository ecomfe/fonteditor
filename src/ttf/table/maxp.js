/**
 * @file maxp.js
 * @author mengke01
 * @date 
 * @description
 * maxp 表
 */

define(
    function(require) {
        var table = require('./table');
        var struct = require('./struct');
        var maxp = table.create(
            'maxp', 
            [
                ['version', struct.Fixed],
                ['numGlyphs', struct.Uint16],
                ['maxPoints', struct.Uint16],
                ['maxContours', struct.Uint16],
                ['maxCompositePoints', struct.Uint16],
                ['maxCompositeContours', struct.Uint16],
                ['maxZones', struct.Uint16],
                ['maxTwilightPoints', struct.Uint16],
                ['maxStorage', struct.Uint16],
                ['maxFunctionDefs', struct.Uint16],
                ['maxInstructionDefs', struct.Uint16],
                ['maxStackElements', struct.Uint16],
                ['maxSizeOfInstructions', struct.Uint16],
                ['maxComponentElements', struct.Uint16],
                ['maxComponentDepth', struct.Int16]
            ],
            {
                write: function(writer, ttf) {
                    table.write.call(this, writer, ttf.support);
                    return writer;
                },
                size: function(ttf) {
                    var maxPoints = 0,  maxContours = 0, maxCompositePoints = 0,
                        maxCompositeContours = 0;
                    ttf.glyf.forEach(function(glyf) {
                        // 复合图元
                        if (glyf.compound) {
                            maxCompositePoints++;
                            maxCompositeContours += glyf.glyfs.length;
                        }
                        // 简单图元
                        else {
                            maxContours += glyf.contours.length;
                            glyf.contours.forEach(function(contour) {
                                maxPoints += contour.length;
                            });
                        }

                    });

                    ttf.support.maxp = {
                        version: 1.0,
                        numGlyphs: ttf.glyf.length,
                        maxPoints: maxPoints,
                        maxContours: maxContours,
                        maxCompositePoints: maxCompositePoints,
                        maxCompositeContours: maxCompositeContours,
                        maxZones: 2,
                        maxTwilightPoints: 0,
                        // It is unclear how to calculate maxStorage, maxFunctionDefs and maxInstructionDefs.
                        // These are magic constants now, with values exceeding values from FontForge
                        // see svg2ttf on github
                        maxStorage: 10,
                        maxFunctionDefs: 10,
                        maxStackElements: 255,
                        maxSizeOfInstructions: 0,
                        maxComponentElements: 0,
                        maxComponentDepth: 0
                    };

                    return table.size.call(this, ttf.support);
                }
            }
        );

        return maxp;
    }
);