/**
 * @file ttf2woff.js
 * @author mengke01
 * @date 
 * @description
 * ttf2woff 转换
 */

define(
    function(require) {
        var ajaxFile = require('common/ajaxFile');
        var ttf2svg = require('ttf/ttf2svg');
        var svg2base64 = require('ttf/svg2base64');
        var TTFReader = require('ttf/ttfreader');
        var TTF = require('ttf/ttf');

        // 设置字体
        function setFont(base64str) {
            var str = ''
                + '@font-face {'
                + 'font-family:\'truetype\';'
                + 'src:url('
                +   base64str 
                + ') format(\'svg\');'
                + '}';
            document.getElementById('font-face').innerHTML = str;
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
        }



        function write() {
            ajaxFile({
                type: 'binary',
                url: '../font/fonteditor.ttf',
                onSuccess: function(buffer) {

                    var svgBuffer = ttf2svg(buffer, {
                        metadata: 'fonteditor V0.1'
                    });

                    var base64str = svg2base64(svgBuffer);
                    setFont(base64str);


                    var saveBtn = $('.saveas');
                    saveBtn.attr('href', base64str);
                    saveBtn.attr('download', 'save.svg');

                    var ttfReader = new TTFReader();
                    var ttfData = ttfReader.read(buffer);
                    showTTFGlyf(ttfData);

                },
                onError: function() {
                    console.error('error read file');
                }
            });
        }

        var entry = {

            /**
             * 初始化
             */
            init: function () {
                write();
            }
        };

        entry.init();
        
        return entry;
    }
);