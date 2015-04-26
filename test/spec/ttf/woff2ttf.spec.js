
define(
    function (require) {

        var TTFReader = require('ttf/ttfreader');
        var ttf2woff = require('ttf/ttf2woff');
        var woff2ttf = require('ttf/woff2ttf');

        describe('woff 转 ttf', function () {

            var woffBuffer = ttf2woff(require('data/baiduHealth-hinting.ttf'))
            var ttf = new TTFReader({
                hinting: true
            }).read(woff2ttf(woffBuffer));

            it('test read ttf2woff', function () {

                expect(ttf.version).toBe(1);

                expect(ttf.head.magickNumber).toBe(1594834165);
                expect(ttf.head.unitsPerEm).toBe(512);

                expect(ttf.post.format).toBe(2);
                expect(ttf.post.underlinePosition).toBe(0);
                expect(ttf.post.underlineThickness).toBe(0);

                expect(ttf.hhea.advanceWidthMax).toBe(682);
                expect(ttf.hhea.ascent).toBe(480);
                expect(ttf.hhea.descent).toBe(-32);

                expect(ttf.maxp.version).toBe(1);
                expect(ttf.maxp.numGlyphs).toBe(17);

                expect(ttf.glyf[0].advanceWidth).toBe(512);
                expect(ttf.glyf[0].leftSideBearing).toBe(0);
                expect(ttf.glyf[0].name).toBe('.notdef');
                expect(ttf.glyf[3].contours[0].length).toBe(31);

                expect(ttf.cmap[0]).toBe(1);
                expect(ttf.cmap[57400]).toBe(16);
            });

            it('test read hinting', function () {
                expect(ttf.cvt.length).toBe(24);
                expect(ttf.fpgm.length).toBe(371);
                expect(ttf.prep.length).toBe(204);
                expect(ttf.gasp.length).toBe(8);
            });

        });

    }
);
