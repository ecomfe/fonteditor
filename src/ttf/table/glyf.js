/**
 * @file glyf.js
 * @author mengke01
 * @date
 * @description
 * glyf表
 */

define(
    function (require) {

        var table = require('./table');
        var parse = require('./glyf/parse');
        var write = require('./glyf/write');
        var sizeof = require('./glyf/sizeof');

        var glyf = table.create(
            'glyf',
            [],
            {

                read: function (reader, ttf) {
                    var startOffset = this.offset;
                    var loca = ttf.loca;
                    var numGlyphs = ttf.maxp.numGlyphs;
                    var glyphs = [];

                    reader.seek(startOffset);

                    // 解析字体轮廓, 前n-1个
                    for (var i = 0, l = numGlyphs - 1; i < l; i++) {

                        // 当前的和下一个一样，或者最后一个无轮廓
                        if (loca[i] === loca[i + 1]) {
                            glyphs[i] = {
                                contours: []
                            };
                        }
                        else {
                            glyphs[i] = parse(reader, ttf, startOffset + loca[i]);
                        }
                    }

                    // 最后一个轮廓
                    if ((ttf.tables.glyf.length - loca[i]) < 5) {
                        glyphs[i] = {
                            contours: []
                        };
                    }
                    else {
                        glyphs[i] = parse(reader, ttf, startOffset + loca[i]);
                    }

                    return glyphs;
                },

                write: write,
                size: sizeof
            }
        );

        return glyf;
    }
);
