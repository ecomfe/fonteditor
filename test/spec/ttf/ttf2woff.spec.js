
define(
    function (require) {

        var TTFReader = require('ttf/ttfreader');
        var ttf2woff = require('ttf/ttf2woff');
        var woff2ttf = require('ttf/woff2ttf');

        describe('ttf 转 woff', function () {

            var woffBuffer = ttf2woff(require('data/baiduHealth.ttf'))

            it('test woff format', function () {
                expect(woffBuffer.byteLength).toBeGreaterThan(1000);
                expect(woffBuffer.byteLength).toBeLessThan(10000);
            });

            it('test read ttf2woff', function () {
                var ttf = new TTFReader().read(woff2ttf(woffBuffer));

                expect(ttf.version).toBe(1);

                expect(ttf.head.magickNumber).toBe(1594834165);
                expect(ttf.head.unitsPerEm).toBe(512);

                expect(ttf.post.format).toBe(2);
                expect(ttf.post.underlinePosition).toBe(0);
                expect(ttf.post.underlineThickness).toBe(0);

                expect(ttf.hhea.advanceWidthMax).toBe(682);
                expect(ttf.hhea.ascent).toBe(480);
                expect(ttf.hhea.descent).toBe(-33);

                expect(ttf.maxp.version).toBe(1);
                expect(ttf.maxp.numGlyphs).toBe(17);

                expect(ttf.glyf[0].advanceWidth).toBe(512);
                expect(ttf.glyf[0].leftSideBearing).toBe(0);
                expect(ttf.glyf[0].name).toBe('.notdef');
                expect(ttf.glyf[3].contours[0].length).toBe(31);
                expect(ttf.glyf[16].compound).toBe(true);
                expect(ttf.glyf[16].glyfs.length).toBe(2);

                expect(ttf.cmap[0]).toBe(1);
                expect(ttf.cmap[57400]).toBe(16);
            });
        });

    }
);
