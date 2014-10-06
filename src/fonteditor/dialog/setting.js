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
        function Setting() {
        }

        /**
         * 初始化绑定事件
         */
        Setting.prototype.preInit = function() {
            var dlg = $('#model-dialog');
            dlg.find('.modal-title').html(this.title);
            dlg.find('.modal-body').html(this.getTpl());

            dlg.on('hidden.bs.modal', lang.bind(function (e) {
                if (dlg) {
                    this.un();
                    dlg.off('hidden.bs.modal');
                    dlg.find('.btn-confirm').off('click');
                    dlg = null;
                }
            }, this));

            dlg.find('.btn-confirm').on('click', lang.bind(function() {
                if (false !== this.onConfirm()) {
                    dlg.modal('hide');
                }
            }, this));
        };

        /**
         * 获取模板
         * 
         * @return {string} 模板字符串
         */
        Setting.prototype.getTpl = function() {
            return '';
        };

        /**
         * 确定事件
         * 
         * @return {boolean=} 是否关闭对话框
         */
        Setting.prototype.onConfirm = function() {
        };

        /**
         * 显示
         */
        Setting.prototype.show = function() {
            $('#model-dialog').modal('show');
            return this;
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
                this.preInit();
                this.initialize && this.initialize();
            }

            Class.prototype = new Setting();
            Class.prototype.constructor = Setting;
            lang.extend(Class.prototype, proto);
            observable.mixin(Class.prototype);

            return Class;
        };

        return Setting;
    }
);
