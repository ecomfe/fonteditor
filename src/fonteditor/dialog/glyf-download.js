/**
 * @file 下载单个字形
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {
        var i18n = require('../i18n/i18n');
        var glyf2svgfile = require('../widget/util/glyf2svgfile');
        var svg2base64 = require('fonteditor-core/ttf/svg2base64');
        var bytes2base64 = require('fonteditor-core/ttf/util/bytes2base64');
        var colorpicker = require('./colorpicker');
        var pixelRatio = require('common/getPixelRatio');

        function getSvg(setting) {
            var opt = {
                fillColor: $('#glyf-download-color').val().trim(),
                size: +$('#glyf-download-size').val(),
                unitsPerEm: setting.ttf.head.unitsPerEm
            };
            return glyf2svgfile(setting.glyf, opt);
        }

        function previewGlyf() {
            // 由于生成的svg文档带xml头部，这里简单的去掉
            var svgText = getSvg(this.setting);
            var size = +$('#glyf-download-size').val();
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

            var previewer = $('#glyf-download-preview');
            previewer.children().remove();
            previewer.append(canvas);
        }

        return require('./setting').derive({
            title: '导出字形',
            nofooter: true,
            getTpl: function () {
                return require('../template/dialog/glyf-download.tpl');
            },
            set: function (setting) {
                var onChange = $.proxy(previewGlyf, this);
                $('#glyf-download-color').on('change', onChange);
                $('#glyf-download-size').on('change', onChange);
                colorpicker.show('#glyf-download-color');
                $('#glyf-download-svg').on('mousedown', $.proxy(function (e) {
                    var svgText = getSvg(this.setting);
                    var target = $(e.target);
                    target.attr('download', (this.setting.glyf.name || 'svg')+ '.svg');
                    target.attr('href', svg2base64(svgText));
                }, this));

                $('#glyf-download-png').on('mousedown', $.proxy(function (e) {
                    var canvas = $('#glyf-download-preview canvas').get(0);
                    var imgData = canvas.toDataURL();
                    var target = $(e.target);
                    target.attr('download', (this.setting.glyf.name || 'png')+ '.png');
                    target.attr('href', imgData);
                }, this));

                $('#glyf-download-name').html(setting.glyf.name);
                this.setting = setting;
                previewGlyf.call(this);
            },
            onDispose: function () {
                $('#glyf-download-color').off('change');
                $('#glyf-download-size').off('change');
                $('#glyf-download-svg').off('mousedown');
                $('#glyf-download-png').off('mousedown');
                this.setting = null;
            }
        });
    }
);
