/**
 * @file 导入和导出设置选项
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {
        var tpl = require('../template/dialog/setting-ie.tpl');
        var lang = require('common/lang');
        var program = require('../widget/program');

        return require('./setting').derive({

            title: '导入和导出',

            getTpl: function () {
                return tpl;
            },

            set: function (setting) {
                this.setting = lang.clone(setting);
                this.setFields(this.setting);
                var me = this;
                $('#setting-ie-default').on('click', function (e) {
                    e.preventDefault();
                    me.setting = program.setting.getDefault('ie');
                    me.setFields(me.setting);
                    me.oldSetting = null;
                });
            },
            onDispose: function () {
                $('#setting-ie-default').off('click');
            },
            validate: function () {
                var setting = this.getFields(lang.clone(this.setting));
                return setting;
            }

        });
    }
);
