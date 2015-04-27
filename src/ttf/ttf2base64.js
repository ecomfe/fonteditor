/**
 * @file ttf数组转base64编码
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {

        var bytes2base64 = require('./util/bytes2base64');

        /**
         * ttf数组转base64编码
         *
         * @param {Array} arrayBuffer ArrayBuffer对象
         * @return {string} base64编码
         */
        function ttf2base64(arrayBuffer) {
            return 'data:font/ttf;charset=utf-8;base64,' + bytes2base64(arrayBuffer);
        }

        return ttf2base64;
    }
);
