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
                ['maxCompositePoints', struct.Uint16],
                ['maxCompositeContours', struct.Uint16],
                ['maxZones', struct.Uint16],
                ['maxTwilightPoints', struct.Uint16],
                ['maxStorage', struct.Uint16],
                ['maxFunctionDefs', struct.Uint16],
                ['maxInstructionDefs', struct.Uint16],
                ['maxStackElements', struct.Uint16],
                ['maxSizeOfInstructions', struct.Uint16],
                ['macStyle', struct.Uint16],
                ['maxComponentElements', struct.Uint16],
                ['maxComponentDepth', struct.Int16]
            ]
        );

        return maxp;
    }
);