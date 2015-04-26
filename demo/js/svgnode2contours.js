/**
 * @file svgnode2contours.js
 * @author mengke01
 * @date
 * @description
 * svg转ttfobject
 */

define(
    function(require) {
        var ajaxFile = require('common/ajaxFile');
        var svgnode2contours = require('ttf/svg/svgnode2contours');
        var contours2svg = require('ttf/util/contours2svg');

        var entry = {

            /**
             * 初始化
             */
            init: function () {

                ajaxFile({
                    type: 'xml',
                    url: './test/svgnodes.svg',
                    onSuccess: function(xml) {

                        var contours = svgnode2contours(xml.getElementsByTagName('*'));
                        var path = contours2svg(contours);

                        $('#path').attr('d', path);
                    },
                    onError: function() {
                        console.error('error read file');
                    }
                });
            }
        };

        entry.init();

        return entry;
    }
);
