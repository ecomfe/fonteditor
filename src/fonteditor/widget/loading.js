/**
 * @file loading.js
 * @author mengke01
 * @date 
 * @description
 * loading 对象
 */


define(
    function(require) {

        /**
         * 提示
         * 
         * @type {Object}
         */
        var loading = {

            show: function(text) {
                $('#loading').html(text || '正在加载...').show();
            },
            
            hide: function() {
                $('#loading').hide();
            }
        };

        return loading;
    }
);
