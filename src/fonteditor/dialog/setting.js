/**
 * @file 弹出框基类，用来生成相关的设置对话框
 * @author mengke01(kekee000@gmail.com)
 */

import i18n from '../i18n/i18n';

import string from 'common/string';
import lang from 'common/lang';
import program from '../widget/program';

/**
 * 获取对象的值
 *
 * @param {Object} object 对象
 * @param {string} path 对象路径
 * @return {*} 对象的值
 */
function getValue(object, path) {
    let ref = path.split('.');

    if (ref.length === 1) {
        return object[path];
    }

    let refObject = object;
    let property;

    while (refObject != null && (property = ref.shift())) {
        refObject = refObject[property];
    }

    return refObject;
}

/**
 * 设置对象的值
 *
 * @param {Object} object 对象
 * @param {string} path path
 * @param {*} value 值
 * @return {Object} 对象
 */
function setValue(object, path, value) {
    let ref = path.split('.');

    if (ref.length === 1) {
        object[path] = value;
    }
    else {
        let lastProperty = ref.pop();
        let refObject = object;
        let property;

        while (refObject != null && (property = ref.shift())) {
            refObject = refObject[property];
        }

        if (refObject != null) {
            refObject[lastProperty] = value;
        }
    }

    return object;
}

export default class Setting {

    /**
     * 设置框函数
     *
     * @param {Object} options 参数选项
     * @constructor
     */
    constructor(options) {

        this.options = options || {};

        let dlg = $('#model-dialog');
        dlg.find('.modal-title').html(this.title || '');
        let tpl = string.format(this.getTpl(), i18n);
        dlg.find('.modal-body').html(tpl);

        if (this.nofooter) {
            dlg.find('.modal-footer').hide();
        }
        else {
            dlg.find('.modal-footer').show();
        }

        dlg.on('hidden.bs.modal', function (e) {
            program.listening = true;
            if (dlg) {
                this.onDispose && this.onDispose();
                this.style && dlg.removeClass(this.style);
                dlg.off('hidden.bs.modal');
                dlg.find('.btn-confirm').off('click');
                dlg.find('.modal-body').html('');

                delete this.options;
                delete this.setting;
                delete this.oldSetting;

                dlg = null;
            }
        }.bind(this));

        dlg.find('.btn-confirm').on('click', function () {
            let setting = this.validate();
            if (false !== setting) {

                if (!lang.equals(setting, this.oldSetting)) {
                    this.options.onChange && this.options.onChange.call(this, setting);
                }

                dlg.modal('hide');
            }
        }.bind(this));
    }


    /**
     * 获取模板
     *
     * @return {string} 模板字符串
     */
    getTpl() {
        return '';
    }

    /**
     * 获取dialog对象
     *
     * @return {Object} dialog对象
     */
    getDialog() {
        return $('#model-dialog');
    }

    /**
     * 验证设置
     *
     * @return {boolean}
     */
    validate() {
        return true;
    }


    /**
     * 设置field字段值
     *
     * @param {Object} setting 原始对象
     * @return {boolean}
     */
    setFields(setting) {
        this.getDialog().find('[data-field]').each(function (i, item) {

            let field = item.getAttribute('data-field');
            let type = item.getAttribute('data-type') || item.type;
            let val = getValue(setting, field);
            if (undefined === val) {
                return;
            }

            if (type === 'checkbox') {
                item.checked = val ? 'checked' : '';
            }
            else if (type === 'unicode') {
                item.value = (val || []).map(function (u) {
                    return '$' + u.toString(16).toUpperCase();
                }).join(',');
            }
            else if (type === 'datetime-local') {
                let date;
                if (typeof val === 'string') {
                    date = new Date(Date.parse(val));
                }
                else if (/^\d+$/.test(val)) {
                    date = new Date(+val);
                }
                else {
                    date = val;
                }
                item.value = date.getFullYear()
                    + '-' + string.pad(date.getMonth() + 1, 2)
                    + '-' + string.pad(date.getDate(), 2)
                    + 'T' + string.pad(date.getHours(), 2)
                    + ':' + string.pad(date.getMinutes(), 2);
            }
            else {
                item = $(item);
                item.val(val);
            }

        });

        this.oldSetting = setting;

        return this;
    }

    /**
     * 获取field字段值
     *
     * @param {Object} setting 原始对象
     * @return {Object}
     */
    getFields(setting = {}) {
        let unicodeREG = /^(?:\$[A-F0-9]+)(?:\,\$[A-F0-9]+)*$/gi;
        this.getDialog().find('[data-field]').each(function (i, item) {

            let field = item.getAttribute('data-field');
            let type = item.getAttribute('data-type') || item.type;
            let originValue = item.value.trim();
            let val;

            if (type === 'checkbox') {
                val = !!item.checked;
            }
            else if (type === 'unicode') {
                if (!originValue) {
                    val = [];
                }
                else if (unicodeREG.test(originValue)) {
                    val = originValue.split(',').map(function (u) {
                        return Number('0x' + u.slice(1));
                    });
                }
                else {
                    val = originValue.split('').map(function (u) {
                        return u.charCodeAt(0);
                    });
                }
            }
            else if (type === 'datetime-local') {
                if (originValue) {
                    val = Date.parse(originValue.replace('T', ' '));
                }
                else {
                    val = 0;
                }
            }
            else if (type === 'number') {
                if (originValue) {
                    originValue = +originValue;
                    if (item.getAttribute('data-ceil')) {
                        originValue = Math.floor(originValue);
                    }
                    val = originValue;
                }
                else {
                    val = null;
                }
            }
            else {
                val = originValue;
            }

            if (undefined !== val) {
                setValue(setting, field, val);
            }
        });

        return setting;
    }

    /**
     * 显示
     *
     * @param {Object} setting 设置选项
     * @return {this}
     */
    show(setting) {
        program.listening = false;
        let dlg = $('#model-dialog');
        if (this.style) {
            dlg.addClass(this.style);
        }
        dlg.modal('show');
        this.set(setting);
        return this;
    }

    /**
     * 关闭选项卡
     *
     * @param {?Object} setting 设置选项
     */
    hide(setting) {
        if (undefined !== setting) {
            this.options.onChange && this.options.onChange.call(this, setting);
        }

        $('#model-dialog').modal('hide');
    }


    /**
     * 设置设置选项
     *
     * @param {Object} setting 设置选项
     * @return {this}
     */
    set(setting) {
        this.setting = setting;
        return this;
    }

    /**
     * 获取设置选项
     *
     * @return {Object} 设置选项
     */
    get() {
        return this.setting;
    }

    /**
     * 注销
     */
    dispose() {
        $('#model-dialog').modal('hide');
    }
}

/**
 * 派生一个setting
 *
 * @param {Object} proto 原型函数
 * @return {Function} 派生类
 */
Setting.derive = function (proto) {
    class SubSetting extends Setting {

    }
    Object.assign(SubSetting.prototype, proto);
    return SubSetting;
};
