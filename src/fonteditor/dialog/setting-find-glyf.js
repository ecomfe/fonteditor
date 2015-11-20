/**
 * @file 按unicode查找字形
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {
        var i18n = require('../i18n/i18n');
        var unicodeREG = /^(?:\$[A-F0-9]+)(?:\,\$[A-F0-9]+)*$/gi;

        var tpl = ''
            + '<div class="form-inline">'
            +   '<select id="setting-find-condition" class="form-control">'
            +       '<option value="unicode" selected>' + i18n.lang.dialog_find_glyf_by_unicode + '</option>'
            +       '<option value="name">' + i18n.lang.dialog_find_glyf_by_name + '</option>'
            +       '<option value="index">' + i18n.lang.dialog_find_glyf_by_index + '</option>'
            +   '</select> '
            +   '<input value="" id="setting-find-value" class="form-control">'
            +   '<p class="form-line">' + i18n.lang.dialog_find_glyf_example + '</p>'
            + '</div>';


        return require('./setting').derive({

            title: i18n.lang.findglyf,

            getTpl: function () {
                return tpl;
            },

            validate: function () {
                var condition = $('#setting-find-condition').val();
                var value = $('#setting-find-value').val();

                if (!value.length) {
                    alert(i18n.lang.dialog_set_unicode);
                    return false;
                }

                if (condition === 'unicode') {
                    if (value.match(unicodeREG)) {
                        value = value.split(',');
                    }
                    else {
                        value = value.split('').map(function (c) {
                            return '$' + c.charCodeAt(0).toString(16);
                        });
                    }
                }
                else if (condition === 'index') {
                    if (value.match(/^\d+(,\d+)?$/)) {
                        value = value.split(',');
                    }
                    else {
                        $('#setting-find-value').val('');
                        return false;
                    }
                }

                var setting = {};
                setting[condition] = value;

                return setting;
            }

        });
    }
);
