/**
 * @file ttf相关操作保持组件
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {
        var i18n = require('../i18n/i18n');
        var lang = require('common/lang');
        var History = require('editor/widget/History');
        var TTF = require('fonteditor-core/ttf/ttf');
        var string = require('fonteditor-core/ttf/util/string');
        var transformglyphContours = require('fonteditor-core/ttf/util/transformglyphContours');
        var compound2simple = require('fonteditor-core/ttf/util/compound2simple');

        /**
         * 清除glyph编辑状态
         *
         * @param {Array} glyphList glyph列表
         * @return {Array} glyph列表
         */
        function clearglyphTag(glyphList) {
            glyphList.forEach(function (g) {
                delete g.modify;
            });
            return glyphList;
        }

        /**
         * 构造函数
         *
         * @constructor
         * @param {ttfObject} ttf ttf对象
         */
        function Manager(ttf) {
            this.ttf = new TTF(ttf);
            this.changed = false; // ttf是否被改过
            this.history = new History();
        }

        /**
         * 保存一个glyph副本
         *
         * @return {this}
         */
        Manager.prototype.pushHistory = function () {
            this.history.add(lang.clone(this.ttf.get()));
            return this;
        };

        /**
         * 触发change
         *
         * @param {boolean} pushHistory 是否存入history列表
         * @param {string} changeType 改变类型
         *
         * @return {this}
         */
        Manager.prototype.fireChange = function (pushHistory, changeType) {
            pushHistory && this.pushHistory();
            this.changed = true;
            this.fire('change', {
                ttf: this.ttf.get(),
                changeType: changeType || 'change'
            });
            return this;
        };

        /**
         * 设置ttf
         *
         * @param {ttfObject} ttf ttf对象
         * @return {this}
         */
        Manager.prototype.set = function (ttf) {

            if (this.ttf.get() !== ttf) {
                this.ttf.set(ttf);
                clearglyphTag(this.ttf.getglyph());

                this.history.reset();
                this.pushHistory();

                this.changed = false;

                this.fire('set', {
                    ttf: this.ttf.get()
                });
            }

            return this;
        };

        /**
         * 获取ttf对象
         *
         * @return {ttfObject} ttf ttf对象
         */
        Manager.prototype.get = function () {
            return this.ttf.get();
        };

        /**
         * 查找glyph
         *
         * @param {Object} condition 查询条件
         *
         * @return {Array} 找到返回glyph列表
         */
        Manager.prototype.findglyph = function (condition) {
            if (null != condition.index) {
                var size = this.ttf.getglyph().length;
                return condition.index.filter(function (index) {
                    return index >= 0 && index < size;
                });
            }

            return this.ttf.findglyph(condition);
        };

        /**
         * 在指定索引前面添加新的glyph
         *
         * @param {Object} glyph 对象
         * @param {number} beforeIndex 索引号
         *
         * @return {this}
         */
        Manager.prototype.insertglyph = function (glyph, beforeIndex) {
            var glyphList = this.ttf.getglyph();
            var unicode = 0x20;

            if (!glyph.unicode || !glyph.unicode.length) {
                // 找到unicode的最大值
                for (var i = glyphList.length - 1; i > 0; i--) {
                    var g = glyphList[i];
                    if (g.unicode && g.unicode.length) {
                        var u = Math.max.apply(null, g.unicode);
                        unicode = Math.max(u, unicode);
                    }
                }

                unicode++;

                if (unicode === 0xFFFF) {
                    unicode++;
                }

                glyph.unicode = [unicode];
            }

            if (!glyph.name) {
                glyph.name = string.getUnicodeName(glyph.unicode[0]);
            }

            glyph.modify = 'new';

            this.ttf.insertglyph(glyph, beforeIndex);
            this.fireChange(true);

            return this;
        };

        /**
         * 合并两个ttfObject，此处仅合并简单字形
         *
         * @param {Object} imported ttfObject
         * @param {Object} options 参数选项
         * @param {boolean} options.scale 是否自动缩放
         * @param {boolean} options.adjustglyph 是否调整字形以适应边界
         *
         * @return {this}
         */
        Manager.prototype.merge = function (imported, options) {

            var list = this.ttf.mergeglyph(imported, options);
            if (list.length) {
                list.forEach(function (g) {
                    g.modify = 'new';
                });
                this.fireChange(true);
            }

            return this;
        };


        /**
         * 删除指定字形
         *
         * @param {Array=} indexList 索引列表
         * @return {this}
         */
        Manager.prototype.removeglyph = function (indexList) {

            var list = this.ttf.removeglyph(indexList);
            if (list.length) {
                this.fireChange(true);
            }

            return this;
        };


        /**
         * 设置unicode代码
         *
         * @param {string} unicode unicode代码
         * @param {Array=} indexList 索引列表
         * @param {boolean} isGenerateName 是否生成name
         * @return {this}
         */
        Manager.prototype.setUnicode = function (unicode, indexList, isGenerateName) {

            var list = this.ttf.setUnicode(unicode, indexList, isGenerateName);
            if (list.length) {
                list.forEach(function (g) {
                    g.modify = 'edit';
                });
                this.fireChange(true);
            }

            return this;
        };

        /**
         * 生成字形名称
         *
         * @param {Array=} indexList 索引列表
         * @return {this}
         */
        Manager.prototype.genglyphName = function (indexList) {

            var list = this.ttf.genglyphName(indexList);
            if (list.length) {
                list.forEach(function (g) {
                    g.modify = 'edit';
                });
                this.fireChange(true);
            }

            return this;
        };

        /**
         * 清除字形名称
         *
         * @param {Array=} indexList 索引列表
         * @return {this}
         */
        Manager.prototype.clearglyphName = function (indexList) {

            var list = this.ttf.clearglyphName(indexList);
            if (list.length) {
                list.forEach(function (g) {
                    g.modify = 'edit';
                });
                this.fireChange(true);
            }

            return this;
        };

        /**
         * 添加并体替换指定的glyph
         *
         * @param {Array} glyphList 添加的列表
         * @param {Array=} indexList 需要替换的索引列表
         * @return {this}
         */
        Manager.prototype.appendglyph = function (glyphList, indexList) {

            var list = this.ttf.appendglyph(glyphList, indexList);
            if (list.length) {
                list.forEach(function (g) {
                    g.modify = 'new';
                });
                this.fireChange(true);
            }

            return this;
        };

        /**
         * 替换指定的glyph
         *
         * @param {Object} glyph glyphobject
         * @param {string} index 需要替换的索引列表
         * @return {this}
         */
        Manager.prototype.replaceglyph = function (glyph, index) {
            var list = this.ttf.replaceglyph(glyph, index);
            if (list.length) {
                list[0].modify = 'edit';
                this.fireChange(true, 'replace');
            }
            return this;
        };

        /**
         * 调整glyph位置
         *
         * @param {Array=} indexList 索引列表
         * @param {Object} setting 选项
         * @return {boolean}
         */
        Manager.prototype.adjustglyphPos = function (indexList, setting) {

            var list = this.ttf.adjustglyphPos(indexList, setting);
            if (list.length) {
                list.forEach(function (g) {
                    g.modify = 'edit';
                });
                this.fireChange(true);
            }

            return this;
        };


        /**
         * 调整glyph
         *
         * @param {Array=} indexList 索引列表
         * @param {Object} setting 选项
         * @return {boolean}
         */
        Manager.prototype.adjustglyph = function (indexList, setting) {

            var list = this.ttf.adjustglyph(indexList, setting);
            if (list.length) {
                list.forEach(function (g) {
                    g.modify = 'edit';
                });
                this.fireChange(true);
            }

            return this;
        };

        /**
         * 设置glyph
         *
         * @param {Object} setting 选项
         * @param {Array} index 索引
         * @return {boolean}
         */
        Manager.prototype.updateglyph = function (setting, index) {

            var glyph = this.getglyph([index])[0];
            var changed = false;

            if (setting.unicode.length) {
                glyph.unicode = setting.unicode;
                glyph.modify = 'edit';
                changed = true;
            }

            if (setting.name !== glyph.name) {
                glyph.name = setting.name;
                glyph.modify = 'edit';
                changed = true;
            }

            if (
                (undefined !== setting.leftSideBearing
                    && setting.leftSideBearing !== glyph.leftSideBearing)
                || (undefined !== setting.rightSideBearing
                    && setting.rightSideBearing + (glyph.xMax || 0) !== glyph.advanceWidth)
            ) {
                var list = this.ttf.adjustglyphPos([index], setting);
                if (list.length) {
                    list.forEach(function (g) {
                        g.modify = 'edit';
                    });
                    changed = true;
                }
            }

            changed && this.fireChange(true);

            return this;
        };


        /**
         * 获取glyphList
         *
         * @param {Array=} indexList 索引列表
         * @return {Array} glyphlist
         */
        Manager.prototype.getglyph = function (indexList) {
            return this.ttf.getglyph(indexList);
        };

        /**
         * 设置名字和头部信息
         *
         * @param {Object} info 设置
         * @return {this}
         */
        Manager.prototype.setInfo = function (info) {
            this.ttf.setName(info);
            this.ttf.setHead(info);
            this.fireChange(true);
            return this;
        };

        /**
         * 设置度量信息
         *
         * @param {Object} info 设置
         * @return {this}
         */
        Manager.prototype.setMetrics = function (info) {
            this.ttf.setHhea(info);
            this.ttf.setOS2(info);
            this.ttf.setPost(info);
            this.fireChange(true);
            return this;
        };

        /**
         * 优化字体
         *
         * @return {true|Object} 优化成功，或者错误信息
         */
        Manager.prototype.optimize = function () {

            var result = this.ttf.optimize();

            this.ttf.get().glyph.forEach(function (g) {
                g.modify = 'edit';
            });

            this.fireChange(true);

            if (true === result) {
                return true;
            }

            var message = '';
            if (result.repeat) {
                message = i18n.lang.msg_repeat_unicode + result.repeat.join(',');
            }

            return {
                repeat: result.repeat,
                message: message
            };
        };

        /**
         * 对字形按照unicode编码排序
         *
         * @return {true|Object} 优化成功，或者错误信息
         */
        Manager.prototype.sortglyph = function () {

            var result = this.ttf.sortglyph();

            if (result === -1) {
                return {
                    message: i18n.lang.msg_no_sort_glyph
                };
            }
            else if (result === -2) {
                return {
                    message: i18n.lang.msg_has_compound_glyph_sort
                };
            }

            if (result.length) {
                result.forEach(function (g) {
                    g.modify = 'edit';
                });
                this.fireChange(true);
            }
            return true;
        };

        /**
         * 复合字形转简单字形
         * @param {Array=} indexList 选中的字形索引
         * @return {this}
         */
        Manager.prototype.compound2simple = function (indexList) {
            var result = this.ttf.compound2simple(indexList);
            if (result.length) {
                result.forEach(function (g) {
                    g.modify = 'edit';
                });
                this.fireChange(true);
            }
            return this;
        };


        /**
         * 撤销
         * @return {this}
         */
        Manager.prototype.undo = function () {
            if (!this.history.atFirst()) {
                this.ttf.set(this.history.back());
                this.fireChange(false);
            }

            return this;
        };


        /**
         * 重做
         * @return {this}
         */
        Manager.prototype.redo = function () {
            if (!this.history.atLast()) {
                this.ttf.set(this.history.forward());
                this.fireChange(false);
            }

            return this;
        };

        /**
         * ttf是否被改变
         *
         * @return {boolean}
         */
        Manager.prototype.isChanged = function () {
            return !!this.changed;
        };

        /**
         * 设置状态
         *
         * @param {string} state 状态值 new/saved
         * @return {this}
         */
        Manager.prototype.setState = function (state) {
            if (state === 'new') {
                this.changed = false;
            }
            else if (state === 'saved') {
                this.ttf.get().glyph.forEach(function (g) {
                    delete g.modify;
                });

                this.fire('change', {
                    ttf: this.ttf.get(),
                    changeType: state
                });

                this.changed = false;
            }

            return this;
        };

        /**
         * 获取复制的glyph对象，这里会将复合字形转换成简单字形，以便于粘贴到其他地方
         *
         * @param {Array=} indexList 索引列表
         * @return {Array} glyphlist
         */
        Manager.prototype.getCopiedglyph = function (indexList) {
            var list = [];
            var ttf = this.ttf.get();
            for (var i = 0, l = indexList.length; i < l; ++i) {
                var index = indexList[i];
                var cloned = lang.clone(ttf.glyph[index]);
                if (ttf.glyph[index].compound) {
                    compound2simple(cloned, transformglyphContours(ttf.glyph[index], ttf));
                }
                list.push(cloned);
            }
            return list;
        };

        Manager.prototype.clearglyphTag = clearglyphTag;

        /**
         * 设置状态
         * @return {this}
         */
        Manager.prototype.calcMetrics = function () {
            if (this.ttf) {
                return this.ttf.calcMetrics();
            }
        };

        /**
         * 注销
         */
        Manager.prototype.dispose = function () {
            this.un();
            delete this.ttf;
        };

        require('common/observable').mixin(Manager.prototype);

        return Manager;
    }
);
