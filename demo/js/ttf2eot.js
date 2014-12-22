/**
 * @file ttf2eot.js
 * @author mengke01
 * @date 
 * @description
 * ttf2eot 转换
 */

define(
    function(require) {
        var ajaxFile = require('common/ajaxFile');
        var ttf2eot = require('ttf/ttf2eot');
        var eot2ttf = require('ttf/eot2ttf');
        var ttf2base64 = require('ttf/ttf2base64');
        var eot2base64 = require('ttf/eot2base64');
        var TTFReader = require('ttf/ttfreader');
        var TTFWriter = require('ttf/ttfwriter');
        var TTF = require('ttf/ttf');

        // 设置字体
        function setFont(base64str) {
            var str = ''
                + '@font-face {'
                + 'font-family:\'truetype\';'
                + 'src:url('
                +   base64str 
                + ') format(\'truetype\');'
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

                    var eotBuffer = ttf2eot(buffer);

                    var ttfReader = new TTFReader();
                    var ttfBuffer = eot2ttf(eotBuffer);
                    var ttfData = ttfReader.read(ttfBuffer);
                    showTTFGlyf(ttfData);

                    var base64str = ttf2base64(ttfBuffer);
                    setFont(base64str);

                    var base64str = eot2base64(eotBuffer);
                    var saveBtn = $('.saveas');
                    saveBtn.attr('href', base64str);
                    saveBtn.attr('download', 'save.eot');

                },
                onError: function() {
                    console.error('error read file');
                }
            });
        }


        function readeot() {
            ajaxFile({
                type: 'binary',
                url: '../font/fonteditor.eot',
                onSuccess: function(buffer) {


                    var ttfBuffer = eot2ttf(buffer);
                    var ttfReader = new TTFReader();
                    var ttfData = ttfReader.read(ttfBuffer);
                    var base64str = ttf2base64(ttfBuffer);
                    setFont(base64str);
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
                //write();
                readeot();
            }
        };

        entry.init();
        
        return entry;
    }
);