/**
 * @file svg2ttfObject.js
 * @author mengke01
 * @date
 * @description
 * svg格式转ttfObject格式
 */


define(
    function (require) {
        var string = require('common/string');
        var path2contours = require('./svg/path2contours');
        var svgnode2contours = require('./svg/svgnode2contours');
        var contoursTransform = require('./svg/contoursTransform');
        var computeBoundingBox = require('graphics/computeBoundingBox');
        var glyfAdjust = require('./util/glyfAdjust');
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
                    var xmlDoc = domParser.parseFromString(xml, 'text/xml');
                    return xmlDoc;
                }
                catch (exp) {
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
         * 根据边界获取unitsPerEm
         *
         * @param {number} xMin x最小值
         * @param {number} xMax x最大值
         * @param {number} yMin y最小值
         * @param {number} yMax y最大值
         * @return {number}
         */
        function getUnitsPerEm(xMin, xMax, yMin, yMax) {
            var seed = Math.ceil(Math.min(yMax - yMin, xMax - xMin));

            if (!seed) {
                return 1024;
            }

            if (seed <= 128) {
                return seed;
            }

            // 获取合适的unitsPerEm
            var unitsPerEm = 128;
            while (unitsPerEm < 16384) {

                if (seed <= 1.2 * unitsPerEm) {
                    return unitsPerEm;
                }

                unitsPerEm = unitsPerEm << 1;
            }

            return 1024;
        }

        /**
         * 对ttfObject进行处理，去除小数
         *
         * @param {Object} ttf ttfObject
         * @return {Object} ttfObject
         */
        function resolve(ttf) {


            // 如果是svg格式字体，则去小数
            if (ttf.from === 'svgfont' && ttf.head.unitsPerEm > 128) {
                ttf.glyf.forEach(function (g) {
                    glyfAdjust(g);
                });
            }
            // 否则重新计算字形大小，缩放到1024的em
            else {
                var xMin = 16384;
                var xMax = -16384;
                var yMin = 16384;
                var yMax = -16384;

                ttf.glyf.forEach(function (g) {
                    if (g.contours) {
                        var bound = computeBoundingBox.computePathBox.apply(null, g.contours);
                        if (bound) {
                            xMin = Math.min(xMin, bound.x);
                            xMax = Math.max(xMax, bound.x + bound.width);
                            yMin = Math.min(yMin, bound.y);
                            yMax = Math.max(yMax, bound.y + bound.height);
                        }
                    }
                });

                var unitsPerEm = getUnitsPerEm(xMin, xMax, yMin, yMax);
                var scale = 1024 / unitsPerEm;

                ttf.glyf.forEach(function (g) {
                    glyfAdjust(g, scale, scale);
                });
                ttf.head.unitsPerEm = 1024;
            }

            return ttf;
        }

        /**
         * 解析字体信息相关节点
         *
         * @param {XMLDocument} xmlDoc XML文档对象
         * @param {Object} ttf ttf对象
         * @return {Object} ttf对象
         */
        function parseFont(xmlDoc, ttf) {

            var metaNode = xmlDoc.getElementsByTagName('metadata')[0];
            var fontNode = xmlDoc.getElementsByTagName('font')[0];
            var fontFaceNode = xmlDoc.getElementsByTagName('font-face')[0];

            if (metaNode && metaNode.textContent) {
                ttf.metadata = string.decodeHTML(metaNode.textContent.trim());
            }

            // 解析font，如果有font节点说明是svg格式字体文件
            if (fontNode) {
                ttf.id = fontNode.getAttribute('id') || '';
                ttf.hhea.advanceWidthMax = +(fontNode.getAttribute('horiz-adv-x') || 0);
                ttf.from = 'svgfont';
            }

            if (fontFaceNode) {
                var OS2 = ttf['OS/2'];
                ttf.name.fontFamily = fontFaceNode.getAttribute('font-family') || '';
                OS2.usWeightClass = +(fontFaceNode.getAttribute('font-weight') || 0);
                ttf.head.unitsPerEm = +(fontFaceNode.getAttribute('units-per-em') || 0);

                // 解析panose, eg: 2 0 6 3 0 0 0 0 0 0
                var panose = (fontFaceNode.getAttribute('panose-1') || '').split(' ');
                ['bFamilyType', 'bSerifStyle', 'bWeight', 'bProportion', 'bContrast',
                'bStrokeVariation', 'bArmStyle', 'bLetterform', 'bMidline', 'bXHeight'].forEach(function (name, i) {
                    OS2[name] = +(panose[i] || 0);
                });

                ttf.hhea.ascent = +(fontFaceNode.getAttribute('ascent') || 0);
                ttf.hhea.descent = +(fontFaceNode.getAttribute('descent') || 0);
                OS2.bXHeight = +(fontFaceNode.getAttribute('x-height') || 0);

                // 解析bounding
                var box = (fontFaceNode.getAttribute('bbox') || '').split(' ');
                ['xMin', 'yMin', 'xMax', 'yMax'].forEach(function (name, i) {
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

            return ttf;
        }

        /**
         * 解析字体信息相关节点
         *
         * @param {XMLDocument} xmlDoc XML文档对象
         * @param {Object} ttf ttf对象
         * @return {Object} ttf对象
         */
        function parseGlyf(xmlDoc, ttf) {

            var missingNode = xmlDoc.getElementsByTagName('missing-glyph')[0];

            // 解析glyf
            var d;
            var unicode;
            if (missingNode) {

                var missing = {
                    name: '.notdef'
                };

                if (missingNode.getAttribute('horiz-adv-x')) {
                    missing.advanceWidth = +missingNode.getAttribute('horiz-adv-x');
                }

                if ((d = missingNode.getAttribute('d'))) {
                    missing.contours = path2contours(d);
                }

                ttf.glyf.push(missing);
            }

            var glyfNodes = xmlDoc.getElementsByTagName('glyph');

            if (glyfNodes.length) {

                // map unicode
                var unicodeMap = function (u) {
                    return u.charCodeAt(0);
                };

                for (var i = 0, l = glyfNodes.length; i < l; i++) {

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
                        glyf.contours = path2contours(d);
                    }
                    ttf.glyf.push(glyf);
                }
            }

            return ttf;
        }

        function mirrorContours(contours) {
            // 这里为了使ai等工具里面的字形方便导入，对svg做了反向处理
            var bound = computeBoundingBox.computePathBox.apply(null, contours);
            contours = contoursTransform(contours, [
                {
                    name: 'scale',
                    params: [1, -1]
                },
                {
                    name: 'translate',
                    params: [1, bound.height]
                }
            ]);
            return contours;
        }

        /**
         * 解析字体信息相关节点
         *
         * @param {XMLDocument} xmlDoc XML文档对象
         * @param {Object} ttf ttf对象
         * @return {Object} ttf对象
         */
        function parsePath(xmlDoc, ttf) {

            // 单个path组成一个glfy字形
            var pathNodes = xmlDoc.getElementsByTagName('path');
            if (pathNodes.length) {
                for (var i = 0, length = pathNodes.length; i < length; i++) {
                    var node = pathNodes[i];
                    var glyf = {
                        name: node.getAttribute('name') || ''
                    };
                    var contours = svgnode2contours([node]);
                    glyf.contours = mirrorContours(contours);
                    ttf.glyf.push(glyf);
                }
            }

            // 其他svg指令组成一个glyf字形
            var contours = svgnode2contours(
                Array.prototype.slice.call(xmlDoc.getElementsByTagName('*')).filter(function (node) {
                    return node.tagName !== 'path';
                })
            );
            if (contours) {
                var glyf = {
                    name: ''
                };

                glyf.contours = mirrorContours(contours);
                ttf.glyf.push(glyf);
            }
        }


        /**
         * 解析xml文档
         *
         * @param {XMLDocument} xmlDoc XML文档对象
         * @return {Object} 解析后对象
         */
        function parseXML(xmlDoc) {

            var ttf = getEmptyObject();

            if (!xmlDoc.getElementsByTagName('svg').length) {
                error.raise(10106);
            }

            parseFont(xmlDoc, ttf);

            // 如果是svg字体格式，则解析glyf，否则解析path
            if (ttf.from === 'svgfont') {
                parseGlyf(xmlDoc, ttf);
            }
            else {
                parsePath(xmlDoc, ttf);
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
            if (typeof svg === 'string') {
                xmlDoc = loadXML(svg);
            }
            var ttf = parseXML(xmlDoc);
            return resolve(ttf);
        }

        return svg2ttfObject;
    }
);
