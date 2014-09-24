/**
 * @file ttf.js
 * @author mengke01
 * @date 
 * @description
 * 
 * ttf 信息读取函数
 */


define(
    function(require) {
        
        /**
         * ttf读取函数
         * 
         * @constructor
         * @param {Object} ttf ttf文件结构
         */
        function TTF(ttf) {
            this.ttf = ttf;
        }

        /**
         * 获取所有的字符信息
         * 
         * @return {Object} 字符信息
         */
        TTF.prototype.codes = function() {
            return Object.keys(this.ttf.codes);
        };

        /**
         * 获取字符的glyf信息
         * @param {string} c 字符或者字符编码
         * 
         * @return {?number} 返回glyf索引号
         */
        TTF.prototype.getCodeGlyfIndex = function(c) {
            var charCode = typeof c == 'number' ? c : c.charCodeAt(0);
            var glyfIndex = this.ttf.codes[charCode] || 0;
            return glyfIndex;
        };

        /**
         * 获取字符的glyf信息
         * @param {string} c 字符或者字符编码
         * 
         * @return {?Object} 返回glyf对象
         */
        TTF.prototype.getCodeGlyf = function(c) {
            var glyfIndex = this.getCodeGlyfIndex(c);
            return this.ttf.glyf[glyfIndex];
        };

        return TTF;
    }
);
