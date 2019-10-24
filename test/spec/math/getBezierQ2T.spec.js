/**
 * @file getBezierQ2T
 * @author mengke01(kekee000@gmail.com)
 */


import assert from 'assert';
import getBezierQ2T from 'math/getBezierQ2T';

describe('获得bezier曲线坐标t', function () {

    it('test false', function () {
        let t = getBezierQ2T({"x":786,"y":638},{"x":673,"y":545},{"x":526,"y":545}, {x: 544.779145, y: 644.574325});
        assert.equal(t, false);
    });

    it('test start', function () {
        let t = getBezierQ2T({"x":786,"y":638},{"x":673,"y":545},{"x":526,"y":545}, {"x":786,"y":638});
        assert.equal(t, 0);
    });

    it('test end', function () {
        let t = getBezierQ2T({"x":786,"y":638},{"x":673,"y":545},{"x":526,"y":545}, {"x":526,"y":545});
        assert.equal(t, 1);
    });

    it('test middle', function () {
        let t = getBezierQ2T({"x":786,"y":638},{"x":673,"y":545},{"x":526,"y":545}, {x: 664.5, y: 568.25});
        assert.equal(t, 0.5);
    });

});
