/**
 * @file setting.js
 * @author mengke01
 * @date 
 * @description
 * 设置框
 */


define(
    function(require) {
        var lang = require('common/lang');
        var pad = require('common/string').pad;
        
        /**
         * 设置框函数
         * 
         * @constructor
         */
        function Setting(options) {

            this.options = options || {};

            var dlg = $('#model-dialog');
            dlg.find('.modal-title').html(this.title || '设置');
            dlg.find('.modal-body').html(this.getTpl());

            if (this.nofooter) {
                dlg.find('.modal-footer').hide();
            }
            else {
                dlg.find('.modal-footer').show();
            }

            dlg.on('hidden.bs.modal', lang.bind(function (e) {
                if (dlg) {
                    this.onDispose && this.onDispose();
                    delete this.options;
                    dlg.off('hidden.bs.modal');
                    dlg.find('.btn-confirm').off('click');
                    dlg = null;
                }
            }, this));

            dlg.find('.btn-confirm').on('click', lang.bind(function() {
                var setting = this.validate();
                if (false !== setting) {
                    this.options.onChange && this.options.onChange.call(this, setting);
                    dlg.modal('hide');
                }
            }, this));
        }


        /**
         * 获取模板
         * 
         * @return {string} 模板字符串
         */
        Setting.prototype.getTpl = function() {
            return '';
        };

        /**
         * 获取dialog对象
         * 
         * @return {Object} dialog对象
         */
        Setting.prototype.getDialog = function() {
            return $('#model-dialog');
        };

        /**
         * 验证设置
         * 
         * @return {boolean}
         */
        Setting.prototype.validate = function() {
            return true;
        };


        /**
         * 设置field字段值
         * 
         * @return {boolean}
         */
        Setting.prototype.setFields = function(setting) {
            this.getDialog().find('[data-field]').each(function(i, item) {

                var field = item.getAttribute('data-field');
                
                if (undefined === setting[field]) {
                    return;
                }

                if (item.type == 'checkbox') {
                    item.checked = setting[field] ? 'checked' : '';
                }
                else if (item.type == 'datetime-local') {
                    var val = setting[field];
                    var date;
                    if (typeof(val) === 'string') {
                        date = new Date(Date.parse(val));
                    }
                    else if(/^\d+$/.test(val)) {
                        date = new Date(+val);
                    }
                    else {
                        date = val;
                    }
                    item.value = date.getFullYear() + '-' + pad(date.getMonth() + 1, 2) + '-' + pad(date.getDate(), 2)
                        + 'T' + pad(date.getHours(), 2) + ':' + pad(date.getMinutes(), 2);
                }
                else {
                    item = $(item);
                    item.val(setting[field]);
                }

            });
            return this;
        };

        /**
         * 获取field字段值
         * 
         * @return {Object}
         */
        Setting.prototype.getFields = function() {
            var setting = {};
            this.getDialog().find('[data-field]').each(function(i, item) {

                var field = item.getAttribute('data-field');

                if (item.type == 'checkbox') {
                    if (item.checked) {
                        setting[field] = true;
                    }
                }
                else if (item.type == 'datetime-local') {
                    if (item.value) {
                        setting[field] = Date.parse(item.value.replace('T', ' '));
                    }
                }
                else if (item.type == 'number') {
                    if (item.value) {
                        var val = +item.value;
                        if (item.getAttribute('data-ceil')) {
                            val = Math.floor(val);
                        }
                        setting[field] = val;
                    }
                }

                else {
                    item = $(item);
                    var val = item.val().trim();
                    if (val) {
                        setting[field] =  val;
                    }
                }
            });
            return setting;
        };

        /**
         * 显示
         * @param {Object} setting 设置选项
         */
        Setting.prototype.show = function(setting) {
            $('#model-dialog').modal('show');
            this.set(setting);
            return this;
        };


        /**
         * 设置设置选项
         * 
         * @return {this}
         */
        Setting.prototype.set = function(setting) {
            this.setting = setting;
        };

        /**
         * 获取设置选项
         * 
         * @return {Object} 设置选项
         */
        Setting.prototype.get = function() {
            return this.setting;
        };


        /**
         * 注销
         */
        Setting.prototype.dispose = function() {
            $('#model-dialog').modal('hide');
        };

        /**
         * 派生一个setting
         * 
         * @param {Object} proto 原型函数
         * @return {Function} 派生类
         */
        Setting.derive = function(proto) {

            function Class() {
                Setting.apply(this, arguments);
                this.initialize && this.initialize();
            }

            lang.extend(Class.prototype, Setting.prototype, proto);
            Class.prototype.constructor = Setting;

            return Class;
        };

        return Setting;
    }
);
