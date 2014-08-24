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
        TTF.prototype.chars = function() {
            
        };

        return ttf;
    }
);
