/**
 * @file ttf.js
 * @author mengke01
 * @date
 * @description
 *
 * ttf 信息读取函数
 */


define(
    function (require) {

        var lang = require('common/lang');
        var string = require('./util/string');
        var pathAdjust = require('graphics/pathAdjust');
        var pathCeil = require('graphics/pathCeil');
        var computeBoundingBox = require('graphics/computeBoundingBox');
        var glyfAdjust = require('./util/glyfAdjust');
        var config = require('./data/default');

        /**
         * 缩放到EM框
         *
         * @param {Array} glyfList glyf列表
         * @param {number} ascent 上升
         * @param {number} descent 下降
         * @param {number} ajdustToEmPadding  顶部和底部留白
         * @return {Array} glyfList
         */
        function adjustToEmBox(glyfList, ascent, descent, ajdustToEmPadding) {

            glyfList.forEach(function (g) {

                if (g.contours && g.contours.length) {
                    var rightSideBearing = g.advanceWidth - g.xMax;
                    var bound = computeBoundingBox.computePath.apply(null, g.contours);
                    var scale = (ascent - descent - ajdustToEmPadding) / bound.height;
                    var center = (ascent + descent) / 2;
                    var yOffset = center - (bound.y + bound.height / 2) * scale;

                    g.contours.forEach(function (contour) {
                        if (scale !== 1) {
                            pathAdjust(contour, scale, scale);
                        }

                        pathAdjust(contour, 1, 1, 0, yOffset);
                        pathCeil(contour);
                    });

                    var box = computeBoundingBox.computePathBox.apply(null, g.contours);

                    g.xMin = box.x;
                    g.xMax = box.x + box.width;
                    g.yMin = box.y;
                    g.yMax = box.y + box.height;

                    g.leftSideBearing = g.xMin;
                    g.advanceWidth = g.xMax + rightSideBearing;

                }

            });

            return glyfList;
        }

        /**
         * 调整字形位置
         *
         * @param {Array} glyfList 字形列表
         * @param {number=} leftSideBearing 左边距
         * @param {number=} rightSideBearing 右边距
         * @param {number=} verticalAlign 垂直对齐
         *
         * @return {Array} 改变的列表
         */
        function adjustPos(glyfList, leftSideBearing, rightSideBearing, verticalAlign) {

            var changed = false;

            // 左边轴
            if (null != leftSideBearing) {
                changed = true;

                glyfList.forEach(function (g) {
                    if (g.leftSideBearing !== leftSideBearing) {
                        glyfAdjust(g, 1, 1, leftSideBearing - g.leftSideBearing);
                    }
                });
            }

            // 右边轴
            if (null != rightSideBearing) {
                changed = true;

                glyfList.forEach(function (g) {
                    g.advanceWidth = g.xMax + rightSideBearing;
                });
            }

            // 基线高度
            if (null != verticalAlign) {
                changed = true;

                glyfList.forEach(function (g) {
                    if (g.contours && g.contours.length) {
                        var bound = computeBoundingBox.computePath.apply(this, g.contours);
                        var offset = verticalAlign - bound.y;
                        glyfAdjust(g, 1, 1, 0, offset);
                    }
                });
            }

            return changed ? glyfList : [];
        }



        /**
         * 合并两个ttfObject，此处仅合并简单字形
         *
         * @param {Object} ttf ttfObject
         * @param {Object} imported ttfObject
         * @param {Object} options 参数选项
         * @param {boolean} options.scale 是否自动缩放
         * @param {boolean} options.adjustGlyf 是否调整字形以适应边界
         *
         * @return {Object} 合并后的ttfObject
         */
        function merge(ttf, imported, options) {
            options = options || {};

            var list = imported.glyf.filter(function (g, index) {
                // 简单轮廓
                return g.contours && g.contours.length
                    // 非预定义字形
                    && g.name !== '.notdef' && g.name !== '.null' && g.name !== 'nonmarkingreturn';
            });

            // 调整字形以适应边界
            if (options.adjustGlyf) {
                var ascent = ttf.hhea.ascent;
                var descent = ttf.hhea.descent;
                var ajdustToEmPadding = 16;
                adjustPos(list, 16, 16);
                adjustToEmBox(list, ascent, descent, ajdustToEmPadding);

                list.forEach(function (g) {
                    ttf.glyf.push(g);
                });
            }
            // 根据unitsPerEm 进行缩放
            else if (options.scale) {

                var scale = 1;

                // 调整glyf对导入的轮廓进行缩放处理
                if (imported.head.unitsPerEm && imported.head.unitsPerEm !== ttf.head.unitsPerEm) {
                    scale = ttf.head.unitsPerEm / imported.head.unitsPerEm;
                }

                list.forEach(function (g) {
                    glyfAdjust(g, scale, scale);
                    ttf.glyf.push(g);
                });
            }

            return list;
        }


        /**
         * ttf读取函数
         *
         * @constructor
         * @param {Object} ttf ttf文件结构
         */
        function TTF(ttf) {
            this.ttf = ttf;
        }

        /**
         * 获取所有的字符信息
         *
         * @return {Object} 字符信息
         */
        TTF.prototype.codes = function () {
            return Object.keys(this.ttf.cmap);
        };

        /**
         * 根据编码获取字形索引
         *
         * @param {string} c 字符或者字符编码
         *
         * @return {?number} 返回glyf索引号
         */
        TTF.prototype.getGlyfIndexByCode = function (c) {
            var charCode = typeof c === 'number' ? c : c.charCodeAt(0);
            var glyfIndex = this.ttf.cmap[charCode] || -1;
            return glyfIndex;
        };

        /**
         * 根据索引获取字形
         *
         * @param {number} glyfIndex glyf的索引
         *
         * @return {?Object} 返回glyf对象
         */
        TTF.prototype.getGlyfByIndex = function (glyfIndex) {
            var glyfList = this.ttf.glyf;
            var glyf = glyfList[glyfIndex];
            return glyf;
        };

        /**
         * 根据编码获取字形
         *
         * @param {string} c 字符或者字符编码
         *
         * @return {?Object} 返回glyf对象
         */
        TTF.prototype.getGlyfByCode = function (c) {
            var glyfIndex = this.getGlyfIndexByCode(c);
            return this.getGlyfByIndex(glyfIndex);
        };

        /**
         * 设置ttf对象
         *
         * @param {Object} ttf ttf对象
         * @return {this}
         */
        TTF.prototype.set = function (ttf) {
            delete this.ttf;
            this.ttf = ttf;
            return this;
        };

        /**
         * 获取ttf对象
         *
         * @return {ttfObject} ttf ttf对象
         */
        TTF.prototype.get = function () {
            return this.ttf;
        };

        /**
         * 添加glyf
         *
         * @param {Object} glyf glyf对象
         *
         * @return {number} 添加的glyf
         */
        TTF.prototype.addGlyf = function (glyf) {
            return this.insertGlyf(glyf);
        };

        /**
         * 插入glyf
         *
         * @param {Object} glyf glyf对象
         * @param {Object} insertIndex 插入的索引
         * @return {number} 添加的glyf
         */
        TTF.prototype.insertGlyf = function (glyf, insertIndex) {
            if (insertIndex >= 0 && insertIndex < this.ttf.glyf.length) {
                this.ttf.glyf.splice(insertIndex, 0, glyf);
            }
            else {
                this.ttf.glyf.push(glyf);
            }

            return [glyf];
        };

        /**
         * 合并两个ttfObject，此处仅合并简单字形
         *
         * @param {Object} imported ttfObject
         * @param {Object} options 参数选项
         * @param {boolean} options.scale 是否自动缩放
         *
         * @return {Array} 添加的glyf
         */
        TTF.prototype.mergeGlyf = function (imported, options) {
            var list = merge(this.ttf, imported, options);
            return list;
        };


        /**
         * 删除指定字形
         *
         * @param {Array} indexList 索引列表
         * @return {Array} 删除的glyf
         */
        TTF.prototype.removeGlyf = function (indexList) {
            var glyf = this.ttf.glyf;
            var removed = [];
            for (var i = glyf.length - 1; i >= 0; i--) {
                if (indexList.indexOf(i) >= 0) {
                    removed.push(glyf[i]);
                    glyf.splice(i, 1);
                }
            }
            return removed;
        };


        /**
         * 设置unicode代码
         *
         * @param {string} unicode unicode代码 $E021, $22
         * @param {Array} indexList 索引列表
         * @return {Array} 改变的glyf
         */
        TTF.prototype.setUnicode = function (unicode, indexList) {
            var glyf = this.ttf.glyf;
            var list = [];
            if (indexList && indexList.length) {
                var first = indexList.indexOf(0);
                if (first >= 0) {
                    indexList.splice(first, 1);
                }
                list = indexList.map(function (item) {
                    return glyf[item];
                });
            }
            else {
                list = glyf.slice(1);
            }

            // 需要选出 unicode >32 的glyf
            if (list.length > 1) {
                var less32 = function (u) {
                    return u < 33;
                };
                list = list.filter(function (g) {
                    return !g.unicode || !g.unicode.some(less32);
                });
            }

            if (list.length) {
                unicode = Number('0x' + unicode.slice(1));
                list.forEach(function (g) {
                    // 空格有可能会放入 nonmarkingreturn 因此不做编码
                    if (unicode === 0xA0 || unicode === 0x3000) {
                        unicode++;
                    }

                    g.unicode = [unicode];
                    g.name = string.getUnicodeName(unicode);

                    unicode++;
                });
            }

            return list;
        };

        /**
         * 生成字形名称
         *
         * @param {Array} indexList 索引列表
         * @return {Array} 改变的glyf
         */
        TTF.prototype.genGlyfName = function (indexList) {
            var glyf = this.ttf.glyf;
            var list = [];
            if (indexList && indexList.length) {
                list = indexList.map(function (item) {
                    return glyf[item];
                });
            }
            else {
                list = glyf;
            }

            if (list.length) {
                var first = this.ttf.glyf[0];

                list.forEach(function (g) {
                    if (g === first) {
                        g.name = '.notdef';
                    }
                    else {
                        if (g.unicode && g.unicode.length) {
                            g.name = string.getUnicodeName(g.unicode[0]);
                        }
                        else {
                            g.name = '.notdef';
                        }
                    }
                });
            }

            return list;
        };

        /**
         * 清除字形名称
         *
         * @param {Array} indexList 索引列表
         * @return {Array} 改变的glyf
         */
        TTF.prototype.clearGlyfName = function (indexList) {
            var glyf = this.ttf.glyf;
            var list = [];
            if (indexList && indexList.length) {
                list = indexList.map(function (item) {
                    return glyf[item];
                });
            }
            else {
                list = glyf;
            }

            if (list.length) {

                list.forEach(function (g) {
                    delete g.name;
                });
            }

            return list;
        };

        /**
         * 添加并体替换指定的glyf
         *
         * @param {Array} glyfList 添加的列表
         * @param {Array} indexList 需要替换的索引列表
         * @return {Array} 改变的glyf
         */
        TTF.prototype.appendGlyf = function (glyfList, indexList) {
            var glyf = this.ttf.glyf;
            var result = glyfList.slice(0);

            if (indexList && indexList.length) {
                var l = Math.min(glyfList.length, indexList.length);
                for (var i = 0; i < l; i++) {
                    glyf[indexList[i]] = glyfList[i];
                }
                glyfList = glyfList.slice(l);
            }

            if (glyfList.length) {
                Array.prototype.splice.apply(glyf, [glyf.length, 0].concat(glyfList));
            }

            return result;
        };


        /**
         * 调整glyf位置
         *
         * @param {Array} indexList 索引列表
         * @param {Object} setting 选项
         * @return {Array} 改变的glyf
         */
        TTF.prototype.adjustGlyfPos = function (indexList, setting) {

            var glyfList = this.getGlyf(indexList);

            return adjustPos(
                glyfList,
                setting.leftSideBearing,
                setting.rightSideBearing,
                setting.verticalAlign
            );
        };


        /**
         * 调整glyf
         *
         * @param {Array} indexList 索引列表
         * @param {Object} setting 选项
         * @return {boolean}
         */
        TTF.prototype.adjustGlyf = function (indexList, setting) {

            var glyfList = this.getGlyf(indexList);
            var changed = false;

            if (setting.reverse || setting.mirror) {

                changed = true;

                glyfList.forEach(function (g) {
                    if (g.contours && g.contours.length) {
                        var offsetX = g.xMax + g.xMin;
                        var offsetY = g.yMax + g.yMin;
                        g.contours.forEach(function (contour) {
                            pathAdjust(contour, setting.mirror ? -1 : 1, setting.reverse ? -1 : 1);
                            pathAdjust(contour, 1, 1, setting.mirror ? offsetX : 0, setting.reverse ? offsetY : 0);
                        });
                    }
                });
            }


            if (setting.scale && setting.scale !== 1) {

                changed = true;

                var scale = setting.scale;
                glyfList.forEach(function (g) {
                    if (g.contours && g.contours.length) {
                        glyfAdjust(g, scale, scale);
                    }
                });
            }
            // 缩放到embox
            else if (setting.ajdustToEmBox) {

                changed = true;
                var ascent = this.ttf.hhea.ascent;
                var descent = this.ttf.hhea.descent;
                var ajdustToEmPadding = 2 * (setting.ajdustToEmPadding || 0);

                adjustToEmBox(glyfList, ascent, descent, ajdustToEmPadding);
            }

            return changed ? glyfList : [];
        };

        /**
         * 获取glyf列表
         *
         * @param {Array} indexList 索引列表
         * @return {Array} glyflist
         */
        TTF.prototype.getGlyf = function (indexList) {
            var glyf = this.ttf.glyf;
            if (indexList && indexList.length) {
                return indexList.map(function (item) {
                    return glyf[item];
                });
            }

            return glyf;
        };


        /**
         * 查找相关字形
         *
         * @param  {Object} condition 查询条件
         * @param  {Array|number} condition.unicode unicode编码列表或者单个unicode编码
         * @param  {string} condition.name glyf名字，例如`uniE001`, `uniE`
         *
         * @return {Array}  glyf字形列表
         */
        TTF.prototype.findGlyf = function (condition) {
            if (!condition) {
                return [];
            }


            var filters = [];

            // 按unicode数组查找
            if (condition.unicode) {
                var unicodeList = Array.isArray(condition.unicode) ? condition.unicode : [condition.unicode];
                var unicodeHash = {};
                unicodeList.forEach(function (unicode) {
                    if (typeof unicode === 'string') {
                        unicode = Number('0x' + unicode.slice(1));
                    }
                    unicodeHash[unicode] = true;
                });

                filters.push(function (glyf) {
                    if (!glyf.unicode || !glyf.unicode.length) {
                        return false;
                    }

                    for (var i = 0, l = glyf.unicode.length; i < l; i++) {
                        if (unicodeHash[glyf.unicode[i]]) {
                            return true;
                        }
                    }
                });
            }

            // 按名字查找
            if (condition.name) {
                var name = condition.name;
                filters.push(function (glyf) {
                    return glyf.name && glyf.name.indexOf(name) === 0;
                });
            }

            // 按筛选函数查找
            if (typeof condition.filter === 'function') {
                filters.push(condition.filter);
            }

            var indexList = [];
            this.ttf.glyf.forEach(function (glyf, index) {
                for (var filterIndex = 0, filter; (filter = filters[filterIndex++]);) {
                    if (true === filter(glyf)) {
                        indexList.push(index);
                        break;
                    }
                }
            });

            return indexList;
        };


        /**
         * 更新指定的glyf
         *
         * @param {Object} glyf glyfobject
         * @param {string} index 需要替换的索引列表
         * @return {Array} 改变的glyf
         */
        TTF.prototype.replaceGlyf = function (glyf, index) {
            if (index >= 0 && index < this.ttf.glyf.length) {
                this.ttf.glyf[index] = glyf;
                return [glyf];
            }
            return [];
        };

        /**
         * 设置glyf
         *
         * @param {Array} glyfList glyf列表
         * @return {Array} 设置的glyf列表
         */
        TTF.prototype.setGlyf = function (glyfList) {
            delete this.glyf;
            this.ttf.glyf = glyfList || [];
            return this.ttf.glyf;
        };


        /**
         * 设置名字
         * @param {string} name 名字字段
         * @return {Object} 名字对象
         */
        TTF.prototype.setName = function (name) {

            if (name) {
                this.ttf.name.fontFamily = this.ttf.name.fullName = name.fontFamily || config.name.fontFamily;
                this.ttf.name.fontSubFamily = name.fontSubFamily || config.name.fontSubFamily;
                this.ttf.name.uniqueSubFamily = name.uniqueSubFamily || '';
                this.ttf.name.postScriptName = name.postScriptName || '';
            }

            return this.ttf.name;
        };

        /**
         * 设置head信息
         *
         * @param {Object} head 头部信息
         * @return {Object} 头对象
         */
        TTF.prototype.setHead = function (head) {
            if (head) {
                // unitsperem
                if (head.unitsPerEm && head.unitsPerEm >= 64 && head.unitsPerEm <= 16384) {
                    this.ttf.head.unitsPerEm = head.unitsPerEm;
                }

                // lowestrecppem
                if (head.lowestRecPPEM && head.lowestRecPPEM >= 8 && head.lowestRecPPEM <= 16384) {
                    this.ttf.head.lowestRecPPEM = head.lowestRecPPEM;
                }
                // created
                if (head.created) {
                    this.ttf.head.created = head.created;
                }
            }
            return this.ttf.head;
        };

        /**
         * 设置hhea信息
         *
         * @param {Object} fields 字段值
         * @return {Object} 头对象
         */
        TTF.prototype.setHhea = function (fields) {
            lang.overwrite(this.ttf.hhea, fields, ['ascent', 'descent', 'lineGap']);
            return this.ttf.hhea;
        };

        /**
         * 设置OS2信息
         *
         * @param {Object} fields 字段值
         * @return {Object} 头对象
         */
        TTF.prototype.setOS2 = function (fields) {
            lang.overwrite(
                this.ttf['OS/2'], fields,
                [
                    'usWinAscent', 'usWinDescent',
                    'sTypoAscender', 'sTypoDescender', 'sTypoLineGap',
                    'sxHeight', 'bXHeight', 'usWeightClass', 'usWidthClass',
                    'yStrikeoutPosition', 'yStrikeoutSize',
                    'achVendID',
                    // panose
                    'bFamilyType', 'bSerifStyle', 'bWeight', 'bProportion', 'bContrast',
                    'bStrokeVariation', 'bArmStyle', 'bLetterform', 'bMidline', 'bXHeight'
                ]
            );
            return this.ttf['OS/2'];
        };

        /**
         * 设置post信息
         *
         * @param {Object} fields 字段值
         * @return {Object} 头对象
         */
        TTF.prototype.setPost = function (fields) {
            lang.overwrite(
                this.ttf.post, fields,
                [
                    'underlinePosition', 'underlineThickness'
                ]
            );
            return this.ttf.post;
        };


        /**
         * 计算度量信息
         *
         * @return {Object} 度量信息
         */
        TTF.prototype.calcMetrics = function () {
            var ascent = -16384;
            var descent = 16384;
            var uX = 0x78;
            var uH = 0x48;
            var sxHeight;
            var sCapHeight;
            this.ttf.glyf.forEach(function (g) {

                if (g.yMax > ascent) {
                    ascent = g.yMax;
                }

                if (g.yMin < descent) {
                    descent = g.yMin;
                }

                if (g.unicode) {
                    if (g.unicode.indexOf(uX) >= 0) {
                        sxHeight = g.yMax;
                    }
                    if (g.unicode.indexOf(uH) >= 0) {
                        sCapHeight = g.yMax;
                    }
                }
            });

            ascent = Math.round(ascent);
            descent = Math.round(descent);

            return {

                // 此处非必须自动设置
                ascent: ascent,
                descent: descent,
                sTypoAscender: ascent,
                sTypoDescender: descent,

                // 自动设置项目
                usWinAscent: ascent,
                usWinDescent: -descent,
                sxHeight: sxHeight || 0,
                sCapHeight: sCapHeight || 0
            };
        };

        return TTF;
    }
);
