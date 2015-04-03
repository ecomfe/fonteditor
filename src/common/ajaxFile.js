/**
 * @file ajaxFile.js
 * @author mengke01
 * @date
 * @description
 * ajax获取文本数据
 */


define(
    function (require) {

        /**
         * ajax获取数据
         *
         * @param {Object} options 参数选项
         * @param {string=} options.type 类型
         * @param {string=} options.method method
         * @param {Function=} options.onSuccess 成功回调
         * @param {Function=} options.onError 失败回调
         * @param {Object=} options.params 参数集合
         */
        function ajaxFile(options) {
            var xhr = new XMLHttpRequest();

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    var status = xhr.status;
                    if (status >= 200 && status < 300 || status === 304) {
                        if (options.onSuccess) {
                            if (options.type === 'binary') {
                                var buffer = xhr.responseBlob || xhr.response;
                                options.onSuccess(buffer);
                            }
                            else if (options.type === 'xml') {
                                options.onSuccess(xhr.responseXML);
                            }
                            else if (options.type === 'json') {
                                options.onSuccess(JSON.parse(xhr.responseText));
                            }
                            else {
                                options.onSuccess(xhr.responseText);
                            }
                        }

                    }
                    else {
                        if (options.onError) {
                            options.onError(xhr, xhr.status);
                        }
                    }
                }
            };

            var method = (options.method || 'GET').toUpperCase();
            var params = null;
            if (options.params) {

                var str = [];
                Object.keys(options.params).forEach(function (key) {
                    str.push(key + '=' + encodeURIComponent(options.params[key]));
                });
                str = str.join('&');
                if (method === 'GET') {
                    options.url += (options.url.indexOf('?') === -1 ? '?' : '&') + str;
                }
                else {
                    params = str;
                }
            }

            xhr.open(method, options.url, true);

            if (options.type === 'binary') {
                xhr.responseType = 'arraybuffer';
            }
            xhr.send(params);
        }

        return ajaxFile;
    }
);
