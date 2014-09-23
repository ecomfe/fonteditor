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
         * 读取ttf中windows字符表的字符
         * 
         * @return {Object} 字符字典索引，key：unicode，value：glyf index
         * 
         * @see https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6cmap.html
         */
        function readWindowsAllChars(ttf) {
            // 读取windows unicode 编码段
            var usc2Arr = ttf.cmap.tables.filter(function(item) {
                return item.platformID == 3 && item.encodingID == 1 && item.format == 4;
            });

            if(usc2Arr.length) {
                // 只取第一个format
                var format4 = usc2Arr[0];
                var segCount = format4.segCountX2 / 2;

                var chars = {};

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
                            chars[start] = (start + format4.idDelta[i]) % 65536;
                        }
                        // rely on to glyphIndexArray
                        else {
                            var index = i + format4.idRangeOffset[i] / 2
                                + (start - format4.startCode[i])
                                - graphIdArrayIndexOffset;

                            var graphId = format4.glyphIdArray[index];
                            if(graphId !== 0) {
                                chars[start] = (graphId + format4.idDelta[i]) % 65536;
                            }
                            else {
                                chars[start] = 0;
                            }

                        }
                    }
                }

                return chars;
            }   
            else {
                return {};
            }
        }

        /**
         * 关联glyf相关的信息
         */
        function resolveGlyf(ttf) {
            var chars = ttf.chars;
            var glyf = ttf.glyf;

            Object.keys(chars).forEach(function(c) {
                var i = chars[c];
                glyf[i].unicode = +c;
            });

            if (ttf.post && 2 == ttf.post.format) {
                var nameIndex = ttf.post.glyphNameIndex;
                var names = ttf.post.names;
                nameIndex.forEach(function(name, i) {
                    if (name <= 257) {
                        glyf[i].name = name;
                    }
                    else {
                        glyf[i].name = names[name - 258] || '';
                    }
                });
            }
        }

        /**
         * ttf读取函数
         * 
         * @constructor
         * @param {Object} ttf ttf文件结构
         */
        function TTF(ttf) {
            this.ttf = ttf;
            this.ttf.chars = readWindowsAllChars(ttf);
            resolveGlyf.call(this, this.ttf);
        }

        /**
         * 获取所有的字符信息
         * 
         * @return {Object} 字符信息
         */
        TTF.prototype.chars = function() {
            return Object.keys(this.ttf.chars);
        };

        /**
         * 获取字符的glyf信息
         * @param {string} c 字符或者字符编码
         * 
         * @return {?number} 返回glyf索引号
         */
        TTF.prototype.getCharGlyfIndex = function(c) {
            var charCode = typeof c == 'number' ? c : c.charCodeAt(0);
            var glyfIndex = this.ttf.chars[charCode] || 0;
            return glyfIndex;
        };

        /**
         * 获取字符的glyf信息
         * @param {string} c 字符或者字符编码
         * 
         * @return {?Object} 返回glyf对象
         */
        TTF.prototype.getCharGlyf = function(c) {
            var glyfIndex = this.getCharGlyfIndex(c);
            return this.ttf.glyf[glyfIndex];
        };

        return TTF;
    }
);
