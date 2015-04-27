/**
 * @file maxp 表
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {
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

                write: function (writer, ttf) {
                    table.write.call(this, writer, ttf.support);
                    return writer;
                },

                size: function (ttf) {
                    return 32;
                }
            }
        );

        return maxp;
    }
);
