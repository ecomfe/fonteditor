/**
 * @file isSegmentCross
 * @author mengke01(kekee000@gmail.com)
 */
import assert from 'assert';
import isSegmentCross from 'graphics/isSegmentCross';

describe('测试直线相交', function () {

    it('test cross', function () {
        let result = isSegmentCross({"x":209,"y":358,"onCurve":true},{"x":341,"y":228,"onCurve":true},{"x":200,"y":200},{"x":396,"y":401});
        assert.equal(result.length, 1);
        assert.equal(result[0].x.toFixed(1), 283);
        assert.equal(result[0].y.toFixed(1), 285.1);
    });

    it('test hoz', function () {
        let result = isSegmentCross({"x":246,"y":272,"onCurve":true},{"x":289,"y":171,"onCurve":true},{"x":200,"y":200},{"x":343,"y":200});
        assert.equal(result.length, 1);
        assert.equal(result[0].x.toFixed(1), 276.7);
        assert.equal(result[0].y, 200);
    });

    it('test vertical', function () {
        let result = isSegmentCross({"x":144,"y":302,"onCurve":true},{"x":288,"y":172,"onCurve":true},{"x":201,"y":133},{"x":201,"y":351});
        assert.equal(result.length, 1);
        assert.equal(result[0].x, 201);
        assert.equal(result[0].y.toFixed(1), 250.5);
    });

    it('test parallel', function () {
        let result = isSegmentCross({"x":201,"y":314,"onCurve":true},{"x":201,"y":197,"onCurve":true},{"x":201,"y":151},{"x":201,"y":354});
        assert.equal(result.length, 2);
        assert.equal(result[0].x, 201);
        assert.equal(result[0].y, 197);
        assert.equal(result[1].x, 201);
        assert.equal(result[1].y, 314);
    });


    it('test parallel cross', function () {
        let result = isSegmentCross({"x":201,"y":314,"onCurve":true},{"x":201,"y":197,"onCurve":true},{"x":201,"y":149},{"x":201,"y":267});
        assert.equal(result.length, 2);
        assert.equal(result[0].x, 201);
        assert.equal(result[0].y, 197);
        assert.equal(result[1].x, 201);
        assert.equal(result[1].y, 267);
    });

    it('test parallel cross', function () {
        let result = isSegmentCross({"x":300,"y":300,"onCurve":true},{"x":350,"y":350,"onCurve":true},{"x":200,"y":200},{"x":400,"y":400});
        assert.equal(result.length, 2);
        assert.equal(result[0].x, 300);
        assert.equal(result[0].y, 300);
        assert.equal(result[1].x, 350);
        assert.equal(result[1].y, 350);
    });

    it('test parallel not cross', function () {
        let result = isSegmentCross({"x":312,"y":261,"onCurve":true},{"x":375,"y":323,"onCurve":true},{"x":200,"y":200},{"x":400,"y":400});
        assert.equal(result, false);
    });

});
