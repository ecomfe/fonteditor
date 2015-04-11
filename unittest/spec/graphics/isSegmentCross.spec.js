
define(
    function (require) {

        var isSegmentCross = require('graphics/isSegmentCross');

        describe('测试直线相交', function () {

            it('test cross', function () {
                var result = isSegmentCross({"x":209,"y":358,"onCurve":true},{"x":341,"y":228,"onCurve":true},{"x":200,"y":200},{"x":396,"y":401});
                expect(result.length).toEqual(1);
                expect(result[0].x).toBeCloseTo(283, 0);
                expect(result[0].y).toBeCloseTo(285, 0);
            });

            it('test hoz', function () {
                var result = isSegmentCross({"x":246,"y":272,"onCurve":true},{"x":289,"y":171,"onCurve":true},{"x":200,"y":200},{"x":343,"y":200});
                expect(result.length).toEqual(1);
                expect(result[0].x).toBeCloseTo(276.6, 0);
                expect(result[0].y).toEqual(200);
            });

            it('test vertical', function () {
                var result = isSegmentCross({"x":144,"y":302,"onCurve":true},{"x":288,"y":172,"onCurve":true},{"x":201,"y":133},{"x":201,"y":351});
                expect(result.length).toEqual(1);
                expect(result[0].x).toEqual(201);
                expect(result[0].y).toBeCloseTo(250.5, 0);
            });

            it('test parallel', function () {
                var result = isSegmentCross({"x":201,"y":314,"onCurve":true},{"x":201,"y":197,"onCurve":true},{"x":201,"y":151},{"x":201,"y":354});
                expect(result.length).toEqual(2);
                expect(result[0].x).toEqual(201);
                expect(result[0].y).toEqual(197);
                expect(result[1].x).toEqual(201);
                expect(result[1].y).toEqual(314);
            });


            it('test parallel cross', function () {
                var result = isSegmentCross({"x":201,"y":314,"onCurve":true},{"x":201,"y":197,"onCurve":true},{"x":201,"y":149},{"x":201,"y":267});
                expect(result.length).toEqual(2);
                expect(result[0].x).toEqual(201);
                expect(result[0].y).toEqual(197);
                expect(result[1].x).toEqual(201);
                expect(result[1].y).toEqual(267);
            });

            it('test parallel cross', function () {
                var result = isSegmentCross({"x":300,"y":300,"onCurve":true},{"x":350,"y":350,"onCurve":true},{"x":200,"y":200},{"x":400,"y":400});
                expect(result.length).toEqual(2);
                expect(result[0].x).toEqual(300);
                expect(result[0].y).toEqual(300);
                expect(result[1].x).toEqual(350);
                expect(result[1].y).toEqual(350);
            });

            it('test parallel not cross', function () {
                var result = isSegmentCross({"x":312,"y":261,"onCurve":true},{"x":375,"y":323,"onCurve":true},{"x":200,"y":200},{"x":400,"y":400});
                expect(result).toBe(false);
            });

        });
    }
);
