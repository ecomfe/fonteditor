/**
 * @file readWindowsAllCodes.js
 * @author mengke01
 * @date
 * @description
 * 读取windows支持的字符集
 * @see
 * https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6cmap.html
 */


define(
    function (require) {

        /**
         * 读取ttf中windows字符表的字符
         * @param {Array} tables cmap表结构
         *
         * @return {Object} 字符字典索引，unicode => glyf index
         */
        function readWindowsAllCodes(tables) {

            var codes = {};
            var i;
            var l;
            var start;
            var end;
            // 读取windows unicode 编码段
            var format0 = tables.filter(function (item) {
                return item.format === 0;
            });

            if (format0.length) {
                format0 = format0[0];
                for (i = 0, l = format0.glyphIdArray.length; i < l; i++) {
                    if (format0.glyphIdArray[i]) {
                        codes[i] = format0.glyphIdArray[i];
                    }
                }
            }


            // 读取windows unicode 编码段
            var format12 = tables.filter(function (item) {
                return item.platformID === 3
                    && item.encodingID === 10
                    && item.format === 12;
            });

            // 读取format12表
            if (format12.length) {
                format12 = format12[0];
                for (i = 0, l = format12.nGroups; i < l; i++) {
                    var group = format12.groups[i];
                    var startId = group.startId;
                    start = group.start;
                    end = group.end;

                    for (;start <= end;) {
                        codes[start++] = startId++;
                    }
                }
            }
            // 读取format4表
            else {

                // 读取windows unicode 编码段
                var format4 = tables.filter(function (item) {
                    return item.platformID === 3
                        && item.encodingID === 1
                        && item.format === 4;
                });

                if (format4.length) {

                    // 只取第一个format
                    format4 = format4[0];
                    var segCount = format4.segCountX2 / 2;
                    // graphIdArray 和idRangeOffset的偏移量
                    var graphIdArrayIndexOffset = (format4.glyphIdArrayOffset - format4.idRangeOffsetOffset) / 2;

                    for (i = 0; i < segCount; ++i) {
                        // 读取单个字符
                        for (start = format4.startCode[i], end = format4.endCode[i]; start <= end; ++start) {
                            // range offset = 0
                            if (format4.idRangeOffset[i] === 0) {
                                codes[start] = (start + format4.idDelta[i]) % 0x10000;
                            }
                            // rely on to glyphIndexArray
                            else {
                                var index = i + format4.idRangeOffset[i] / 2
                                    + (start - format4.startCode[i])
                                    - graphIdArrayIndexOffset;

                                var graphId = format4.glyphIdArray[index];
                                if (graphId !== 0) {
                                    codes[start] = (graphId + format4.idDelta[i]) % 0x10000;
                                }
                                else {
                                    codes[start] = 0;
                                }

                            }
                        }
                    }

                    delete codes[65535];

                }

            }

            return codes;
        }

        return readWindowsAllCodes;
    }
);
