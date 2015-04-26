
define(
    function (require) {

        var OTFReader = require('ttf/otfreader');
        var otf2ttfobject = require('ttf/otf2ttfobject');

        describe('otf 转ttf object', function () {

            var fontObject = new OTFReader().read(require('data/BalladeContour.otf'));
            var numGlyphs = fontObject.maxp.numGlyphs;
            var glyfContours = fontObject.glyf[3].contours.length;
            var glyfAdvanceWidth = fontObject.glyf[3].advanceWidth;
            var glyfLeftSideBearing = fontObject.glyf[3].leftSideBearing;


            var ttfObject = otf2ttfobject(fontObject);

            it('test otf2ttfobject', function () {
                expect(ttfObject.version).toBe(1);
                expect(!!ttfObject.CFF).toBe(false);
                expect(!!ttfObject.VORG).toBe(false);
                expect(ttfObject.glyf.length).toBe(numGlyphs);
                expect(ttfObject.glyf[3].contours.length).toBe(glyfContours);
                expect(ttfObject.glyf[3].advanceWidth).toBe(glyfAdvanceWidth);
                expect(ttfObject.glyf[3].leftSideBearing).toBe(glyfLeftSideBearing);
            });
        });

    }
);
