/**
 * @file ttf相关操作保持组件
 * @author mengke01(kekee000@gmail.com)
 */

import i18n from '../i18n/i18n';
import lang from 'common/lang';
import History from 'editor/widget/History';
import TTF from 'fonteditor-core/ttf/ttf';
import string from 'fonteditor-core/ttf/util/string';
import transformGlyfContours from 'fonteditor-core/ttf/util/transformGlyfContours';
import compound2simple from 'fonteditor-core/ttf/util/compound2simple';
import observable from 'common/observable';


export default class Manager {

    /**
     * 构造函数
     *
     * @constructor
     * @param {ttfObject} ttf ttf对象
     */
    constructor(ttf) {
        this.ttf = new TTF(ttf);
        this.changed = false; // ttf是否被改过
        this.history = new History();
    }

    /**
     * 保存一个glyf副本
     *
     * @return {this}
     */
    pushHistory() {
        this.history.add(lang.clone(this.ttf.get()));
        return this;
    }

    /**
     * 触发change
     *
     * @param {boolean} pushHistory 是否存入history列表
     * @param {string} changeType 改变类型
     *
     * @return {this}
     */
    fireChange(pushHistory, changeType) {
        pushHistory && this.pushHistory();
        this.changed = true;
        this.fire('change', {
            ttf: this.ttf.get(),
            changeType: changeType || 'change'
        });
        return this;
    }

    /**
     * 设置ttf
     *
     * @param {ttfObject} ttf ttf对象
     * @return {this}
     */
    set(ttf) {

        if (this.ttf.get() !== ttf) {
            this.ttf.set(ttf);
            this.clearGlyfTag(this.ttf.getGlyf());

            this.history.reset();
            this.pushHistory();

            this.changed = false;

            this.fire('set', {
                ttf: this.ttf.get()
            });
        }

        return this;
    }

    /**
     * 获取ttf对象
     *
     * @return {ttfObject} ttf ttf对象
     */
    get() {
        return this.ttf.get();
    }

    /**
     * 查找glyf
     *
     * @param {Object} condition 查询条件
     *
     * @return {Array} 找到返回glyf列表
     */
    findGlyf(condition) {
        if (null != condition.index) {
            var size = this.ttf.getGlyf().length;
            return condition.index.filter(function (index) {
                return index >= 0 && index < size;
            });
        }

        return this.ttf.findGlyf(condition);
    }

    /**
     * 在指定索引前面添加新的glyf
     *
     * @param {Object} glyf 对象
     * @param {number} beforeIndex 索引号
     *
     * @return {this}
     */
    insertGlyf(glyf, beforeIndex) {
        var glyfList = this.ttf.getGlyf();
        var unicode = 0x20;

        if (!glyf.unicode || !glyf.unicode.length) {
            // 找到unicode的最大值
            for (var i = glyfList.length - 1; i > 0; i--) {
                var g = glyfList[i];
                if (g.unicode && g.unicode.length) {
                    var u = Math.max.apply(null, g.unicode);
                    unicode = Math.max(u, unicode);
                }
            }

            unicode++;

            if (unicode === 0xFFFF) {
                unicode++;
            }

            glyf.unicode = [unicode];
        }

        if (!glyf.name) {
            glyf.name = string.getUnicodeName(glyf.unicode[0]);
        }

        glyf.modify = 'new';

        this.ttf.insertGlyf(glyf, beforeIndex);
        this.fireChange(true);

        return this;
    }

    /**
     * 合并两个ttfObject，此处仅合并简单字形
     *
     * @param {Object} imported ttfObject
     * @param {Object} options 参数选项
     * @param {boolean} options.scale 是否自动缩放
     * @param {boolean} options.adjustGlyf 是否调整字形以适应边界
     *
     * @return {this}
     */
    merge(imported, options) {

        var list = this.ttf.mergeGlyf(imported, options);
        if (list.length) {
            list.forEach(function (g) {
                g.modify = 'new';
            });
            this.fireChange(true);
        }

        return this;
    }


