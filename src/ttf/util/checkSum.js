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
        function checkSum(buffer, offset, length) {
            var offset = offset || 0;
            var length = length || buffer.byteLength;

            if (offset + length > buffer.byteLength) {
                throw 'check sum out of bound';
            }

            var nLongs = Math.floor(length/ 4);
            var view = new DataView(buffer, offset, length);
            var sum = 0, i = 0;

            while (i < nLongs) {
                sum += view.getUint32(4 * i++, false);
            }

            var leftBytes = length - nLongs * 4;
            if (leftBytes) {
                var offset = nLongs * 4;
                while(leftBytes > 0) {
                    sum += view.getUint8(offset, false) << (leftBytes * 8);
                    offset++;
                    leftBytes--;
                }
            }
            return sum % 0x100000000;
        }

        function ulong(t) {
            /*jshint bitwise:false*/
            t &= 0xffffffff;
            if (t < 0) {
                t += 0x100000000;
            }
            return t;
        }

        function calc_checksum(buffer, offset, length) {

            var offset = offset || 0;
            var length = length || buffer.byteLength;
            var view = new DataView(buffer, offset, length);

            var sum = 0;
            var nlongs = Math.floor(length / 4);

            for (var i = 0; i < nlongs; ++i) {
                var t = view.getUint32(i * 4, false);
                sum = ulong(sum + t);
            }

            var leftBytes = length - nlongs * 4; //extra 1..3 bytes found, because table is not aligned. Need to include them in checksum too.
            if (leftBytes > 0) {
                var leftRes = 0;
                for (i = 0; i < 4; i++) {
                    /*jshint bitwise:false*/
                    leftRes = (leftRes << 8) + ((i < leftBytes) ? view.getUint8(nlongs * 4 + i, false) : 0);
                }
                sum = ulong(sum + leftRes);
            }
            return sum;
        }

        return calc_checksum;
    }
);
