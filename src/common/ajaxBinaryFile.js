/**
 * @file ajaxBinaryFile.js
 * @author mengke01
 * @date 
 * @description
 * ajax获取二进制数据
 */


define(
    function(require) {
            
        /**
         * ajax获取二进制数据
         * 
         * @param {Object} options 参数选项
         * @param {string=} options.method method
         * @param {Function=} options.onSuccess 成功回调
         * @param {Function=} options.onError 失败回调
         * @param {Object=} options.params 参数集合
         */
        function ajaxBinaryFile(options) {
            var xhr = new XMLHttpRequest();

            xhr.onreadystatechange = function(){
                if (xhr.readyState=== 4 && xhr.status === 200){
                    if(options.onSuccess) {
                        var buffer = xhr.responseBlob || xhr.response;
                        options.onSuccess(buffer);
                    }
                }
                else if(xhr.status > 200){
                    if(options.onError) {
                        options.onError(xhr, xhr.status);
                    }
                }
            };

            var method = (options.method || 'GET').toUpperCase();
            var params = null;

            if (options.params) {
                
                var str = [];
                Object.keys(options.params).forEach(function(key) {
                    str.push(key + '=' + encodeURIComponent(options.params[key]));
                });
                str = str.join('&');
                if(method == 'GET') {
                    options.url += (options.url.indexOf('?') == -1 ? '?' : '&') + str;
                }
                else {
                    params = str;
                }
            }

            xhr.open(method, options.url, true);
            xhr.responseType = 'arraybuffer';
            xhr.send(null);
        }

        return ajaxBinaryFile;
    }
);
