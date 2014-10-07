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
        var observable = require('common/observable');

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
