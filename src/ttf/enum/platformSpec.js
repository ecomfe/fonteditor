/**
 * @file encodingIdentifiers.js
 * @author mengke01
 * @date 
 * @description
 * Unicode Platform-specific Encoding Identifiers
 */


define(
    function(require) {
        
        var spec = {
            'Default': 0,
            'Version1.1': 1,
            'ISO10646': 2,
            'UnicodeBMP': 3,
            'UnicodenonBMP': 4,
            'UnicodeVariationSequences': 5,
            'FullUnicodecoverage': 6
        };

        return spec;
    }
);
