/**
 * @file 编辑器设置选项
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {
        var i18n = require('../i18n/i18n');
        var tpl = require('../template/dialog/setting-editor.tpl');
        var lang = require('common/lang');
        var program = require('../widget/program');

        return require('./setting').derive({

            title: i18n.lang.dialog_editor_setting,

            getTpl: function () {
                return tpl;
            },

            set: function (setting) {
                this.setting = lang.clone(setting);
                this.setFields(this.setting);
                var me = this;
                $('#setting-editor-default').on('click', function (e) {
                    e.preventDefault();
                    me.setting = program.setting.getDefault('editor');
                    me.setFields(me.setting);
                    me.oldSetting = null;
                });
            },
            onDispose: function () {
                $('#setting-editor-default').off('click');
            },
            validate: function () {
                return this.getFields(lang.clone(this.setting));
            }

        });
    }
);
