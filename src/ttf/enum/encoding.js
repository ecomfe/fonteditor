/**
 * @file encoding.js
 * @author mengke01
 * @date 
 * @description
 * Unicode Platform-specific Encoding Identifiers
 */


define(
    function(require) {
        
        // mac encoding id
        var mac = {
            'Default': 0, // default use
            'Version1.1': 1,
            'ISO10646': 2,
            'UnicodeBMP': 3,
            'UnicodenonBMP': 4,
            'UnicodeVariationSequences': 5,
            'FullUnicodecoverage': 6
        };

        //windows encoding id
        var windows = {
            'Symbol': 0, 
            'UCS2': 1, // default use
            'ShiftJIS': 2,
            'PRC': 3,
            'BigFive': 4,
            'Johab': 5,
            'UCS4': 6
        };

        return {
            mac: mac,
            win: windows
        };
    }
);
