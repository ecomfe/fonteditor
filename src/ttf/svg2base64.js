/**
 * @file svg2base64.js
 * @author mengke01
 * @date
 * @description
 * svg 二进制转base64编码
 */


define(
    function (require) {

        /**
         * svg 二进制转base64编码
         *
         * @param {string} svg svg对象
         * @return {string} base64编码
         */
        function svg2base64(svg) {
            return 'data:font/svg;charset=utf-8;base64,' + btoa(svg);
        }

        return svg2base64;
    }
);
