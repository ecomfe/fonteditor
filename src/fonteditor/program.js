/**
 * @file program.js
 * @author mengke01
 * @date 
 * @description
 * 程序运行时组件
 */


define(
    function(require) {

        var program = {

            /**
             * 暂存对象
             * 
             * @type {Object}
             */
            data: {},

            /**
             * loading动画
             * 
             * @type {Object}
             */
            loading: {

                show: function(text) {
                    $('#loading').html(text || '正在加载...').show();
                },
                
                hide: function() {
                    $('#loading').hide();
                }
            }
        };

        return program;
    }
);
