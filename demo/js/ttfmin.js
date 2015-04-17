/**
 * @file ttf字体缩减示例
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function(require) {
        var ttfreader = require('ttf/ttfreader');
        var ttfwriter = require('ttf/ttfwriter');
        var ttf2base64 = require('ttf/ttf2base64');
        var TTF = require('ttf/ttf');
        var ajaxFile = require('common/ajaxFile');
        var lang = require('common/lang');
        var string = require('common/string');

        var curttfData = null;


        function onUpFileChange(e) {
            var file = e.target.files[0];
            var reader = new FileReader();
            reader.onload = function(e) {

                var ttfReader = new ttfreader({
                    hinting: true
                });
                curttfData = ttfReader.read(e.target.result);

                ttfmin();
            }

            reader.onerror = function(e) {
                console.error(e);
            };

            reader.readAsArrayBuffer(file);
        }


        function setFont(data, dom) {
            var tpl = '@font-face {'
                + 'font-family: \'${family}\';'
                + 'src: url(${data}) format(\'truetype\');}';
            $(dom).get(0).innerHTML = string.format(tpl, data);
        }


        function ttfmin() {

            if (!curttfData) {
                return;
            }

            var text = $('#text').val();
            var ttf = new TTF(lang.clone(curttfData));

            var indexList = ttf.findGlyf({
                unicode: text.split('').map(function (u) {
                    return u.charCodeAt(0);
                })
            });

            if (indexList.length) {
                var glyfList = ttf.getGlyf(indexList);
                glyfList.unshift(ttf.getGlyfByIndex(0));
                ttf.get().glyf = glyfList;
            }
            else {
                ttf.get().glyf = [ttf.getGlyfByIndex(0)];
            }

            var family = 'font-with-hitting';
            ttf.get().name.fontFamily = family;
            var writer = new ttfwriter({
                hinting: true
            });
            var buffer = writer.write(ttf.get());
            setFont({
                family: family,
                data: ttf2base64(buffer)
            }, '#' + family);



            var family = 'font-without-hitting';
            ttf.get().name.fontFamily = family;
            var writer = new ttfwriter({
                hinting: false
            });
            var buffer = writer.write(ttf.get());
            setFont({
                family: family,
                data: ttf2base64(buffer)
            }, '#' + family);

            $('.ttf-text').html(text);
        }


        var entry = {

            /**
             * 初始化
             */
            init: function() {
                document.getElementById('upload-file').addEventListener('change', onUpFileChange);
                document.getElementById('text').addEventListener('change', ttfmin);
                document.getElementById('font-size').addEventListener('change', function (e) {
                    $('.ttf-text').css({
                        fontSize: e.target.value + 'px'
                    });
                });
            }
        };

        entry.init();

        return entry;
    }
);
