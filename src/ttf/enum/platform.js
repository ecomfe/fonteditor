/**
 * @file 字体所属平台
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        var platform = {
            Unicode: 0,
            Macintosh: 1, // mac
            reserved: 2,
            Microsoft: 3 // win
        };

        return platform;
    }
);
