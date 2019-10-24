/**
 * @file 下载单个字形
 * @author mengke01(kekee000@gmail.com)
 */

import pixelRatio from 'common/getPixelRatio';
import glyf2svgfile from '../widget/util/glyf2svgfile';
import download from '../widget/util/download';
import svg2base64 from 'fonteditor-core/ttf/svg2base64';
import colorpicker from './colorpicker';
import i18n from '../i18n/i18n';
import setting from './setting';

function getSvg(setting) {
    let opt = {
        fillColor: $('#glyf-download-color').val().trim(),
        size: +$('#glyf-download-size').val(),
        unitsPerEm: setting.ttf.head.unitsPerEm
    };
    return glyf2svgfile(setting.glyf, opt);
}

function previewGlyf() {
    // 由于生成的svg文档带xml头部，这里简单的去掉
    let svgText = getSvg(this.setting);
    let size = +$('#glyf-download-size').val();
    let canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;

    let img = new Image();
    img.src = 'data:image/svg+xml;base64,' + btoa(svgText);
    img.width = img.height = size;
    img.onload = function (e) {
        canvas.getContext('2d').drawImage(
            img,
            0, 0, size, size,
            0, 0, pixelRatio * size, pixelRatio * size
        );
    };

    let previewer = $('#glyf-download-preview');
    previewer.children().remove();
    previewer.append(canvas);
}

export default setting.derive({
    title: i18n.lang.dialog_export_glyf,
    nofooter: true,
    getTpl() {
        return require('../template/dialog/glyf-download.tpl');
    },
    set(setting) {
        let onChange = $.proxy(previewGlyf, this);
        $('#glyf-download-color').on('change', onChange);
        $('#glyf-download-size').on('change', onChange);
        colorpicker.show('#glyf-download-color');
        $('#glyf-download-svg').on('click', $.proxy(function (e) {
            let svgText = getSvg(this.setting);
            download((this.setting.glyf.name || 'svg') + '.svg', svg2base64(svgText));
        }, this));

        $('#glyf-download-png').on('click', $.proxy(function (e) {
            let canvas = $('#glyf-download-preview canvas').get(0);
            let imgData = canvas.toDataURL();
            download((this.setting.glyf.name || 'png') + '.png', imgData);
        }, this));

        $('#glyf-download-name').html(setting.glyf.name);
        this.setting = setting;
        previewGlyf.call(this);
    },
    onDispose() {
        $('#glyf-download-color').off('change');
        $('#glyf-download-size').off('change');
        $('#glyf-download-svg').off('click');
        $('#glyf-download-png').off('click');
        this.setting = null;
    }
});
