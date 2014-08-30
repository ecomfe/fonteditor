/**
 * @file glyf.js
 * @author mengke01
 * @date 
 * @description
 * glyf 查看
 */

define(
    function(require) {

        var ttfreader = require('editor/ttf/ttfreader');
        var TTF = require('editor/ttf/ttf');
        var ttf2base64 = require('editor/ttf/ttf2base64');
        var ajaxBinaryFile = require('editor/common/ajaxBinaryFile');
        var glyf2svg = require('editor/ttf/glyf2svg');
        var setFontface = require('./setFontface');
        var ttf = null;

        // 设置字体
        function setFont(arrayBuffer) {
            var base64 = ttf2base64(arrayBuffer);
            setFontface('truetype', base64, 'font-face');
        }


        // 查看ttf glyf
        function showTTFGlyf(ttfData) {
            console.log(ttfData);
            ttf = new TTF(ttfData);
            var chars = ttf.chars();

            var str = '';

            // 获取unicode字符
            chars.forEach(function(item) {
                str += '<li data-code="'+ item +'">'
                    + '<span class="i-font">'+ String.fromCharCode(item) +'</span>'
                    +   (item > 255 ? '\\u' + Number(item).toString(16) : item) 
                    +'</li>';
            });

            $('#font-list').html(str);

            $('#font-list li:nth-child(4)').click();
        }

        function showGlyf(charcode) {
            var tpl = ''
                + '<svg class="glyf" viewBox="0 0 1200 2000">'
                + ' <g transform="translate(1000, 0) scale(-1, 1) rotate(180, 500, 500)">'
                +   '<polyline class="boundary" points="" />'
                +   '<path class="path" d="M 0,0" />'
                +   '</g>'
                +  '</svg>';
            var svg = $(tpl);
            var glyf = ttf.getCharGlyf(charcode);
            var path = glyf2svg(glyf);
            if (path) {
                var scale = 1000 / ttf.ttf.head.unitsPerEm;
                var boundary = ''
                    + glyf.xMin + ',' + glyf.yMin + ' '
                    + glyf.xMin + ',' + glyf.yMax + ' '
                    + glyf.xMax + ',' + glyf.yMax + ' '
                    + glyf.xMax + ',' + glyf.yMin + ' '
                    + glyf.xMin + ',' + glyf.yMin + ' ';

                svg.find(".boundary").attr('points', boundary).attr('transform', 'scale(' + scale + ',' + scale + ')');
                svg.find(".path").attr('d', path).attr('transform', 'scale(' + scale + ',' + scale + ')');
            }

            $('#svg-view').html(svg);
        }


        function onUpFileChange(e) {
            var file = e.target.files[0];
            var reader = new FileReader();
            reader.onload = function(e) {
                var binaryData = e.target.result;
                setFont(binaryData);

                var ttfData = new ttfreader().read(binaryData);
                showTTFGlyf(ttfData);
            }

            reader.onerror = function(e) {
                console.error(e);
            };
            reader.readAsArrayBuffer(file);
        }

        var entry = {

            /**
             * 初始化
             */
            init: function() {
                var upFile = document.getElementById('upload-file');
                upFile.addEventListener('change', onUpFileChange);

                ajaxBinaryFile({
                    url: '../font/baiduHealth.ttf',
                    onSuccess: function(binaryData) {
                        setFont(binaryData);

                        var ttfData = new ttfreader().read(binaryData);
                        showTTFGlyf(ttfData);
                    },
                    onError: function() {
                        console.error('error read file');
                    }
                });


                $('#font-list').delegate('li', 'click', function(e) {
                    $('#font-list li').removeClass('selected');
                    $(this).addClass('selected');
                    showGlyf(+$(this).attr('data-code'));
                });
            }
        };

        entry.init();

        return entry;
    }
);
