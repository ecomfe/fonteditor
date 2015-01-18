/**
 * @file glyf.js
 * @author mengke01
 * @date 
 * @description
 * glyf canvas 绘制
 */

define(
    function(require) {

        var ttfreader = require('ttf/ttfreader');
        var TTF = require('ttf/ttf');
        var ttf2base64 = require('ttf/ttf2base64');
        var ajaxFile = require('common/ajaxFile');
        var setFontface = require('./setFontface');
        var glyf2canvas = require('./glyf2canvas');
        var lang = require('common/lang');

        var ttf = null;

        // 设置字体
        function setFont(arrayBuffer) {
            var base64 = ttf2base64(arrayBuffer);
            setFontface('truetype', base64, 'font-face');
        }


        // 查看ttf glyf
        function showTTFGlyf(ttfData) {

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
            
            var glyf = lang.clone(ttf.getCodeGlyf(charcode));
            if (glyf.compound) {
                glyf.glyfs.forEach(function(g){
                    g.glyf = ttf.getIndexGlyf(g.glyphIndex);
                });
            }

            var canvas = $('#glyf-canvas').get(0);
            var ctx = canvas.getContext('2d');

            // 调整大小
            var width =  glyf.xMax - glyf.xMin;
            var height =  glyf.yMax - glyf.yMin;
            var scale = 1;
            if(ttf.ttf.head.unitsPerEm > 512) {
                scale = 512 / ttf.ttf.head.unitsPerEm;
                width = width * scale;
                height = height * scale;
            }

            ctx.clearRect(0, 0, 600, 600);

            glyf2canvas(glyf, ctx, {
                stroke: 0,
                scale: scale,
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

                var ttfReander = new ttfreader();
                var ttfData = ttfReander.read(binaryData);
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

                ajaxFile({
                    type: 'binary',
                    url: '../test/baiduHealth.ttf',
                    onSuccess: function(binaryData) {
                        setFont(binaryData);

                        var ttfReander = new ttfreader();
                        var ttfData = ttfReander.read(binaryData);
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
