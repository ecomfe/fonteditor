/**
 * @file ttf2base64.js
 * @author mengke01
 * @date 
 * @description
 * ttf 二进制转base64编码
 */


define(
    function(require) {
        
        /**
         * ttf 二进制转base64编码
         * 
         * @param {Array} arrayBuffer ArrayBuffer对象
         * @return {string} base64编码
         */
        function ttf2base64(arrayBuffer) {
            var length = arrayBuffer.byteLength || arrayBuffer.length;
            var view = new DataView(arrayBuffer, 0, length);
            var str = '';
            for(var i = 0; i < length; i++) {
                str += String.fromCharCode(view.getUint8(i, false));
            }
            return btoa(str);
        }

        return ttf2base64;
    }
);
