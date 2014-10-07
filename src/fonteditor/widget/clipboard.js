/**
 * @file clipboard.js
 * @author mengke01
 * @date 
 * @description
 * 剪切板
 */


define(
    function(require) {

        var storage = window.sessionStorage;

        var storageName = 'clipboard.default';

        var clipboard = {

            /**
             * 设置clipboard
             * 
             * @param {Object} data 设置的数据
             * @param {string} type 数据类型
             * @return {this}
             */
            set: function(data, type) {
                storage.setItem(storageName, JSON.stringify({
                    type: type || -9999,
                    data: data
                }));
            },

            /**
             * 获取clipboard
             * 
             * @return {Object=}
             */
            get: function(type) {
                var data = storage.getItem(storageName);
                if (null !== data) {
                    data = JSON.parse(data);
                    if (data.type == type) {
                        storage.removeItem(storageName);
                        return data.data;
                    }
                }
                
                return null;
            }
        };

        return clipboard;
    }
);
