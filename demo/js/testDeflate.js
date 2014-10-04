/**
 * @file testDeflate.js
 * @author mengke01
 * @date 
 * @description
 * 测试deflate
 */

define(
    function(require) {

        var deflate = require('deflate');


        var entry = {

            /**
             * 初始化
             */
            init: function () {
                console.log(deflate);
            }
        };

        entry.init();
        
        return entry;
    }
);
