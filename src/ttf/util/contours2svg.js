/**
 * @file contours2svg.js
 * @author mengke01
 * @date 
 * @description
 * contours  转 svg path
 */


define(
    function(require) {

        var contour2svg = require('./contour2svg');

        /**
         * contours轮廓转svgpath
         * 
         * @param {Array} contours 轮廓list
         * @return {string} path字符串
         */
        function contours2svg(contours) {
            
            if (!contours.length) {
                return '';
            }

            return contours.map(function(contour) {
                return contour2svg(contour);
            }).join('');
        }

        return contours2svg;
    }
);
