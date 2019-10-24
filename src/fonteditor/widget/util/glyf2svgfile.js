/**
 * @file glyf列表渲染器
 * @author mengke01(kekee000@gmail.com)
 */


import computeBoundingBox from 'graphics/computeBoundingBox';
import contours2svg from 'fonteditor-core/ttf/util/contours2svg';
import pathAdjust from 'fonteditor-core/graphics/pathAdjust';
import pathCeil from 'fonteditor-core/graphics/pathCeil';
import stringUtil from 'fonteditor-core/ttf/util/string';
import string from 'common/string';
import lang from 'common/lang';

const SVG_GLYF_TPL = ''
        + '<?xml version="1.0" encoding="utf-8"?>'
        + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"'
        +   ' "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'
        + '<svg id="${name}" width="${size}" height="${size}"'
        +   ' style="width:${size}px;height:${size}px;" version="1.1"'
        +   ' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${unitsPerEm} ${unitsPerEm}"'
        +   ' enable-background="new 0 0 ${unitsPerEm} ${unitsPerEm}" xml:space="preserve">'
        +   '<path fill="${fillColor}" ${d}/>'
        + '</svg>';

/**
 * 获取glyf渲染列表项目
 *
 * @param  {Object} glyf glyf结构
 * @param  {Object} opt  渲染参数
 * @return {string}      glyf列表项目片段
 */
export default function glyf2svgfile(glyf, opt) {
    let g = {
        size: opt.size,
        unitsPerEm: opt.unitsPerEm,
        name: stringUtil.escape(glyf.name),
        fillColor: opt.fillColor || '#000'
    };

    if (glyf.contours && glyf.contours.length) {
        let contours = lang.clone(glyf.contours);
        let bound = computeBoundingBox.computePath.apply(null, contours);
        let originSize = Math.max(bound.width, bound.height);
        let scale = opt.unitsPerEm / originSize;
        contours.forEach(function (contour) {
            pathAdjust(contour, 1, 1, -bound.x, -bound.y - bound.height / 2);
            pathAdjust(contour, 1, -1, 0, 0);
            pathAdjust(contour, scale, scale, (originSize - bound.width) / 2, bound.height / 2);
            pathCeil(contour, 2);
        });
        g.d = 'd="' + contours2svg(contours) + '"';
    }

    return string.format(SVG_GLYF_TPL, g);
}
