/**
 * @file 设置代码点
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {
        var i18n = require('../i18n/i18n');
        var tpl = ''
            +   '<div class="input-group">'
            +     '<div class="input-group-btn">'
            +       '<button type="button" class="btn btn-default dropdown-toggle"'
            +           ' data-toggle="dropdown">'
            +           i18n.lang.dialog_unicode_start + ' <span class="caret"></span></button>'
            +       '<ul class="dropdown-menu" role="menu">'
            +         '<li><a href="javascript:$(\'#setting-text-unicode\').val(\'$21\')">ascii</a></li>'
            +         '<li><a href="javascript:$(\'#setting-text-unicode\').val(\'$E001\')">'
            +           'unicode private data</a></li>'
            +       '</ul>'
            +     '</div>'
            +     '<input id="setting-text-unicode" type="text" class="form-control" value="$E001">'
            +   '</div>'
            +   '<div class="form-inline">'
            +     '<div class="input-group input-group-sm">'
            +         '<span class="input-group-addon">${lang.dialog_generage_name}</span>'
            +         '<span class="form-control">'
            +             '<input id="setting-text-unicode-name" type="checkbox" checked="checked">'
            +         '</span>'
            +     '</div>'
            +   '</div>';

        return require('./setting').derive({

            title: i18n.lang.dialog_unicode_set,

            getTpl: function () {
                return tpl;
            },

            validate: function () {
                var unicode = $('#setting-text-unicode').val();
                if (unicode.match(/^\$[A-F0-9]+$/i)) {
                    return (this.setting = {
                        unicode: unicode,
                        isGenerateName: $('#setting-text-unicode-name').is(':checked')
                    });
                }

                alert('代码点设置不正确');
                return false;
            }
        });
    }
);
