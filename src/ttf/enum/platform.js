/**
 * @file platform.js
 * @author mengke01
 * @date 
 * @description
 * 字体所属平台
 */


define(
    function(require) {

        var platform = {
            Unicode: 0,
            Macintosh: 1, // mac
            reserved: 2,
            Microsoft: 3 // win
        };

        return platform;
    }
);
