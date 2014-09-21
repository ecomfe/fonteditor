/**
 * @file checkSum.js
 * @author mengke01
 * @date 
 * @description
 * table校验函数
 */


define(
    function(require) {
        
        /**
         * table校验
         * 
         * @param {ArrayBuffer|Array} buffer 表数据
         * @return {number} 校验和
         */
        function checkSum(buffer) {
            
            var nLongs = Math.floor(((buffer.byteLength || buffer.length) + 3) / 4);
            var array = new Int32Array(buffer);
            var sum = 0, i = 0;
            while (i < nLongs) {
                sum += array[i++];
            }

            return sum;
        }


        return checkSum;
    }
);
