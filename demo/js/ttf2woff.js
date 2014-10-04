/**
 * @file ttf2woff.js
 * @author mengke01
 * @date 
 * @description
 * ttf2woff 转换
 */

define(
    function(require) {
        var ajaxBinaryFile = require('common/ajaxBinaryFile');
        var ttf2woff = require('ttf/ttf2woff');
        var woff2base64 = require('ttf/woff2base64');
        var TTFReader = require('ttf/ttfreader');
        var TTFWriter = require('ttf/ttfwriter');
        var TTF = require('ttf/ttf');
        var setFontface = require('./setFontface');
        var deflate = require('deflate').deflate;

        // 设置字体
        function setFont(base64str) {
            var str = ''
                + '@font-face {'
                + 'font-family:\'truetype\';'
                + 'src:url('
                +   base64str 
                + ') format(\'woff\');'
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

        var ttf2woffoptions = {
            metadata: {
                vendor: {
                    name: 'mk',
                    url: 'http://www.baidu.com'
                },
                credit: {
                    name: 'mk',
                    url: 'http://www.baidu.com'
                },
                description: 'font editor ver 1.0',
                license:  {
                    url: 'http://www.baidu.com',
                    id: 'id',
                    text: 'font editor ver 1.0' 
                },
                copyright: '"m;k"',
                trademark: 'trademark',
                licensee: 'http://www.baidu.com'
            }
        };


        function write() {
            ajaxBinaryFile({
                url: '../font/iconfont.ttf',
                onSuccess: function(buffer) {

                    var woffBuffer = ttf2woff(buffer, ttf2woffoptions);

                    var base64str = woff2base64(woffBuffer);
                    setFont(base64str);


                    var saveBtn = $('.saveas');
                    saveBtn.attr('href', base64str);
                    saveBtn.attr('download', 'save.woff');



                    var TTFReader = new TTFreader();
                    TTFReader.read(buffer);
                    var ttfData = TTFReader.resolve();
                    showTTFGlyf(ttfData);

                },
                onError: function() {
                    console.error('error read file');
                }
            });
        }

        function readAndWrite() {
            $.getJSON('./js/iconfont.json', function(ttf) {

                var reader = new TTFReader();
                var writer = new TTFWriter();
                var buffer = writer.write(ttf);

                var woffBuffer = ttf2woff(buffer, ttf2woffoptions);

                var base64str = woff2base64(woffBuffer);
                setFont(base64str);


                var saveBtn = $('.saveas');
                saveBtn.attr('href', base64str);
                saveBtn.attr('download', 'save.woff');


                var ttfReader = new TTFReader();
                ttfReader.read(buffer);
                var ttfData = ttfReader.resolve();
                showTTFGlyf(ttfData);

            });
        }


        var entry = {

            /**
             * 初始化
             */
            init: function () {

                ttf2woffoptions.deflate = deflate;
                
                readAndWrite();
            }
        };

        entry.init();
        
        return entry;
    }
);