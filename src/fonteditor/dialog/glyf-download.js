/**
 * @file 下载单个字形
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {
        var pixelRatio = require('common/getPixelRatio');
        var i18n = require('../i18n/i18n');
        var glyph2svgfile = require('../widget/util/glyph2svgfile');
        var download = require('../widget/util/download');
        var svg2base64 = require('fonteditor-core/ttf/svg2base64');
        var bytes2base64 = require('fonteditor-core/ttf/util/bytes2base64');
        var colorpicker = require('./colorpicker');

        function getSvg(setting) {
            var opt = {
                fillColor: $('#glyph-download-color').val().trim(),
                size: +$('#glyph-download-size').val(),
                unitsPerEm: setting.ttf.head.unitsPerEm
            };
            return glyph2svgfile(setting.glyph, opt);
        }

        function previewglyph() {
            // 由于生成的svg文档带xml头部，这里简单的去掉
            var svgText = getSvg(this.setting);
            var size = +$('#glyph-download-size').val();
            var canvas = document.createElement('canvas');
            canvas.width = canvas.height = size;

            var img = new Image();
            img.src = 'data:image/svg+xml;base64,' + btoa(svgText);
            img.width = img.height = size;
            img.onload = function (e) {
                canvas.getContext('2d').drawImage(
                    img,
                    0, 0, size, size,
                    0, 0, pixelRatio * size, pixelRatio * size
                );
            };

            var previewer = $('#glyph-download-preview');
            previewer.children().remove();
            previewer.append(canvas);
        }

        return require('./setting').derive({
            title: i18n.lang.dialog_export_glyph,
            nofooter: true,
            getTpl: function () {
                return require('../template/dialog/glyph-download.tpl');
            },
            set: function (setting) {
                var onChange = $.proxy(previewglyph, this);
                $('#glyph-download-color').on('change', onChange);
                $('#glyph-download-size').on('change', onChange);
                colorpicker.show('#glyph-download-color');
                $('#glyph-download-svg').on('click', $.proxy(function (e) {
                    var svgText = getSvg(this.setting);
                    var target = $(e.target);
                    download((this.setting.glyph.name || 'svg') + '.svg', svg2base64(svgText));
                }, this));

                $('#glyph-download-png').on('click', $.proxy(function (e) {
                    var canvas = $('#glyph-download-preview canvas').get(0);
                    var imgData = canvas.toDataURL();
                    var target = $(e.target);
                    download((this.setting.glyph.name || 'png') + '.png', imgData);
                }, this));

                $('#glyph-download-name').html(setting.glyph.name);
                this.setting = setting;
                previewglyph.call(this);
            },
            onDispose: function () {
                $('#glyph-download-color').off('change');
                $('#glyph-download-size').off('change');
                $('#glyph-download-svg').off('click');
                $('#glyph-download-png').off('click');
                this.setting = null;
            }
        });
    }
);
