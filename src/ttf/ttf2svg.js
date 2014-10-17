/**
 * @file ttf2svg.js
 * @author mengke01
 * @date 
 * @description
 * ttf转svg
 * 
 * references:
 * http://www.w3.org/TR/SVG11/fonts.html
 */

define(
    function(require) {
        var string = require('common/string');
        var TTFReader = require('./ttfreader');
        var contours2svg = require('./util/contours2svg');
        var error = require('./error');

        // svg font id
        var SVG_FONT_ID = 'fonteditor';

        //xml 模板
        var XML_TPL = ''
            + '<?xml version="1.0" standalone="no"?>'
            +   '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd" >'
            +   '<svg xmlns="http://www.w3.org/2000/svg">'
            +   '<metadata>${metadata}</metadata>'
            +   '<defs><font id="${id}" horiz-adv-x="${advanceWidth}">'
            +       '<font-face font-family="${fontFamily}" font-weight="${fontWeight}" font-stretch="normal"'
            +           ' units-per-em="${unitsPerEm}" panose-1="${panose}" ascent="${ascent}" descent="${descent}"'
            +           ' x-height="${xHeight}" bbox="${bbox}" underline-thickness="${underlineThickness}"'
            +           ' underline-position="${underlinePosition}" unicode-range="${unicodeRange}" />'
            +       '<missing-glyph horiz-adv-x="${missing.advanceWidth}" ${missing.d} />'
            +       '${glyphList}'
            +   '</font></defs>'
            + '</svg>';

        // glyph 模板
        var GLYPH_TPL = '<glyph glyph-name="${name}" unicode="${unicode}" d="${d}" />';

        /**
         * unicode 转xml编码格式
         * 
         * @param {Array} unicode unicode字符集
         * @return {string} xml编码格式
         */
        function unicode2xml(unicode) {
            if (typeof(unicode) == 'number') {
                unicode = [unicode];
            }
            return unicode.map(function(u) {
                if (u < 0x20) {
                    return '';
                }
                return u >= 0x20 && u <= 255 ? string.encodeHTML(String.fromCharCode(u).toLowerCase()) : '&#x' + u.toString(16) + ';';
            }).join('');
        }

        /**
         * ttf数据结构转svg
         * 
         * @param {ttfObject} ttf ttfObject对象
         * @param {Object} options 选项
         * @param {Object} options.metadata 字体相关的信息
         * @return {string} svg字符串
         */
        function ttfobject2svg(ttf, options) {

            var OS2 = ttf['OS/2'];

            // 用来填充xml的数据
            var xmlObject = {
                id: SVG_FONT_ID,
                metadata: string.encodeHTML(options.metadata || ''),
                advanceWidth: ttf.hhea.advanceWidthMax,
                fontFamily: ttf.name.fontFamily,
                fontWeight: OS2.usWeightClass,
                unitsPerEm: ttf.head.unitsPerEm,
                panose: [
                    OS2.bFamilyType, OS2.bSerifStyle, OS2.bWeight, OS2.bProportion, OS2.bContrast,
                    OS2.bStrokeVariation, OS2.bArmStyle, OS2.bLetterform, OS2.bMidline, OS2.bXHeight
                ].join(' '),
                ascent: ttf.hhea.ascent,
                descent: ttf.hhea.descent,
                xHeight: OS2.bXHeight,
                bbox: [ttf.head.xMin, ttf.head.yMin, ttf.head.xMax, ttf.head.yMax].join(' '),
                underlineThickness: ttf.post.underlineThickness,
                underlinePosition: ttf.post.underlinePosition, 
                unicodeRange: 'U+' + string.pad(OS2.usFirstCharIndex.toString(16), 4)
                    + '-' + string.pad(OS2.usLastCharIndex.toString(16), 4)
            };

            // glyf 第一个为missing glyph
            xmlObject.missing = {};
            xmlObject.missing.advanceWidth = ttf.glyf[0].advanceWidth || 0;
            xmlObject.missing.d = ttf.glyf[0].contours && ttf.glyf[0].contours.length 
                ? 'd="' + contours2svg(ttf.glyf[0].contours) + '"' : '';

            // glyf 信息
            var glyphList = '';
            for (var i = 1, l = ttf.glyf.length; i < l ; i++) {
                var glyf = ttf.glyf[i];

                // 筛选简单字形，并且有轮廓，有编码
                if (!glyf.compound && glyf.contours && glyf.unicode && glyf.unicode.length) {
                    var glyfObject = {
                        name: glyf.name,
                        unicode: unicode2xml(glyf.unicode),
                        d: contours2svg(glyf.contours)
                    };
                    glyphList += string.format(GLYPH_TPL, glyfObject);
                }
            }
            xmlObject.glyphList = glyphList;

            return string.format(XML_TPL, xmlObject);
        }


        /**
         * ttf格式转换成svg字体格式
         * 
         * @param {ArrayBuffer|ttfObject} ttfBuffer ttf缓冲数组或者ttfObject对象
         * @param {Object} options 选项
         * @param {Object} options.metadata 字体相关的信息
         * 
         * @return {string} svg字符串
         */
        function ttf2svg(ttfBuffer, options) {

            options = options || {};

            // 读取ttf二进制流
            if (ttfBuffer instanceof ArrayBuffer) {
                var reader = new TTFReader();
                var ttfObject = reader.read(ttfBuffer); 
                reader.dispose();

                return ttfobject2svg(ttfObject, options);
            }
            // 读取ttfObject
            else if(ttfBuffer.version && ttfBuffer.glyf) {

                return ttfobject2svg(ttfBuffer, options);
            }
            else {
                error.raise(10109);
            }
        }
        return ttf2svg;
    }
);
