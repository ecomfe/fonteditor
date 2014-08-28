/**
 * @file setFontface.js
 * @author mengke01
 * @date 
 * @description
 * 设置fontface
 */


define(
    function(require) {

        /**
         * 设置fontface的ttf字体
         * @param {name} name 字体名
         * @param {string} ttfBase64 base64字体
         * @param {string} styleId domId
         */
        function setFontface(name, ttfBase64, styleId) {
            var str = ''
                + '@font-face {'
                + 'font-family:\'' + name + '\';'
                + 'src:url(data:font/ttf;charset=utf-8;base64,' 
                +   ttfBase64 
                + ') format(\'truetype\');'
                + '}';
            document.getElementById(styleId).innerHTML = str;
        }
        return setFontface;
    }
);
