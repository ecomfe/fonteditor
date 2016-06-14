/**
 * @file 按unicode查找字形
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {
        var i18n = require('../i18n/i18n');
        var unicodeREG = /^(?:\$[A-F0-9]+)(?:\,\$[A-F0-9]+)*$/gi;

        var tpl = ''
            + '<div id="setting-find-condition">'
            +   '<label class="radio-inline">'
            +       '<input type="radio" name="setting-find-condition" value="unicode" checked="checked">'
            +       i18n.lang.dialog_find_glyph_by_unicode
            +   '</label>'
            +   '<label class="radio-inline">'
            +       '<input type="radio" name="setting-find-condition" value="name">'
            +       i18n.lang.dialog_find_glyph_by_name
            +   '</label>'
            +   '<label class="radio-inline">'
            +       '<input type="radio" name="setting-find-condition" value="index">'
            +       i18n.lang.dialog_find_glyph_by_index
            +   '</label>'
            + '</div>'
            + '<p class="form-line">' + i18n.lang.dialog_find_glyph_example + '</p>'
            + '<div>'
            +   '<input value="" id="setting-find-value" class="form-control">'
            + '</div>';


        return require('./setting').derive({

            title: i18n.lang.findglyph,

            getTpl: function () {
                return tpl;
            },
            set: function (setting) {
                $('#setting-find-condition').on('click', 'input[type="radio"]', function () {
                    $('#setting-find-value').focus();
                });
            },
            onDispose: function () {
                $('#setting-find-condition').off('click', 'input[type="radio"]');
            },
            validate: function () {
                var condition = $('#setting-find-condition').find('input[type="radio"]:checked').val();
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
                    if (value.match(/^\d+(,\d+)*$/)) {
                        value = value.split(',');
                    }
                    else {
                        alert(i18n.lang.dialog_set_unicode);
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
