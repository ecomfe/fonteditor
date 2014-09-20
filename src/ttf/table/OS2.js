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
            ]
        );

        return OS2;
    }
);