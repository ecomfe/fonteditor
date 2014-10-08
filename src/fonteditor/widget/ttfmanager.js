/**
 * @file ttf.js
 * @author mengke01
 * @date 
 * @description
 * ttf相关操作类
 */


define(
    function(require) {
        var lang = require('common/lang');
        var postName = require('ttf/enum/postName');
        var pathAdjust = require('graphics/pathAdjust');
        var pathCeil = require('graphics/pathCeil');
        var History = require('editor/util/History'); 
        var computeBoundingBox = require('graphics/computeBoundingBox');

        /**
         * 清除glyf编辑状态
         * 
         * @param {Array} glyfList glyf列表
         * @return {Array} glyf列表
         */
        function clearGlyfTag(glyfList) {
            glyfList.forEach(function(g) {
                delete g.modify;
            });
            return glyfList;
        }

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
                g.modify = 'new';
                ttf.glyf.push(g);
            });

            return list.length;
        }

        /**
         * 构造函数
         * 
         * @constructor
         * @param {ttfObject} ttf ttf对象
         */
        function Manager(ttf) {
            this.ttf = ttf;
            this.changed = false; // ttf是否被改过
            this.history = new History();
        }

        /**
         * 触发change
         * 
         * @param {boolean} pushHistory 是否存入history列表
         * @return {this}
         */
        Manager.prototype.fireChange = function(pushHistory) {
            pushHistory && this.history.add(lang.clone(this.ttf.glyf));
            this.changed = true;
            this.fire('change', {
                ttf: this.ttf
            });
            return this;
        };

        /**
         * 设置ttf
         * 
         * @param {ttfObject} ttf ttf对象
         * @return {this}
         */
        Manager.prototype.set = function(ttf) {

            if (this.ttf !== ttf) {
                this.ttf = ttf;
                this.history.reset();
                this.history.add(lang.clone(this.ttf.glyf));
                this.changed = false;
                this.fire('change', {
                    ttf: this.ttf
                });
            }

            return this;
        };

        /**
         * 获取ttf对象
         * 
         * @return {ttfObject} ttf ttf对象
         */
        Manager.prototype.get = function() {
            return this.ttf;
        };

        /**
         * 添加glyf
         * 
         * @param {Object} glyf glyf对象
         * 
         * @return {this}
         */
        Manager.prototype.addGlyf = function(glyf) {
            glyf.modify = 'new';
            this.ttf.glyf.push(glyf);
            this.fireChange(true);
            return this;
        };

        /**
         * 合并两个ttfObject，此处仅合并简单字形
         * 
         * @param {Object} imported ttfObject
         * @param {Object} options 参数选项
         * @param {boolean} options.scale 是否自动缩放
         * 
         * @return {this}
         */
        Manager.prototype.merge = function(imported, options) {
            var count = merge(this.ttf, imported, options);
            if (count) {
                this.fireChange(true);
            }
            return this;
        };


        /**
         * 删除指定字形
         * 
         * @param {Array} indexList 索引列表
         * @return {this}
         */
        Manager.prototype.removeGlyf = function(indexList) {
            var glyf = this.ttf.glyf, count = 0;
            for(var i = glyf.length - 1; i > 0; i--) {
                if (indexList.indexOf(i) >= 0) {
                    glyf.splice(i, 1);
                    count++;
                }
            }

            if (count) {
                this.fireChange(true);
            }

            return this;
        };


        /**
         * 设置unicode代码
         * 
         * @param {string} unicode unicode代码
         * @param {Array} indexList 索引列表
         * @return {this}
         */
        Manager.prototype.setUnicode = function(unicode, indexList) {
            var glyf = this.ttf.glyf, list;
            if (indexList && indexList.length) {
                list = indexList.map(function(item) {
                    return glyf[item];
                });
            }
            else {
                list = glyf;
            }

            list = list.filter(function(g) {
                return g.name != '.notdef' && g.name != '.null' && g.name != 'nonmarkingreturn';
            });

            if (list.length) {

                unicode = Number('0x' + unicode.slice(1));

                list.forEach(function(g) {
                    g.unicode = [unicode];
                    g.name = unicode - 29 < 258 ? postName[unicode - 29] : 'uni' + unicode.toString(16).toUpperCase();
                    unicode++;
                });

                this.fireChange(true);
            }

            return this;
        };

        /**
         * 添加并体替换指定的glyf
         * 
         * @param {Array} glyfList 添加的列表
         * @param {Array} indexList 需要替换的索引列表
         * @return {Array} glyflist
         */
        Manager.prototype.appendGlyf = function(glyfList, indexList) {
            var glyf = this.ttf.glyf;
            if (indexList && indexList.length) {
                var l = Math.min(glyfList.length, indexList.length);
                for (var i = 0; i < l; i++) {
                    glyf[indexList[i]] = glyfList[i];
                }
                glyfList = glyfList.slice(l);
            }
            if (glyfList.length) {
                glyfList.forEach(function(g) {
                    g.modify = 'new';
                });
                Array.prototype.splice.apply(glyf, [glyf.length, 0].concat(glyfList));
            }

            this.fireChange(true);
        };

        /**
         * 调整glyf
         * 
         * @param {Object} setting 选项
         * @param {Array} indexList 索引列表
         * @return {boolean}
         */
        Manager.prototype.adjustGlyf = function(setting, indexList) {
            
            var glyfList = indexList && indexList.length ?  this.getGlyf(indexList) : this.ttf.glyf;
            var changed = false;

            // 缩放到embox
            if (setting.ajdustToEmBox) {

                changed = true;

                var dencent = this.ttf.hhea.descent;
                var unitsPerEm = this.ttf.head.unitsPerEm;
                var ajdustToEmPadding = 2 * (setting.ajdustToEmPadding || 0);

                glyfList.forEach(function(g) {
                    if (g.contours && g.contours.length) {
                        var bound = computeBoundingBox.computePath.apply(this, g.contours);
                        var scale = (unitsPerEm - ajdustToEmPadding) / bound.height;
                        if (scale != 1) {
                            var yOffset = (unitsPerEm / 2 + dencent) -  (bound.y + bound.height / 2) * scale;
                            g.contours.forEach(function(contour) {
                                pathAdjust(contour, scale, scale);
                                pathAdjust(contour, 1, 1, 0, yOffset);
                                pathCeil(contour);
                            });
                        }
                    }
                });
            }

            // 左右边轴
            if (undefined !== setting.leftSideBearing || undefined !== setting.rightSideBearing) {

                changed = true;

                glyfList.forEach(function(g) {

                    // 设置左边轴
                    if (undefined !== setting.leftSideBearing && g.leftSideBearing != setting.leftSideBearing) {
                        var offset = setting.leftSideBearing - g.leftSideBearing;
                        g.xMax += offset;
                        g.advanceWidth += offset;
                        g.leftSideBearing = g.xMin = setting.leftSideBearing;
                        if (g.contours && g.contours.length) {
                            g.contours.forEach(function(contour) {
                                pathAdjust(contour, 1, 1, offset);
                            }); 
                        }
                    }

                    if (undefined !== setting.rightSideBearing) {
                        g.advanceWidth = g.xMax + setting.rightSideBearing;
                    }
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


            if (changed) {
                this.fireChange(true);
            }

            return this;
        };

        /**
         * 获取glyfList
         * 
         * @param {Array} indexList 索引列表
         * @return {Array} glyflist
         */
        Manager.prototype.getGlyf = function(indexList) {
            var glyf = this.ttf.glyf;
            return indexList.map(function(item) {
                return glyf[item];
            });
        };

        /**
         * 撤销
         * @return {this}
         */
        Manager.prototype.setName = function(name) {
            if (name) {
                name.fontFamily = name.fontFamily || 'fonteditor';
                name.fontSubFamily = name.fontSubFamily || 'Medium';
                name.fullName = name.fontFamily;
                this.ttf.name  = name;
            }
        };

        /**
         * 撤销
         * @return {this}
         */
        Manager.prototype.undo = function() {
            if (!this.history.atFirst()) {
                this.ttf.glyf = this.history.back();
                this.fireChange(false);
            }
        };


        /**
         * 重做
         * @return {this}
         */
        Manager.prototype.redo = function() {
            if (!this.history.atLast()) {
                this.ttf.glyf = this.history.forward();
                this.fireChange(false);
            }
        };

        /**
         * ttf是否被改变
         * @return {boolean}
         */
        Manager.prototype.isChanged = function() {
            return !!this.changed;
        };

        /**
         * 设置状态
         * @return {this}
         */
        Manager.prototype.setState = function(state) {
            if (state == 'new') {
                this.changed = false;
            }
        };

        Manager.prototype.clearGlyfTag = clearGlyfTag;

        /**
         * 注销
         */
        Manager.prototype.dispose = function() {
            this.un();
            delete this.ttf;
        };

        require('common/observable').mixin(Manager.prototype);

        return Manager;
    }
);
