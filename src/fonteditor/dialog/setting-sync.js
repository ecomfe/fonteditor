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
                this.newProject = setting.newProject;
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

                if (!setting.name) {
                    alert(i18n.lang.dialog_alert_set_sync_name);
                    return false;
                }

                if (!setting.url && !setting.pushUrl) {
                    alert(i18n.lang.dialog_alert_set_url_or_syncurl);
                    return false;
                }

                if (this.newProject && !setting.url) {
                    alert(i18n.lang.dialog_alert_set_sync_url);
                    return false;
                }

                if (!setting.woff && !setting.ttf && !setting.svg && !setting.eot) {
                    alert(i18n.lang.dialog_alert_set_filetype);
                    return false;
                }

                return setting;
            }
        });
    }
);
