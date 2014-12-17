/**
 * @file getFontHash.js
 * @author mengke01
 * @date 
 * @description
 * 获取font的hashcode
 */


define(
    function(require) {

        /**
         * 获取glyf的hashcode
         * 
         * @param {Object} font glyf字体结构
         * @return {number} hashcode
         */
        function getFontHash(font) {

            var splice = Array.prototype.splice;
            var sequence = [
                font.advanceWidth || 0
            ];

            // contours
            if (font.contours && font.contours.length) {
                font.contours.forEach(function(contour) {
                    contour.forEach(function(p) {
                        sequence.push(p.x);
                        sequence.push(p.y);
                        sequence.push(p.onCurve ? 1 : 0);
                    });
                });
            }

            if (font.unicode && font.unicode.length) {
                splice.apply(sequence, [sequence.length, 0].concat(font.unicode));
            }

            if (font.name && font.name.length) {
                splice.apply(sequence, [sequence.length, 0].concat(font.name.split('').map(function(c) {
                    return c.charCodeAt(0);
                })));
            }

            // 使用BKDR算法计算哈希
            // http://www.cnblogs.com/uvsjoh/archive/2012/03/27/2420120.html

            var hash = 0;
            for (var i = 0, l = sequence.length; i < l ; i++) {
                hash = 0x7FFFFFFF & (hash * 131 + sequence[i]);
            }

            return hash;
        }

        return getFontHash;
    }
);