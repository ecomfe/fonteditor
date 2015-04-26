
define(
    function (require) {

        var TTFReader = require('ttf/ttfreader');
        var ttf2svg = require('ttf/ttf2svg');
        var svg2ttfobject = require('ttf/svg2ttfobject');

        describe('ttf 转 eot', function () {

            var fontObject = new TTFReader().read(require('data/baiduHealth.ttf'));
            var svg = ttf2svg(fontObject);
            var ttf = svg2ttfobject(svg);

            it('test genrate svg font', function () {
                expect(svg.length).toBeGreaterThan(1000);
            });

            it('test read svg font', function () {
                expect(ttf.from).toBe('svgfont');
                expect(ttf.name.fontFamily).toBe('baiduHealth');

                expect(ttf.head.unitsPerEM).toBe(fontObject.head.unitsPerEM);
                expect(ttf.head.xMax).toBe(fontObject.head.xMax);
                expect(ttf.head.yMax).toBe(fontObject.head.yMax);

                expect(ttf.hhea.ascent).toBe(fontObject.hhea.ascent);
                expect(ttf.hhea.descent).toBe(fontObject.hhea.descent);

                expect(ttf.glyf.length).toBe(14);
                expect(ttf.glyf[3].contours.length).toBe(3);
                expect(ttf.glyf[3].unicode[0]).toBe(57357);
            });
        });

    }
);
