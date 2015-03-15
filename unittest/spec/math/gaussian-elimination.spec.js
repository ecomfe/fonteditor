
define(
    function (require) {

        var gauss = require('math/gaussian-elimination');

        describe('测试基本线性方程组', function () {

            it('test one', function () {
                var $A = [[4]];
                var $x = [8];
                var $result = gauss($A, $x);
                expect($result).toEqual([2]);
            });

            it('test two', function () {
                var $A = [[1, 1], [2, 1]];
                var $x = [10, 16];
                var $result = gauss($A, $x);
                expect($result).toEqual([6, 4]);
            });

            it('test three', function () {
                var $A = [[1, 1, 1], [2, 1, 2], [1, 2, 3]];
                var $x = [6, 10, 14];
                var $result = gauss($A, $x);
                expect($result).toEqual([1, 2, 3]);
            });
        });
    }
);
