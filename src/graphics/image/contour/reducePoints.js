/**
 * @file 消减点
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {

        var douglasPeuckerReducePoints = require('graphics/image/contour/douglasPeuckerReducePoints');
        var makeLink = require('graphics/pathUtil').makeLink;
        var vector = require('graphics/vector');
        var getCos = vector.getCos;
        var getDist = vector.getDist;

        function dist(p0, p1) {
            return Math.sqrt(Math.pow(p0.x - p1.x, 2) + Math.pow(p0.y - p1.y, 2));
        }

        /**
         * 消减非必要的点
         *
         * @param  {Array} contour 轮廓点集
         * @param  {number} firstIndex   起始索引
         * @param  {number} lastIndex    结束索引
         * @return {Array}  消减后的点集
         */
        function reducePoints(contour, firstIndex, lastIndex, scale, tolerance) {
            return douglasPeuckerReducePoints(contour, firstIndex, lastIndex, scale, tolerance);
        }

        return reducePoints;
    }
);
