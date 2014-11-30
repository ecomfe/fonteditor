/**
 * @file testGraphics.js
 * @author mengke01
 * @date 
 * @description
 * 测试graphics相关函数
 */


define(
    function(require) {
        var getBezierQ2Point = require('math/getBezierQ2Point');
        var getBezierQ2T = require('math/getBezierQ2T');

        function asset(equal, message) {
            if (!equal) {
                console.error(message);
            }
        }

        var entry = {

            /**
             * 初始化
             */
            init: function () {
                // false
                var t = getBezierQ2T({"x":786,"y":638,"onCurve":true},{"x":673,"y":545},{"x":526,"y":545,"onCurve":true}, {x: 544.779145, y: 644.574325});
                asset(t == false, 'error point on bezier');
            }
        };

        entry.init();
        
        return entry;
    }
);