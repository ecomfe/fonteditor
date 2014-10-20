/**
 * @file ttf.js
 * @author mengke01
 * @date 
 * @description
 * 
 * ttf 信息读取函数
 */


define(
    function(require) {

        var lang = require('common/lang');
        var postName = require('./enum/postName');
        var pathAdjust = require('graphics/pathAdjust');
        var pathCeil = require('graphics/pathCeil');
        var computeBoundingBox = require('graphics/computeBoundingBox');


        /**
         * 合并两个ttfObject，此处仅合并简单字形
         * 
         * @param {Object} ttf ttfObject
         * @param {Object} imported ttfObject
         * @param {Object} options 参数选项
         * @param {boolean} options.scale 是否自动缩放
         * 
         * @return {Object} 合并后的ttfObject
         */
        function merge(ttf, imported, options) {
            options = options || {};

            // 调整glyf以适应打开的文件
            var scale = 1;
            // 对导入的轮廓进行缩放处理
            if (options.scale && imported.head.unitsPerEm && imported.head.unitsPerEm != ttf.head.unitsPerEm) {
                scale = ttf.head.unitsPerEm / imported.head.unitsPerEm;
            }

            var list = imported.glyf.filter(function(g, index) {
                return g.contours && g.contours.length //简单轮廓
                    && g.name != '.notdef' && g.name != '.null' && g.name != 'nonmarkingreturn'; // 非预定义字形
                    
            });

            list.forEach(function(g) {
                if (scale !== 1) {
                    g.contours.forEach(function(contour) {
                        pathAdjust(contour, scale, scale);
                        pathCeil(contour);
                    });
                }

                // 重新计算xmin，xmax，ymin，ymax
                if (
                    undefined === g.xMin 
                    || undefined === g.yMax 
                    || undefined === g.leftSideBearing 
                    || undefined === g.advanceWidth
                ) {
                    var bound = computeBoundingBox.computePathBox.apply(this, g.contours);
                    
                    g.xMin = bound.x;
                    g.xMax = bound.x + bound.width;
                    g.yMin = bound.y;
                    g.yMax = bound.y + bound.height;

                    g.leftSideBearing = g.xMin;

                    // 如果设置了advanceWidth就是用默认的，否则为10
                    g.advanceWidth = g.xMax + 10;
                }
                else {
                    g.xMin = Math.round(g.xMin * scale);
                    g.xMax = Math.round(g.xMax * scale);
                    g.yMin = Math.round(g.yMin * scale);
                    g.yMax = Math.round(g.yMax * scale);
                    g.leftSideBearing = Math.round(g.leftSideBearing * scale);
                    g.advanceWidth = Math.round(g.advanceWidth * scale);
                }

                //console.log(g.xMin, g.xMax, g.yMin, g.yMax, g.leftSideBearing, g.advanceWidth);

                ttf.glyf.push(g);
            });

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
        TTF.prototype.codes = function() {
            return Object.keys(this.ttf.cmap);
        };

        /**
         * 获取字符的glyf信息
         * @param {string} c 字符或者字符编码
         * 
         * @return {?number} 返回glyf索引号
         */
        TTF.prototype.getCodeGlyfIndex = function(c) {
            var charCode = typeof c == 'number' ? c : c.charCodeAt(0);
            var glyfIndex = this.ttf.cmap[charCode] || 0;
            return glyfIndex;
        };

        /**
         * 获取字符的glyf信息
         * @param {string} c 字符或者字符编码
         * 
         * @return {?Object} 返回glyf对象
         */
        TTF.prototype.getCodeGlyf = function(c) {
            var glyfIndex = this.getCodeGlyfIndex(c);
            return this.getIndexGlyf(glyfIndex);
        };

        /**
         * 获取字符的glyf信息
         * @param {number} glyfIndex glyf的索引
         * 
         * @return {?Object} 返回glyf对象
         */
        TTF.prototype.getIndexGlyf = function(glyfIndex) {
            var glyfList = this.ttf.glyf;
            var glyf = glyfList[glyfIndex];
            return glyf;
        };

        /**
         * 设置ttf对象
         * 
         * @return {this}
         */
        TTF.prototype.set = function(ttf) {
            delete this.ttf;
            this.ttf = ttf;
            return this;
        };

        /**
         * 获取ttf对象
         * 
         * @return {ttfObject} ttf ttf对象
         */
        TTF.prototype.get = function() {
            return this.ttf;
        };

        /**
         * 添加glyf
         * 
         * @param {Object} glyf glyf对象
         * 
         * @return {Number} 添加的glyf
         */
        TTF.prototype.addGlyf = function(glyf) {
            return this.insertGlyf(glyf);
        };

        /**
         * 插入glyf
         * 
         * @param {Object} glyf glyf对象
         * @param {Object} insertIndex 插入的索引
         * @return {Number} 添加的glyf
         */
        TTF.prototype.insertGlyf = function(glyf, insertIndex) {
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
        TTF.prototype.mergeGlyf = function(imported, options) {
            var list = merge(this.ttf, imported, options);
            return list;
        };


        /**
         * 删除指定字形
         * 
         * @param {Array} indexList 索引列表
         * @return {Array} 删除的glyf
         */
        TTF.prototype.removeGlyf = function(indexList) {
            var glyf = this.ttf.glyf;
            var removed = [];
            for(var i = glyf.length - 1; i >= 0; i--) {
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
        TTF.prototype.setUnicode = function(unicode, indexList) {
            var glyf = this.ttf.glyf, list;
            if (indexList && indexList.length) {
                list = indexList.map(function(item) {
                    return glyf[item];
                });
            }
            else {
                list = glyf;
            }

            if (list.length > 1) {
                list = list.filter(function(g) {
                    return g.name != '.notdef' && g.name != '.null' && g.name != 'nonmarkingreturn';
                });
            }

            if (list.length) {
                unicode = Number('0x' + unicode.slice(1));
                list.forEach(function(g) {
                    g.unicode = [unicode];

                    if (unicode === 0 || unicode === 1 || unicode === 2) {
                        g.name = postName[unicode];
                    }
                    else {
                        g.name = unicode - 29 < 258 ? postName[unicode - 29] : 'uni' + unicode.toString(16).toUpperCase();
                    }
                    
                    unicode++;
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
        TTF.prototype.appendGlyf = function(glyfList, indexList) {
            var glyf = this.ttf.glyf, result = glyfList.slice(0);

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
         * @param {Object} setting 选项
         * @param {Array} indexList 索引列表
         * @return {Array} 改变的glyf
         */
        TTF.prototype.adjustGlyfPos = function(setting, indexList) {
            
            var glyfList = this.getGlyf(indexList);
            var changed = false;

            // 左右边轴
            if (undefined !== setting.leftSideBearing || undefined !== setting.rightSideBearing) {

                changed = true;

                glyfList.forEach(function(g) {

                    // 设置左边轴
                    if (undefined !== setting.leftSideBearing && g.leftSideBearing != setting.leftSideBearing) {

                        var offset = setting.leftSideBearing - g.leftSideBearing;
                        g.leftSideBearing = g.xMin = setting.leftSideBearing;
                        g.xMax += offset;
                        
                        if (undefined !== setting.rightSideBearing) {
                            g.advanceWidth = g.xMax + offset;
                        }
                        else {
                            g.advanceWidth += offset;
                        }

                        if (g.contours && g.contours.length) {
                            g.contours.forEach(function(contour) {
                                pathAdjust(contour, 1, 1, offset);
                            }); 
                        }
                    }
                    else if (undefined !== setting.rightSideBearing) {
                        g.advanceWidth = g.xMax + setting.rightSideBearing;
                    }

                    //console.log(g.xMin, g.xMax, g.yMin, g.yMax, g.leftSideBearing, g.advanceWidth);
                });
            }

            // 基线高度
            if (undefined !== setting.verticalAlign) {

                changed = true;

                verticalAlign = setting.verticalAlign || 0;
                glyfList.forEach(function(g) {
                    if (g.contours && g.contours.length) {
                        var bound = computeBoundingBox.computePath.apply(this, g.contours);
                        var offset = verticalAlign - bound.y;
                        
                        g.yMin += offset;
                        g.yMax += offset;

                        if (g.contours && g.contours.length) {
                            g.contours.forEach(function(contour) {
                                pathAdjust(contour, 1, 1, 0, offset);
                            });
                        }
                    }
                });

            }

            return changed ? glyfList : [];
        };


        /**
         * 调整glyf
         * 
         * @param {Object} setting 选项
         * @param {Array} indexList 索引列表
         * @return {boolean}
         */
        TTF.prototype.adjustGlyf = function(setting, indexList) {
            
            var glyfList = this.getGlyf(indexList);
            var changed = false;

            if (setting.reverse || setting.mirror) {

                changed = true;

                glyfList.forEach(function(g) {
                    if (g.contours && g.contours.length) {
                        var offsetX = g.xMax + g.xMin;
                        var offsetY = g.yMax + g.yMin;
                        g.contours.forEach(function(contour) {
                            pathAdjust(contour, setting.reverse ? -1 : 1, setting.mirror ? -1 : 1);
                            pathAdjust(contour, 1, 1, setting.reverse ? offsetX : 0, setting.mirror ? offsetY : 0);
                        });
                    }
                });
            }

           
            if (setting.scale && setting.scale != 1) {

                changed = true;

                var scale = setting.scale;
                glyfList.forEach(function(g) {
                    if (g.contours && g.contours.length) {

                        var rightSideBearing = g.advanceWidth - g.xMax;

                        g.contours.forEach(function(contour) {
                            pathAdjust(contour, scale, scale);
                            pathCeil(contour);
                        });

                        g.xMin = Math.round(g.xMin * scale);
                        g.xMax = Math.round(g.xMax * scale);
                        g.yMin = Math.round(g.yMin * scale);
                        g.yMax = Math.round(g.yMax * scale);

                        g.leftSideBearing = g.xMin;
                        g.advanceWidth = g.xMax + rightSideBearing;
                    }
                    //console.log(g.xMin, g.xMax, g.yMin, g.yMax, g.leftSideBearing, g.advanceWidth);
                });
            }
            // 缩放到embox
            else if (setting.ajdustToEmBox) {

                changed = true;

                var dencent = this.ttf.hhea.descent;
                var unitsPerEm = this.ttf.head.unitsPerEm;
                var ajdustToEmPadding = 2 * (setting.ajdustToEmPadding || 0);

                glyfList.forEach(function(g) {
                    if (g.contours && g.contours.length) {

                        var rightSideBearing = g.advanceWidth - g.xMax;
                        var bound = computeBoundingBox.computePath.apply(null, g.contours);
                        var scale = (unitsPerEm - ajdustToEmPadding) / bound.height;

                        if (scale != 1) {
                            var yOffset = (unitsPerEm / 2 + dencent) -  (bound.y + bound.height / 2) * scale;
                            g.contours.forEach(function(contour) {
                                pathAdjust(contour, scale, scale);
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
                    }

                    //console.log(g.xMin, g.xMax, g.yMin, g.yMax, g.leftSideBearing, g.advanceWidth);
                });
            }

            return changed ? glyfList : [];
        };

        /**
         * 获取glyf列表
         * 
         * @param {Array} indexList 索引列表
         * @return {Array} glyflist
         */
        TTF.prototype.getGlyf = function(indexList) {
            var glyf = this.ttf.glyf;
            if (indexList && indexList.length) {
                return indexList.map(function(item) {
                    return glyf[item];
                }); 
            }
            else {
                return glyf;
            }
        };

        /**
         * 更新指定的glyf
         * 
         * @param {Object} glyf glyfobject
         * @param {string} index 需要替换的索引列表
         * @return {Array} 改变的glyf
         */
        TTF.prototype.replaceGlyf = function(glyf, index) {
            if (index >=0 && index < this.ttf.glyf.length) {
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
        TTF.prototype.setGlyf = function(glyfList) {
            delete this.glyf;
            this.ttf.glyf = glyfList || [];
            return this.ttf.glyf;
        };


        /**
         * 设置名字
         * 
         * @return {Object} 名字对象
         */
        TTF.prototype.setName = function(name) {
            if (name) {
                name.fontFamily = name.fontFamily || 'fonteditor';
                name.fontSubFamily = name.fontSubFamily || 'Medium';
                name.fullName = name.fontFamily;
                this.ttf.name  = name;
            }
            return this.ttf.name;
        };

        /**
         * 设置head信息
         * 
         * @param {Object} head 头部信息
         * @return {Object} 头对象
         */
        TTF.prototype.setHead = function(head) {
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
        TTF.prototype.setHhea = function(fields) {
            lang.overwrite(this.ttf.hhea, fields, ['ascent', 'descent', 'lineGap']);
            return this.ttf.hhea;
        };

        /**
         * 设置OS2信息
         * 
         * @param {Object} fields 字段值
         * @return {Object} 头对象
         */
        TTF.prototype.setOS2 = function(fields) {
            lang.overwrite(
                this.ttf['OS/2'], fields, 
                [
                    'usWinAscent', 'usWinDescent', 
                    'sTypoAscender', 'sTypoDescender', 'sTypoLineGap',
                    'sxHeight', 'bXHeight',
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
        TTF.prototype.setPost = function(fields) {
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
        TTF.prototype.calcMetrics = function() {
            var usWinAscent = -16384, usWinDescent = 16384;
            var uX = 0x78, uH = 0x48, sxHeight, sCapHeight;
            this.ttf.glyf.forEach(function(g) {

                if (g.yMax > usWinAscent) {
                    usWinAscent = g.yMax;
                }

                if (g.yMin < usWinDescent) {
                    usWinDescent = g.yMin;
                }

                if (g.unicode) {
                    if(g.unicode.indexOf(uX) >= 0) {
                        sxHeight = g.yMax;
                    }
                    if(g.unicode.indexOf(uH) >= 0) {
                        sCapHeight = g.yMax;
                    }
                }
            });

            usWinAscent = Math.round(usWinAscent);
            usWinDescent = Math.round(usWinDescent);

            return {

                // 此处非必须自动设置
                ascent: usWinAscent,
                descent: usWinDescent,
                sTypoAscender: usWinAscent,
                sTypoDescender: usWinDescent,
                
                // 自动设置项目
                usWinAscent: usWinAscent,
                usWinDescent: -usWinDescent,
                sxHeight: sxHeight || 0,
                sCapHeight: sCapHeight || 0
            };
        };

        return TTF;
    }
);
