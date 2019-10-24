/**
 * @file vector
 * @author mengke01(kekee000@gmail.com)
 */

import assert from 'assert';
import vector from 'graphics/vector';

describe('测试点到直线距离', function () {

    it('test verital', function () {
        let p0 = {x: 10, y: 10};
        let p1 = {x: 20, y: 10};
        let p = {x: 50, y: 10};
        assert.equal(vector.getDist(p0, p1, p), 0);
    });

    it('test hoz', function () {
        let p0 = {x: 10, y: 10};
        let p1 = {x: 10, y: 20};
        let p = {x: 10, y: 80};
        assert.equal(vector.getDist(p0, p1, p), 0);
    });

    it('test sameline', function () {
        let p0 = {x: 10, y: 10};
        let p1 = {x: 50, y: 50};
        let p = {x: 25, y: 25};
        assert.equal(vector.getDist(p0, p1, p), 0);


        p0 = {x: 10, y: 10};
        p1 = {x: 50, y: 50};
        p = {x: 80, y: 80};
        assert.equal(vector.getDist(p0, p1, p), 0);
    });

    it('test hoz dist', function () {
        let p0 = {x: 10, y: 10};
        let p1 = {x: 10, y: 40};
        let p = {x: 50, y: 47};
        assert.equal(vector.getDist(p0, p1, p), 40);


        p0 = {x: 45, y: 50};
        p1 = {x: 50, y: 50};
        p = {x: 90, y: 25};
        assert.equal(vector.getDist(p0, p1, p), 25);
    });


    it('test dist', function () {
        let p0 = {x: 50, y: 50};
        let p1 = {x: 0, y: 0};
        let p = {x: 50, y: 0};
        assert.equal(vector.getDist(p0, p1, p).toFixed(2), 35.36);


        p0 = {x: 50, y: 50};
        p1 = {x: 0, y: 0};
        p = {x: 50, y: 0};
        assert.equal(vector.getDist(p0, p1, p).toFixed(2), 35.36);
    });
});