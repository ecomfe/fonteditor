/**
 * @file 根据transform参数变换轮廓
 * @author mengke01(kekee000@gmail.com)
 */

define(function (require) {
    var pathAdjust = require('graphics/pathAdjust');
    var pathTransform = require('graphics/pathTransform');

    /**
     * 根据transform参数变换轮廓
     *
     * @param {Array} contours 轮廓集合
     * @param {Array} transforms 变换指令集合
     *     transforms = [{
     *         name: 'scale'
     *         params: [3,4]
     *     }]
     *
     * @return {Array} 变换后的轮廓数组
     */
    function contoursTransform(contours, transforms) {
        if (!contours || !contours.length || !transforms || !transforms.length) {
            return contours;
        }

        contours.forEach(function (p) {
            for (var i = 0, l = transforms.length; i < l; i++) {
                var transform = transforms[i];
                var params = transform.params;
                switch (transform.name) {
                    case 'translate':
                        pathAdjust(p, 1, 1, params[0], params[1]);
                        break;
                    case 'scale':
                        pathAdjust(p, params[0], params[1]);
                        break;
                    case 'matrix':
                        pathTransform(p, params[0], params[1], params[2], params[3], params[4], params[5]);
                        break;
                }
            }
        });

        return contours;
    }


    return contoursTransform;
});
