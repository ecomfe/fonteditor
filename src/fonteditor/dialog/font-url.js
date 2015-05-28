/**
 * @file 读取线上字体
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {
        var i18n = require('../i18n/i18n');
        var tpl = ''
            +   '<div class="input-group input-group-sm">'
            +       '<span class="input-group-addon">' + i18n.lang.dialog_fonturl + '</span>'
            +       '<input data-field="url" type="text" class="form-control">'
            +   '</div>';

        return require('./setting').derive({

            title: i18n.lang.dialog_fonturl,

            getTpl: function () {
                return tpl;
            },

            validate: function () {
                var setting = this.getFields();
                if (setting.url) {
                    return setting.url;
                }
            }
        });
    }
);