    /**
     * 删除指定字形
     *
     * @param {Array=} indexList 索引列表
     * @return {this}
     */
    removeGlyf(indexList) {

        var list = this.ttf.removeGlyf(indexList);
        if (list.length) {
            this.fireChange(true);
        }

        return this;
    }


    /**
     * 设置unicode代码
     *
     * @param {string} unicode unicode代码
     * @param {Array=} indexList 索引列表
     * @param {boolean} isGenerateName 是否生成name
     * @return {this}
     */
    setUnicode(unicode, indexList, isGenerateName) {

        var list = this.ttf.setUnicode(unicode, indexList, isGenerateName);
        if (list.length) {
            list.forEach(function (g) {
                g.modify = 'edit';
            });
            this.fireChange(true);
        }

        return this;
    }

    /**
     * 生成字形名称
     *
     * @param {Array=} indexList 索引列表
     * @return {this}
     */
    genGlyfName(indexList) {

        var list = this.ttf.genGlyfName(indexList);
        if (list.length) {
            list.forEach(function (g) {
                g.modify = 'edit';
            });
            this.fireChange(true);
        }

        return this;
    }

    /**
     * 清除字形名称
     *
     * @param {Array=} indexList 索引列表
     * @return {this}
     */
    clearGlyfName(indexList) {

        var list = this.ttf.clearGlyfName(indexList);
        if (list.length) {
            list.forEach(function (g) {
                g.modify = 'edit';
            });
            this.fireChange(true);
        }

        return this;
    }

    /**
     * 添加并体替换指定的glyf
     *
     * @param {Array} glyfList 添加的列表
     * @param {Array=} indexList 需要替换的索引列表
     * @return {this}
     */
    appendGlyf(glyfList, indexList) {

        var list = this.ttf.appendGlyf(glyfList, indexList);
        if (list.length) {
            list.forEach(function (g) {
                g.modify = 'new';
            });
            this.fireChange(true);
        }

        return this;
    }

    /**
     * 替换指定的glyf
     *
     * @param {Object} glyf glyfobject
     * @param {string} index 需要替换的索引列表
     * @return {this}
     */
    replaceGlyf(glyf, index) {
        var list = this.ttf.replaceGlyf(glyf, index);
        if (list.length) {
            list[0].modify = 'edit';
            this.fireChange(true, 'replace');
        }
        return this;
    }

    /**
     * 调整glyf位置
     *
     * @param {Array=} indexList 索引列表
     * @param {Object} setting 选项
     * @return {boolean}
     */
    adjustGlyfPos(indexList, setting) {

        var list = this.ttf.adjustGlyfPos(indexList, setting);
        if (list.length) {
            list.forEach(function (g) {
                g.modify = 'edit';
            });
            this.fireChange(true);
        }

        return this;
    }


    /**
     * 调整glyf
     *
     * @param {Array=} indexList 索引列表
     * @param {Object} setting 选项
     * @return {boolean}
     */
    adjustGlyf(indexList, setting) {

        var list = this.ttf.adjustGlyf(indexList, setting);
        if (list.length) {
            list.forEach(function (g) {
                g.modify = 'edit';
            });
            this.fireChange(true);
        }

        return this;
    }

    /**
     * 设置glyf
     *
     * @param {Object} setting 选项
     * @param {Array} index 索引
     * @return {boolean}
     */
    updateGlyf(setting, index) {

        var glyf = this.getGlyf([index])[0];
        var changed = false;

        if (setting.unicode.length) {
            glyf.unicode = setting.unicode;
            glyf.modify = 'edit';
            changed = true;
        }

        if (setting.name !== glyf.name) {
            glyf.name = setting.name;
            glyf.modify = 'edit';
            changed = true;
        }

        if (
            (undefined !== setting.leftSideBearing
                && setting.leftSideBearing !== glyf.leftSideBearing)
            || (undefined !== setting.rightSideBearing
                && setting.rightSideBearing + (glyf.xMax || 0) !== glyf.advanceWidth)
        ) {
            var list = this.ttf.adjustGlyfPos([index], setting);
            if (list.length) {
                list.forEach(function (g) {
                    g.modify = 'edit';
                });
                changed = true;
            }
        }

        changed && this.fireChange(true);

        return this;
    }


