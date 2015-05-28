/**
 * @file 设置自动调整字形位置
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {
        var i18n = require('../i18n/i18n');
        var tpl = require('../template/dialog/setting-adjust-pos.tpl');

        return require('./setting').derive({

            title: i18n.lang.dialog_adjust_pos,

            getTpl: function () {
                return tpl;
            },

            set: function (setting) {
                this.setFields(setting || {});
            },

            validate: function () {
                var setting = this.getFields();

                if (setting.leftSideBearing === undefined
                    && setting.rightSideBearing === undefined
                    && setting.verticalAlign === undefined
                ) {
                    alert(i18n.lang.dialog_no_input);
                    return false;
                }

                return setting;
            }

        });
    }
);
