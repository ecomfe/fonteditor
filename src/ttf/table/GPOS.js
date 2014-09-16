/**
 * @file GPOS.js
 * @author mengke01
 * @date 
 * @description
 * GPOS表
 * 
 * http://www.microsoft.com/typography/otspec/gpos.htm
 */


define(
    function(require) {
        var table = require('./table');
        var struct = require('./struct');
        var GPOS = table.create(
            'GPOS', 
            [
                ['Version', struct.Fixed],
                ['ScriptList', struct.Uint16],
                ['FeatureList', struct.Uint16],
                ['LookupList', struct.Uint16]
            ]
        );

        return GPOS;
    }
);