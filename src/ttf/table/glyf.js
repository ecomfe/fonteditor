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
        var GlyfContour = require('./glyfcontour');
        var glyfWriter = require('./glyfwriter');

        var glyf = table.create(
            'glyf',
            [],
            {

                read: function (reader, ttf) {
                    var startOffset = this.offset;
                    var loca = ttf.loca;
                    var numGlyphs = ttf.maxp.numGlyphs;
                    var glyf = [];
                    var glyfPath = new GlyfContour();

                    reader.seek(startOffset);

                    // 解析字体轮廓, 前n-1个
                    for (var i = 0, l = numGlyphs - 1; i < l; i++) {
                        var offset = startOffset + loca[i];

                        // 当前的和下一个一样，或者最后一个无轮廓
                        if (loca[i] === loca[i + 1]) {
                            glyf[i] = GlyfContour.empty();
                        }
                        else {
                            glyfPath.offset = offset;
                            glyf[i] = glyfPath.read(reader, ttf);
                        }
                    }

                    // 最后一个轮廓
                    if ((ttf.tables.glyf.length - loca[i]) < 5) {
                        glyf[i] = GlyfContour.empty();
                    }
                    else {
                        glyfPath.offset = startOffset + loca[i];
                        glyf[i] = glyfPath.read(reader, ttf);
                    }

                    return glyf;
                },

                write: glyfWriter.write,
                size: glyfWriter.size
            }
        );

        return glyf;
    }
);
