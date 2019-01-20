/**
 * @file 下载单个字形
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {
        var pixelRatio = require('common/getPixelRatio');
        var i18n = require('../i18n/i18n');
        var glyf2svgfile = require('../widget/util/glyf2svgfile');
        var download = require('../widget/util/download');
        var svg2base64 = require('fonteditor-core/ttf/svg2base64');
        var bytes2base64 = require('fonteditor-core/ttf/util/bytes2base64');
        var colorpicker = require('./colorpicker');

        function getSvg(setting) {
            var opt = {
                fillColor: $('#glyf-download-color').val().trim(),
                size: +$('#glyf-download-size').val(),
                unitsPerEm: setting.ttf.head.unitsPerEm
            };
            return glyf2svgfile(setting.glyf, opt);
        }

        function getSvgSingle(ttf, glyf) {
            var opt = {
                fillColor: $('#glyf-download-color').val().trim(),
                size: 36,
                unitsPerEm: ttf.head.unitsPerEm
            };
            return glyf2svgfile(glyf, opt);
        }

        function previewGlyf() {
            var previewer = $('#glyf-download-preview');
            previewer.children().remove();
            var this_setting = this.setting;

            this_setting.glyfList.forEach(function (item, index) {
                console.log("==================");
                // 由于生成的svg文档带xml头部，这里简单的去掉
                var svgText = getSvgSingle(item.ttf, item.glyf);
                var size = +$('#glyf-download-size').val();
                var canvas = document.createElement('canvas');
                canvas.width = canvas.height = 36;

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
                previewer.append(canvas);
            });
        }

        return require('./setting').derive({
            title: i18n.lang.dialog_batch_export_glyf,
            nofooter: true,
            getTpl: function () {
                return require('../template/dialog/glyf-download-batch.tpl');
            },
            setOne: function (setting) {
                var onChange = $.proxy(previewGlyf, this);
                $('#glyf-download-color').on('change', onChange);
                colorpicker.show('#glyf-download-color');
                setting.glyfList.forEach(function (item, i) {
                    console.log("==================");
                    console.log(item.name);
                });


            },
            set: function (setting) {
                var onChange = $.proxy(previewGlyf, this);
                $('#glyf-download-color').on('change', onChange);
                // 仅改变导出尺寸，不改变显示大小
                // $('#glyf-download-size').on('change', onChange);
                colorpicker.show('#glyf-download-color');
               /* $('#glyf-download-confirm').on('click', $.proxy(function (e) {
                    var svgText = getSvg(this.setting);
                    var target = $(e.target);
                    console.log("----------------------");
                    console.log(this.setting);
                    download((this.setting.glyf.name || 'svg') + '.svg', svg2base64(svgText));
                }, this));

                $('#glyf-download-png').on('click', $.proxy(function (e) {
                    var canvas = $('#glyf-download-preview canvas').get(0);
                    var imgData = canvas.toDataURL();
                    var target = $(e.target);
                    download((this.setting.glyf.name || 'png') + '.png', imgData);
                }, this));*/

                // 名称显示在每个cavas title中
                // $('#glyf-download-name').html(setting.glyf.name);
                this.setting = setting;
                previewGlyf.call(this);
            },
            onDispose: function () {
                $('#glyf-download-color').off('change');
                $('#glyf-download-size').off('change');
                $('#glyf-download-confirm').off('click');
                this.setting = null;
            }
        });
    }
);
