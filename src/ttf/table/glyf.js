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
                    var glyfOffset = this.offset;
                    var loca = ttf.loca;
                    var numGlyphs = ttf.maxp.numGlyphs;
                    var glyf = [];
                    var glyfPath = new GlyfContour();

                    reader.seek(glyfOffset);

                    // 解析字体轮廓
                    for (var i = 0, l = numGlyphs; i < l; i++) {
                        var offset = glyfOffset + loca[i];

                        // 空路径
                        if (i + 1 < l && loca[i] === loca[i + 1]) {
                            glyf[i] = GlyfContour.empty();
                        }
                        else {
                            glyfPath.offset = offset;
                            glyf[i] = glyfPath.read(reader, ttf);
                        }
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
