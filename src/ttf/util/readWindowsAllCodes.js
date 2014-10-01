/**
 * @file 
 * @author mengke01
 * @date 
 * @description
 * 读取windows支持的字符集
 */


define(
    function(require) {

        /**
         * 读取ttf中windows字符表的字符
         * 
         * @return {Object} 字符字典索引，key：unicode，value：glyf index
         * 
         * @see https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6cmap.html
         */
        function readWindowsAllCodes(ttf) {
            // 读取windows unicode 编码段
            var usc2Arr = ttf.cmap.tables.filter(function(item) {
                return item.platformID == 3 && item.encodingID == 1 && item.format == 4;
            });

            if(usc2Arr.length) {
                // 只取第一个format
                var format4 = usc2Arr[0];
                var segCount = format4.segCountX2 / 2;

                var codes = {};

                // graphIdArray 和idRangeOffset的偏移量
                var graphIdArrayIndexOffset = (format4.glyphIdArrayOffset - format4.idRangeOffsetOffset) / 2;

                for (var i = 0; i < segCount; ++i) {
                    // 读取单个字符
                    for(
                        var start = format4.startCode[i], end = format4.endCode[i];
                        start <= end;
                        ++start
                    ) {
                        // range offset = 0
                        if(format4.idRangeOffset[i] === 0) {
                            codes[start] = (start + format4.idDelta[i]) % 0x10000;
                        }
                        // rely on to glyphIndexArray
                        else {
                            var index = i + format4.idRangeOffset[i] / 2
                                + (start - format4.startCode[i])
                                - graphIdArrayIndexOffset;

                            var graphId = format4.glyphIdArray[index];
                            if(graphId !== 0) {
                                codes[start] = (graphId + format4.idDelta[i]) % 0x10000;
                            }
                            else {
                                codes[start] = 0;
                            }

                        }
                    }
                }

                return codes;
            }   
            else {
                return {};
            }
        }

        return readWindowsAllCodes;
    }
);
