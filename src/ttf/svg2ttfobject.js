/**
 * @file svg2ttfObject.js
 * @author mengke01
 * @date 
 * @description
 * svg格式转ttfObject格式
 */


define(
    function(require) {
        var string = require('common/string');
        var svg2contours = require('./util/svg2contours');
        var computeBoundingBox = require('graphics/computeBoundingBox');
        var error = require('./error');

        /**
         * 加载xml字符串
         * 
         * @param {string} xml xml字符串
         * @return {XMLDocument}
         */
        function loadXML(xml) {
            if (document.implementation && document.implementation.createDocument) {
                try {
                    var domParser = new DOMParser();
                    xmlDoc = domParser.parseFromString(xml, 'text/xml');
                    return xmlDoc;
                }
                catch(exp) {
                    error.raise(10103);
                }
            }
            error.raise(10004);
        }

        /**
         * 获取空的ttfObject
         * 
         * @return {Object} ttfObject对象
         */
        function getEmptyObject() {
            return {
                'from': 'svg',
                'OS/2': {},
                'name': {},
                'hhea': {},
                'head': {},
                'post': {},
                'glyf': []
            };
        }


        /**
         * 对ttfObject进行处理，去除小数
         * 
         * @param {Object} ttf ttfObject
         * @return {Object} ttfObject
         */
        function resolve(ttf) {

            var scale = 1;

            // 对于小尺寸svg进行合理的缩放
            if (ttf.head.unitsPerEm && ttf.head.unitsPerEm < 256) {
                scale = 1024 / ttf.head.unitsPerEm;
                ttf.head.unitsPerEm = 1024;
            }

            ttf.glyf.forEach(function(glyf) {
                if (glyf.contours && glyf.contours.length) {

                    glyf.contours.forEach(function(contour) {
                        contour.forEach(function(p) {
                            p.x = Math.round(p.x * scale);
                            p.y = Math.round(p.y * scale);
                        });
                    });

                    var bound = computeBoundingBox.computePathBox.apply(null, glyf.contours);
                    glyf.xMin = bound.x;
                    glyf.xMax = bound.x + bound.width;
                    glyf.yMin = bound.y;
                    glyf.yMax = bound.y + bound.height;

                    if (glyf.leftSideBearing) {
                        glyf.leftSideBearing = Math.round(glyf.leftSideBearing * scale);
                    }
                    else {
                        glyf.leftSideBearing = glyf.xMin;
                    }

                    if (glyf.advanceWidth) {
                        glyf.advanceWidth = Math.round(glyf.advanceWidth * scale);
                    }
                    else {
                        glyf.advanceWidth = glyf.xMax + Math.abs(glyf.xMin);
                    }
                }
            });
    
            if (undefined !== ttf.head.xMin && undefined !== ttf.head.yMax) {
                ttf.head.xMin = Math.round(ttf.head.xMin * scale);
                ttf.head.xMax = Math.round(ttf.head.xMax * scale);
                ttf.head.yMin = Math.round(ttf.head.yMin * scale);
                ttf.head.yMax = Math.round(ttf.head.yMax * scale);
            }

            ttf.head.unitsPerEm = ttf.head.unitsPerEm ? Math.round(ttf.head.unitsPerEm) : 1024;

            return ttf;
        }


        /**
         * 解析xml文档
         * 
         * @param {XMLDocument} xmlDoc XML文档对象
         * @return {Object} 解析后对象
         */
        function parseXML(xmlDoc) {

            var ttf =getEmptyObject();
            var svgNode = xmlDoc.getElementsByTagName('svg')[0];

            if (!svgNode) {
                error.raise(10106);
            }

            var metaNode = xmlDoc.getElementsByTagName('metadata')[0];
            var fontNode = xmlDoc.getElementsByTagName('font')[0];
            var fontFaceNode = xmlDoc.getElementsByTagName('font-face')[0];
            var missingNode = xmlDoc.getElementsByTagName('missing-glyph')[0];

            if (metaNode && metaNode.textContent) {
                ttf.metadata = string.decodeHTML(metaNode.textContent.trim());
            }

            // 解析font
            if (fontNode) {
                ttf.id = fontNode.getAttribute('id') || '';
                ttf.hhea.advanceWidthMax = +(fontNode.getAttribute('horiz-adv-x') || 0);
            }

            if (fontFaceNode) {
                var OS2 = ttf['OS/2'];
                ttf.name.fontFamily = fontFaceNode.getAttribute('font-family') || '';
                OS2.usWeightClass = +(fontFaceNode.getAttribute('font-weight') || 0);
                ttf.head.unitsPerEm = +(fontFaceNode.getAttribute('units-per-em') || 0);

                // 解析panose, eg: 2 0 6 3 0 0 0 0 0 0
                var panose = (fontFaceNode.getAttribute('panose-1') || '').split(' ');
                ['bFamilyType', 'bSerifStyle', 'bWeight', 'bProportion', 'bContrast',
                'bStrokeVariation', 'bArmStyle', 'bLetterform', 'bMidline', 'bXHeight'].forEach(function(name, i) {
                    OS2[name] = +(panose[i] || 0);
                });

                ttf.hhea.ascent = +(fontFaceNode.getAttribute('ascent') || 0);
                ttf.hhea.descent = +(fontFaceNode.getAttribute('descent') || 0);
                OS2.bXHeight = +(fontFaceNode.getAttribute('x-height') || 0);

                // 解析bounding
                var box = (fontFaceNode.getAttribute('bbox') || '').split(' ');
                ['xMin', 'yMin', 'xMax', 'yMax'].forEach(function(name, i) {
                    ttf.head[name] = +(box[i] || '');
                });

                ttf.post.underlineThickness = +(fontFaceNode.getAttribute('underline-thickness') || 0);
                ttf.post.underlinePosition = +(fontFaceNode.getAttribute('underline-position') || 0);

                // unicode range
                var unicodeRange = fontFaceNode.getAttribute('unicode-range');
                if (unicodeRange) {
                    unicodeRange.replace(/u\+([0-9A-Z]+)(\-[0-9A-Z]+)?/i, function ($0, a, b) {
                        OS2.usFirstCharIndex = Number('0x' + a); 
                        OS2.usLastCharIndex = b ? Number('0x' + b.slice(1)) : 0xFFFFFFFF;
                    });
                }
            }

            // 如果没有定义unitsPerEm，可以用viewBox代替
            if (!ttf.head.unitsPerEm && svgNode.getAttribute('viewBox')) {
                var bound = svgNode.getAttribute('viewBox').split(' ');
                if (bound.length == 4) {
                    ttf.head.unitsPerEm = +bound[2];
                }
            }

            // 解析glyf
            var d, unicode;
            if (missingNode) {

                var missing = {
                    name: '.notdef'
                };

                if (missingNode.getAttribute('horiz-adv-x')) {
                    missing.advanceWidth = +missingNode.getAttribute('horiz-adv-x');
                }

                if ((d = missingNode.getAttribute('d'))) {
                    missing.contours = svg2contours(d);
                }

                ttf.glyf.push(missing);
            }

            var glyfNodes = xmlDoc.getElementsByTagName('glyph');

            // path 对象也支持
            if (!glyfNodes.length) {
                glyfNodes = xmlDoc.getElementsByTagName('path');
            }

            if (glyfNodes.length) {

                // map unicode
                var unicodeMap = function(u) {
                    return u.charCodeAt(0);
                };

                for (var i = 0, l = glyfNodes.length; i < l ; i++) {

                    var node = glyfNodes[i];
                    var glyf = {
                        name: node.getAttribute('glyph-name') || node.getAttribute('name') || ''
                    };
                    
                    if (node.getAttribute('horiz-adv-x')) {
                        glyf.advanceWidth = +node.getAttribute('horiz-adv-x');
                    }

                    if ((unicode = node.getAttribute('unicode'))) {
                        glyf.unicode = unicode.split('').map(unicodeMap);
                    }

                    if ((d = node.getAttribute('d'))) {
                        glyf.contours = svg2contours(d);
                    }
                    ttf.glyf.push(glyf);
                }
            }

            if (!ttf.glyf.length) {
                error.raise(10201);
            }

            return ttf;
        }

        /**
         * svg格式转ttfObject格式
         * 
         * @param {string} svg svg格式
         * @return {Object} ttfObject
         */
        function svg2ttfObject(svg) {

            var xmlDoc = svg;
            if (typeof(svg) === 'string') {
                xmlDoc = loadXML(svg);
            }
            var ttf = parseXML(xmlDoc);
            return resolve(ttf);
        }

        return svg2ttfObject;
    }
);
