/**
 * @file glyf.js
 * @author mengke01
 * @date
 * @description
 * glyf canvas 绘制
 */

define(
    function(require) {

        var otfreader = require('ttf/otfreader');
        var TTF = require('ttf/ttf');
        var otf2base64 = require('ttf/otf2base64');
        var ajaxFile = require('common/ajaxFile');
        var setFontface = require('./setFontface');
        var otfGlyf2Canvas = require('./otfGlyf2Canvas');
        var glyf2Canvas = require('./glyf2Canvas');
        var otf2ttfobject = require('ttf/otf2ttfobject');
        var lang = require('common/lang');

        var ttf = null;

        // 设置字体
        function setFont(arrayBuffer) {
            var base64 = otf2base64(arrayBuffer);
            setFontface('truetype', base64, 'font-face');
        }

        // 查看ttf glyf
        function showOTFGlyf(otfData) {
            ttf = new TTF(otfData);
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

            var glyf = lang.clone(ttf.getGlyfByCode(charcode));
            if (glyf.compound) {
                glyf.glyfs.forEach(function(g){
                    g.glyf = ttf.getGlyfByIndex(g.glyphIndex);
                });
            }

            var canvas = $('#glyf-canvas').get(0);
            var ctx = canvas.getContext('2d');

            // 调整大小
            ctx.clearRect(0, 0, 600, 600);

            otfGlyf2Canvas(glyf, ctx, {
                stroke: 0,
                scale: 600 / ttf.ttf.head.unitsPerEm,
                height: ttf.ttf.head.unitsPerEm + ttf.ttf.hhea.descent,
                strokeStyle: 'green',
                fillStyle: 'green'
            });
        }


        function onUpFileChange(e) {
            var file = e.target.files[0];
            var reader = new FileReader();
            reader.onload = function(e) {
                var binaryData = e.target.result;
                setFont(binaryData);

                var otfReader = new otfreader();
                var data = otfReader.read(binaryData);
                console.log(data);
                showOTFGlyf(data);
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

                ajaxFile({
                    type: 'binary',
                    url: '../test/SourceSansPro-Regular.otf',
                    onSuccess: function(binaryData) {
                        setFont(binaryData);

                        var otfReader = new otfreader();
                        var data = otfReader.read(binaryData);
                        console.log(data);
                        showOTFGlyf(data);
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
