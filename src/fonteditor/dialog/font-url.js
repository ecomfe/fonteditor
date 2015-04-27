/**
 * @file 读取线上字体
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {

        var tpl = ''
            +   '<div class="input-group input-group-sm">'
            +       '<span class="input-group-addon">字体URL</span>'
            +       '<input data-field="url" type="text" class="form-control">'
            +   '</div>';

        return require('./setting').derive({

            title: '线上字体',

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
