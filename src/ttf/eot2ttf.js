/**
 * @file eot2ttf.js
 * @author mengke01
 * @date
 * @description
 * eot转ttf
 */


define(
    function (require) {

        var Reader = require('./reader');
        var error = require('./error');

        /**
         * eot格式转换成ttf字体格式
         *
         * @param {ArrayBuffer} eotBuffer eot缓冲数组
         * @param {Object} options 选项
         *
         * @return {ArrayBuffer} ttf格式byte流
         */
        function eot2ttf(eotBuffer, options) {
            options = options || {};

            // 这里用小尾方式读取
            var eotReader = new Reader(eotBuffer, 0, eotBuffer.byteLength, true);

            // check magic number
            var magicNumber = eotReader.readUint16(34);
            if (magicNumber !== 0x504C) {
                error.raise(10110);
            }

            // check version
            var version = eotReader.readUint32(8);
            if (version !== 0x20001 && version !== 0x10000 && version !== 0x20002) {
                error.raise(10110);
            }

            var eotSize = eotBuffer.byteLength || eotBuffer.length;
            var fontSize = eotReader.readUint32(4);

            var fontOffset = 82;
            var familyNameSize = eotReader.readUint16(fontOffset);
            fontOffset += 4 + familyNameSize;

            var styleNameSize = eotReader.readUint16(fontOffset);
            fontOffset += 4 + styleNameSize;

            var versionNameSize = eotReader.readUint16(fontOffset);
            fontOffset += 4 + versionNameSize;

            var fullNameSize = eotReader.readUint16(fontOffset);
            fontOffset += 2 + fullNameSize;

            // version 0x20001
            if (version === 0x20001 || version === 0x20002) {
                var rootStringSize = eotReader.readUint16(fontOffset + 2);
                fontOffset += 4 + rootStringSize;
            }

            // version 0x20002
            if (version === 0x20002) {
                fontOffset += 10;
                var signatureSize = eotReader.readUint16(fontOffset);
                fontOffset += 2 + signatureSize;
                fontOffset += 4;
                var eudcFontSize = eotReader.readUint32(fontOffset);
                fontOffset += 4 + eudcFontSize;
            }

            if (fontOffset + fontSize > eotSize) {
                error.raise(10001);
            }

            // support slice
            if (eotBuffer.slice) {
                return eotBuffer.slice(fontOffset, fontOffset + fontSize);
            }

            // not support ArrayBuffer.slice eg. IE10
            var Writer = require('./writer');
            var bytes = eotReader.readBytes(fontOffset, fontSize);
            return new Writer(new ArrayBuffer(fontSize)).writeBytes(bytes).getBuffer();
        }

        return eot2ttf;
    }
);