    /**
     * 获取glyfList
     *
     * @param {Array=} indexList 索引列表
     * @return {Array} glyflist
     */
    getGlyf(indexList) {
        return this.ttf.getGlyf(indexList);
    }

    /**
     * 设置名字和头部信息
     *
     * @param {Object} info 设置
     * @return {this}
     */
    setInfo(info) {
        this.ttf.setName(info);
        this.ttf.setHead(info);
        this.fireChange(true);
        return this;
    }

    /**
     * 设置度量信息
     *
     * @param {Object} info 设置
     * @return {this}
     */
    setMetrics(info) {
        this.ttf.setHhea(info);
        this.ttf.setOS2(info);
        this.ttf.setPost(info);
        this.fireChange(true);
        return this;
    }

    /**
     * 优化字体
     *
     * @return {true|Object} 优化成功，或者错误信息
     */
    optimize() {

        var result = this.ttf.optimize();

        this.ttf.get().glyf.forEach(function (g) {
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
    }

    /**
     * 对字形按照unicode编码排序
     *
     * @return {true|Object} 优化成功，或者错误信息
     */
    sortGlyf() {

        var result = this.ttf.sortGlyf();

        if (result === -1) {
            return {
                message: i18n.lang.msg_no_sort_glyf
            };
        }
        else if (result === -2) {
            return {
                message: i18n.lang.msg_has_compound_glyf_sort
            };
        }

        if (result.length) {
            result.forEach(function (g) {
                g.modify = 'edit';
            });
            this.fireChange(true);
        }
        return true;
    }

    /**
     * 复合字形转简单字形
     *
     * @param {Array=} indexList 选中的字形索引
     * @return {this}
     */
    compound2simple(indexList) {
        var result = this.ttf.compound2simple(indexList);
        if (result.length) {
            result.forEach(function (g) {
                g.modify = 'edit';
            });
            this.fireChange(true);
        }
        return this;
    }


    /**
     * 撤销
     *
     * @return {this}
     */
    undo() {
        if (!this.history.atFirst()) {
            this.ttf.set(this.history.back());
            this.fireChange(false);
        }

        return this;
    }


    /**
     * 重做
     *
     * @return {this}
     */
    redo() {
        if (!this.history.atLast()) {
            this.ttf.set(this.history.forward());
            this.fireChange(false);
        }

        return this;
    }

    /**
     * ttf是否被改变
     *
     * @return {boolean}
     */
    isChanged() {
        return !!this.changed;
    }

    /**
     * 设置状态
     *
     * @param {string} state 状态值 new/saved
     * @return {this}
     */
    setState(state) {
        if (state === 'new') {
            this.changed = false;
        }
        else if (state === 'saved') {
            this.ttf.get().glyf.forEach(function (g) {
                delete g.modify;
            });

            this.fire('change', {
                ttf: this.ttf.get(),
                changeType: state
            });

            this.changed = false;
        }

        return this;
    }

    /**
     * 获取复制的glyf对象，这里会将复合字形转换成简单字形，以便于粘贴到其他地方
     *
     * @param {Array=} indexList 索引列表
     * @return {Array} glyflist
     */
    getCopiedGlyf(indexList) {
        var list = [];
        var ttf = this.ttf.get();
        for (var i = 0, l = indexList.length; i < l; ++i) {
            var index = indexList[i];
            var cloned = lang.clone(ttf.glyf[index]);
            if (ttf.glyf[index].compound) {
                compound2simple(cloned, transformGlyfContours(ttf.glyf[index], ttf));
            }
            list.push(cloned);
        }
        return list;
    }

    /**
     * 清除glyf编辑状态
     *
     * @param {Array} glyfList glyf列表
     * @return {Array} glyf列表
     */
    clearGlyfTag(glyfList) {
        glyfList.forEach(function (g) {
            delete g.modify;
        });
        return glyfList;
    }

    /**
     * 设置状态
     *
     * @return {this}
     */
    calcMetrics() {
        if (this.ttf) {
            return this.ttf.calcMetrics();
        }
    }

    /**
     * 注销
     */
    dispose() {
        this.un();
        delete this.ttf;
    }
}

observable.mixin(Manager.prototype);
