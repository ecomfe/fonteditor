/**
 * @file gasp.js
 * @author mengke01
 * @date 
 * @description
 * gasp表
 * https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6gasp.html
 */

define(
    function(require) {
        var table = require('./table');
        var struct = require('./struct');

        var gasp = table.create(
            'gasp', 
            [], 
            {
                /**
                 * 解析gasp表
                 */
                read: function(reader, ttf) {
                    var offset = this.offset;
                    var gasp = {};

                    reader.seek(offset);

                    gasp.version = reader.readUint16();
                    gasp.numRanges = reader.readUint16();

                    var GASPRangeTbl = [];
                    for (var i = 0; i < gasp.numRanges; ++i) {
                        var GASPRange = {};
                        GASPRange.rangeMaxPPEM = reader.readUint16();
                        GASPRange.rangeGaspBehavior = reader.readUint16();
                        GASPRangeTbl.push(GASPRange);
                    };
                    gasp.GASPRangeTbl = GASPRangeTbl;
                    
                    return gasp;
                }
            }
        );

        return gasp;
    }
);