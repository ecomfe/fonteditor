/**
 * @file DSIG.js
 * @author mengke01
 * @date 
 * @description
 * DSIG表
 * Digital Signature Table
 * 
 * 暂不支持数字签名解析
 * http://www.microsoft.com/typography/otspec/dsig.htm
 */


define(
    function(require) {
        var table = require('./table');
        var struct = require('./struct');
        var DSIG = table.create(
            'DSIG', 
            [
                ['ulVersion', struct.Uint32],
                ['usNumSigs', struct.Uint16],
                ['usFlag', struct.Uint16]
            ]
        );

        return DSIG;
    }
);