/**
 * @file 二值图像开运算
 * 先腐蚀后膨胀的过程称为开运算。用来消除小物体、
 * 在纤细点处分离物体、平滑较大物体的边界的同时并不明显改变其面积
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        var dilate = require('./dilate');
        var erode = require('./erode');

        return function (imageData, mode, radius) {
            return dilate(erode(imageData, mode, radius));
        };
    }
);
