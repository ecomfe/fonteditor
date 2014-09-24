/**
 * @file glyfsvg.js
 * @author mengke01
 * @date 
 * @description
 * glyf 查看
 */

define(
    function(require) {

        var ttfreader = require('ttf/ttfreader');
        var TTF = require('ttf/ttf');
        var ttf2base64 = require('ttf/ttf2base64');
        var ajaxBinaryFile = require('common/ajaxBinaryFile');
        var glyf2svg = require('ttf/util/glyf2svg');
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
            var codes = ttf.codes();

            var str = '';

            // 获取unicode字符
            codes.forEach(function(item) {
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
                + '<svg class="glyf">'
                + ' <g>'
                +   '<path class="path" d="M 0,0" />'
                +   '</g>'
                +  '</svg>';
            var svg = $(tpl);
            var glyf = ttf.getCodeGlyf(charcode);
            var lang = require('common/lang');

            // 调整大小
            var width =  glyf.xMax - glyf.xMin;
            var height =  glyf.yMax - glyf.yMin;
            var scale = 1;

            if(ttf.ttf.head.unitsPerEm > 512) {
                scale = 512 / ttf.ttf.head.unitsPerEm;
                width = width * scale;
                height = height * scale;
            }

            var path = glyf2svg(glyf, {
                scale: scale
            });

            if (path) {
                svg.css({
                    width: width,
                    height: height
                });
                svg.attr('viewbox', '0 0 ' + width + ' ' + height);
                svg.find(".path").attr('d', path);
            }

            $('#svg-view').html(svg);
        }


        function onUpFileChange(e) {
            var file = e.target.files[0];
            var reader = new FileReader();
            reader.onload = function(e) {
                var binaryData = e.target.result;
                setFont(binaryData);
                var ttfReander = new ttfreader();
                ttfReander.read(binaryData);
                var ttfData = ttfReander.resolve();
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

                        var ttfReander = new ttfreader();
                        ttfReander.read(binaryData);
                        var ttfData = ttfReander.resolve();
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
