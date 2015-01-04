/**
 * @file GDEF.js
 * @author mengke01
 * @date
 * @description
 * GDEF表
 * The Glyph Definition Table
 * 暂不支持解析子表，因此四个offset为0
 * http://www.microsoft.com/typography/otspec/gdef.htm
 */


define(
    function (require) {
        var table = require('./table');
        var struct = require('./struct');
        var GDEF = table.create(
            'GDEF',
            [
                ['Version', struct.Uint32],
                ['GlyphClassDef', struct.Uint16],
                ['AttachList', struct.Uint16],
                ['LigCaretList', struct.Uint16],
                ['MarkAttachClassDef', struct.Uint16]
            ]
        );

        return GDEF;
    }
);
