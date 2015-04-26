
define(
    function (require) {

        var vector = require('graphics/vector');

        describe('测试点到直线距离', function () {

            it('test verital', function () {
                var p0 = {x: 10, y: 10};
                var p1 = {x: 20, y: 10};
                var p = {x: 50, y: 10};
                expect(vector.getDist(p0, p1, p)).toEqual(0);
            });

            it('test hoz', function () {
                var p0 = {x: 10, y: 10};
                var p1 = {x: 10, y: 20};
                var p = {x: 10, y: 80};
                expect(vector.getDist(p0, p1, p)).toEqual(0);
            });

            it('test sameline', function () {
                var p0 = {x: 10, y: 10};
                var p1 = {x: 50, y: 50};
                var p = {x: 25, y: 25};
                expect(vector.getDist(p0, p1, p)).toEqual(0);


                var p0 = {x: 10, y: 10};
                var p1 = {x: 50, y: 50};
                var p = {x: 80, y: 80};
                expect(vector.getDist(p0, p1, p)).toEqual(0);
            });

            it('test hoz dist', function () {
                var p0 = {x: 10, y: 10};
                var p1 = {x: 10, y: 40};
                var p = {x: 50, y: 47};
                expect(vector.getDist(p0, p1, p)).toEqual(40);


                var p0 = {x: 45, y: 50};
                var p1 = {x: 50, y: 50};
                var p = {x: 90, y: 25};
                expect(vector.getDist(p0, p1, p)).toEqual(25);
            });


            it('test dist', function () {
                var p0 = {x: 50, y: 50};
                var p1 = {x: 0, y: 0};
                var p = {x: 50, y: 0};
                expect(vector.getDist(p0, p1, p)).toBeCloseTo(35.36, 2);


                var p0 = {x: 50, y: 50};
                var p1 = {x: 0, y: 0};
                var p = {x: 50, y: 0};
                expect(vector.getDist(p0, p1, p)).toBeCloseTo(35.36, 2);
            });


        });
    }
);
