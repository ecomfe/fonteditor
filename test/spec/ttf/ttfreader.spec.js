
define(
    function (require) {

        var TTFReader = require('ttf/ttfreader');

        describe('读ttf数据', function () {

            var fontObject = new TTFReader().read(require('data/baiduHealth.ttf'));

            it('test read ttf', function () {
                expect(fontObject.version).toBe(1);
                expect(fontObject.numTables).toBe(15);
                expect(fontObject.rengeShift).toBe(112);
                expect(fontObject.searchRenge).toBe(128);
            });

            it('test read ttf head', function () {
                expect(fontObject.head.magickNumber).toBe(1594834165);
                expect(fontObject.head.unitsPerEm).toBe(512);
                expect(fontObject.head.checkSumAdjustment).toBe(541516270);
            });

            it('test read ttf name', function () {
                expect(fontObject.name.fontFamily).toBe('baiduHealth');
                expect(fontObject.name.fontSubFamily).toBe('Regular');
                expect(fontObject.name.fullName).toBe('baiduHealth');
            });


            it('test read ttf post', function () {
                expect(fontObject.post.format).toBe(2);
                expect(fontObject.post.underlinePosition).toBe(0);
                expect(fontObject.post.underlineThickness).toBe(0);
            });

            it('test read ttf hhea', function () {
                expect(fontObject.hhea.advanceWidthMax).toBe(682);
                expect(fontObject.hhea.ascent).toBe(480);
                expect(fontObject.hhea.descent).toBe(-33);
            });

            it('test read ttf maxp', function () {
                expect(fontObject.maxp.version).toBe(1);
                expect(fontObject.maxp.numGlyphs).toBe(17);
            });

            it('test read ttf glyf', function () {
                expect(fontObject.glyf[0].advanceWidth).toBe(512);
                expect(fontObject.glyf[0].leftSideBearing).toBe(0);
                expect(fontObject.glyf[0].name).toBe('.notdef');
                expect(fontObject.glyf[3].contours[0].length).toBe(31);
                expect(fontObject.glyf[16].compound).toBe(true);
                expect(fontObject.glyf[16].glyfs.length).toBe(2);
            });

            it('test read ttf cmap', function () {
                expect(fontObject.cmap[0]).toBe(1);
                expect(fontObject.cmap[57400]).toBe(16);
            });
        });

        describe('转换compound到simple', function () {

            var fontObject = new TTFReader({
                compound2simple: true
            }).read(require('data/baiduHealth.ttf'));

            it('test read ttf glyf', function () {
                expect(!!fontObject.glyf[16].compound).toBe(false);
                expect(!!fontObject.glyf[16].glyfs).toBe(false);
                expect(fontObject.glyf[16].contours.length).toBe(4);
            });
        });

        describe('读ttf hinting数据', function () {
            var fontObject = new TTFReader({
                hinting: true
            }).read(require('data/baiduHealth-hinting.ttf'));

            it('test read hinting', function () {
                expect(fontObject.cvt.length).toBe(24);
                expect(fontObject.fpgm.length).toBe(371);
                expect(fontObject.prep.length).toBe(204);
                expect(fontObject.gasp.length).toBe(8);
            });

        });

        describe('读错误ttf数据', function () {

            it('test read version error', function () {
                expect(function () {
                    new TTFReader().read(new Uint8Array([0, 1, 0, 0, 25, 4, 11]).buffer);
                }).toThrow();
            });

            it('test read range error', function () {
                expect(function () {
                    new TTFReader().read(new Uint8Array([0, 1, 0, 0, 0, 10, 11, 45, 8]).buffer);
                }).toThrow();
            });
        });
    }
);
