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
        function Camera(center, ratio, scale) {
            this.reset(center, ratio, scale);
        }

        /**
         * 重置camera
         */
        Camera.prototype.reset = function(center, ratio, scale) {
            this.center = center || {
                x: 0,
                y: 0
            };
            this.ratio = ratio || 1;
            this.scale = scale || 1;
        };

        /**
         * 注销Camera
         */
        Camera.prototype.dispose = function() {
            this.center = this.ratio = this.scale = null
        }
        return Camera;
    }
);
