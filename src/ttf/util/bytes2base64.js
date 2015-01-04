/**
 * @file bytes2base64.js
 * @author mengke01
 * @date
 * @description
 * 二进制byte流转base64编码
 */


define(
    function (require) {

        /**
         * 二进制byte流转base64编码
         *
         * @param {ArrayBuffer|Array} arrayBuffer ArrayBuffer对象
         * @return {string} base64编码
         */
        function bytes2base64(arrayBuffer) {
            var str = '';
            var length;
            var i;
            // ArrayBuffer
            if (arrayBuffer instanceof ArrayBuffer) {
                length = arrayBuffer.byteLength;
                var view = new DataView(arrayBuffer, 0, length);
                for (i = 0; i < length; i++) {
                    str += String.fromCharCode(view.getUint8(i, false));
                }
            }
            // Array
            else if (arrayBuffer instanceof Array) {
                length = arrayBuffer.length;
                for (i = 0; i < length; i++) {
                    str += String.fromCharCode(arrayBuffer[i]);
                }
            }

            return btoa(str);
        }

        return bytes2base64;
    }
);
