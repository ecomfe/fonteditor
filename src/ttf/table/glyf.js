/**
 * @file glyf.js
 * @author mengke01
 * @date 
 * @description
 * glyf表
 */

define(
    function(require) {
        var table = require('./table');
        var struct = require('./struct');
        var ttfglyf = require('./ttfglyf');

        var glyf = table.create(
            'glyf', 
            [], 
            {
                /**
                 * 解析glyfl表
                 */
                read: function(reader, ttf) {
                    var glyfOffset = this.offset;
                    var loca = ttf.loca;
                    var numGlyphs = ttf.maxp.numGlyphs;
                    var glyf = [];
                    var glyfDataList = {};
                    var glyfPath = new ttfglyf();

                    reader.seek(glyfOffset);

                    // 解析字体轮廓
                    for ( var i = 0, l = numGlyphs; i < l; i++) {
                        var offset = glyfOffset + loca[i];

                        //保存offset下的重复图形
                        if (undefined == glyfDataList[offset]) {
                            // 空路径
                            if(i + 1 < l && loca[i] === loca[i + 1]) {
                                glyfDataList[offset] = ttfglyf.empty();
                            }
                            else {
                                glyfPath.offset = offset;
                                glyfDataList[offset] = glyfPath.read(reader, ttf);
                            }
                        }
                        glyf[i] = glyfDataList[offset];
                    }
                    return glyf;
                }
            }
        );

        return glyf;
    }
);