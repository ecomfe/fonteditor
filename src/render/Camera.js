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
        function Camera(center, scale, ratio) {
            this.reset(center, scale, ratio);
        }

        /**
         * 重置camera
         */
        Camera.prototype.reset = function(center, scale, ratio) {
            this.center = center || {
                x: 0,
                y: 0
            };
            this.scale = scale || 1;
            this.ratio = ratio || 1;
        };

        /**
         * 注销Camera
         */
        Camera.prototype.dispose = function() {
            this.center = this.ratio = this.scale = null;
        };
        
        return Camera;
    }
);
