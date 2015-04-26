
define(
    function (require) {

        var lang = require('common/lang');
        var TTFReader = require('ttf/ttfreader');
        var TTFWriter = require('ttf/ttfwriter');


        describe('写ttf数据', function () {

            var fontObject = new TTFReader().read(require('data/baiduHealth.ttf'));

            it('test write ttf', function () {
                var buffer = new TTFWriter().write(fontObject);
                expect(buffer.byteLength).toBeGreaterThan(1000);
                expect(buffer.byteLength).toBeLessThan(10000);

                var ttf = new TTFReader().read(buffer);

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

            it('test write ttf error', function () {
                expect(function () {
                    var ttf = lang.extend({}, fontObject);
                    ttf.head = null;
                    new TTFWriter().write(ttf);
                }).toThrow();

                expect(function () {
                    var ttf = lang.extend({}, fontObject);
                    ttf.glyf.length = 0;
                    new TTFWriter().write(ttf);
                }).toThrow();

                expect(function () {
                    var ttf = lang.extend({}, fontObject);
                    ttf.name = null;
                    new TTFWriter().write(ttf);
                }).toThrow();

            });
        });


        describe('写ttf hinting数据', function () {

            var fontObject = new TTFReader({
                hinting: true
            }).read(require('data/baiduHealth-hinting.ttf'));

            it('test write ttf hinting', function () {
                var buffer = new TTFWriter({
                    hinting: true
                }).write(fontObject);
                expect(buffer.byteLength).toBeGreaterThan(1000);
                expect(buffer.byteLength).toBeLessThan(10000);

                var ttf = new TTFReader().read(buffer);
                expect(fontObject.cvt.length).toBe(24);
                expect(fontObject.fpgm.length).toBe(371);
                expect(fontObject.prep.length).toBe(204);
                expect(fontObject.gasp.length).toBe(8);
            });
        });
    }
);
