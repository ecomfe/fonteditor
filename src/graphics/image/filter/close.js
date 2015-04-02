/**
 * @file 二值图像开运算
 * 先膨胀后腐蚀的过程称为闭运算。用来填充物体内细小空洞、
 * 连接邻近物体、平滑其边界的同时并不明显改变其面积
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        var dilate = require('./dilate');
        var erode = require('./erode');

        return function (imageData, mode, radius) {
            return erode(dilate(imageData, mode, radius));
        };
    }
);
