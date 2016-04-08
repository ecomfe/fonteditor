/**
 * @file glyf列表渲染器
 * @author mengke01(kekee000@gmail.com)
 */


define(function (require) {
    var computeBoundingBox = require('fonteditor-core/graphics/computeBoundingBox');
    var contours2svg = require('fonteditor-core/ttf/util/contours2svg');
    var pathAdjust = require('fonteditor-core/graphics/pathAdjust');
    var pathCeil = require('fonteditor-core/graphics/pathCeil');
    var string = require('common/string');
    var lang = require('common/lang');
    var SVG_GLYF_TPL = ''
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
    function glyf2svgfile(glyf, opt) {
        var g = {
            size: opt.size,
            unitsPerEm: opt.unitsPerEm,
            name: glyf.name,
            fillColor: opt.fillColor || '#000'
        };

        var d = '';
        if (glyf.contours && glyf.contours.length) {
            var contours = lang.clone(glyf.contours);
            var bound = computeBoundingBox.computePath.apply(null, contours);
            var originSize = Math.max(bound.width, bound.height);
            var scale = opt.unitsPerEm / originSize;
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

    return glyf2svgfile;
});
