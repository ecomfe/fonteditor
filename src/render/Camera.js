/**
 * @file Camera.js
 * @author mengke01
 * @date 
 * @description
 * 视角对象，用来控制平移和缩放
 */


define(
    function(require) {

        /**
         * 视角对象
         * 
         * @constructor
         */
        function Camera(center, ratio) {
            this.center = center;
            this.ratio = ratio;
        }

        return Camera;
    }
);
