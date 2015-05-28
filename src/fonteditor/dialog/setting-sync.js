/**
 * @file 同步字体设置
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {
        var i18n = require('../i18n/i18n');
        var tpl = require('../template/dialog/setting-sync.tpl');

        return require('./setting').derive({

            title: i18n.lang.syncfont,

            getTpl: function () {
                return tpl;
            },

            set: function (setting) {
                this.setFields(setting || {});
                var me = this;
                $('#setting-sync-cancel').on('click', function () {
                    me.hide(0);
                });
            },

            onDispose: function () {
                $('#setting-sync-cancel').off('click');
            },

            validate: function () {
                var setting = this.getFields();

                if (!setting.url || !setting.name) {
                    alert('请设置同步URL和文件名称!');
                    return false;
                }

                if (!setting.woff && !setting.ttf && !setting.svg && !setting.eot) {
                    alert('请设置文件类型!');
                    return false;
                }

                return setting;
            }
        });
    }
);
