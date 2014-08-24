/**
 * @file glyFlag.js
 * @author mengke01
 * @date 
 * @description
 * 
 * 轮廓标记位
 * 
 * https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6glyf.html
 */


define(
    function(require) {

        var glyFlag = {

            G_ONCURVE: 0x01, // on curve ,off curve
            G_REPEAT: 0x08, //next byte is flag repeat count
            G_XMASK: 0x12,
            G_XADDBYTE: 0x12, //X is positive byte
            G_XSUBBYTE: 0x12, //X is negative byte
            G_XSAME: 0x10, //X is same
            G_XADDINT: 0x00, //X is signed word

            G_YMASK: 0x24,
            G_YADDBYTE: 0x24, //Y is positive byte
            G_YSUBBYTE: 0x04, //Y is negative byte
            G_YSAME: 0x20, //Y is same
            G_YADDINT: 0x00, //Y is signed word
        };

        return glyFlag;
    }
);
