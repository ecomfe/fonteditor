
define(
    function (require) {
        var getBezierQ2Point = require('math/getBezierQ2Point');
        var getBezierQ2T = require('math/getBezierQ2T');

        describe('获得bezier曲线坐标t', function () {

            it('test false', function () {
                var t = getBezierQ2T({"x":786,"y":638},{"x":673,"y":545},{"x":526,"y":545}, {x: 544.779145, y: 644.574325});
                expect(t).toBeFalsy();
            });

            it('test start', function () {
                var t = getBezierQ2T({"x":786,"y":638},{"x":673,"y":545},{"x":526,"y":545}, {"x":786,"y":638});
                expect(t).toEqual(0);
            });

            it('test end', function () {
                var t = getBezierQ2T({"x":786,"y":638},{"x":673,"y":545},{"x":526,"y":545}, {"x":526,"y":545});
                expect(t).toEqual(1);
            });

            it('test middle', function () {
                var t = getBezierQ2T({"x":786,"y":638},{"x":673,"y":545},{"x":526,"y":545}, {x: 664.5, y: 568.25});
                expect(t).toEqual(0.5);
            });

        });
    }
);
