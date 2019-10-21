/**
 * @file 按unicode查找字形
 * @author mengke01(kekee000@gmail.com)
 */

import i18n from '../i18n/i18n';
import setting from './setting';
const unicodeREG = /^(?:\$[A-F0-9]+)(?:\,\$[A-F0-9]+)*$/gi;

const tpl = ''
    + '<div id="setting-find-condition">'
    +   '<label class="radio-inline">'
    +       '<input type="radio" name="setting-find-condition" value="unicode" checked="checked">'
    +       i18n.lang.dialog_find_glyf_by_unicode
    +   '</label>'
    +   '<label class="radio-inline">'
    +       '<input type="radio" name="setting-find-condition" value="name">'
    +       i18n.lang.dialog_find_glyf_by_name
    +   '</label>'
    +   '<label class="radio-inline">'
    +       '<input type="radio" name="setting-find-condition" value="index">'
    +       i18n.lang.dialog_find_glyf_by_index
    +   '</label>'
    + '</div>'
    + '<p class="form-line">' + i18n.lang.dialog_find_glyf_example + '</p>'
    + '<div>'
    +   '<input value="" id="setting-find-value" class="form-control">'
    + '</div>';


export default setting.derive({

    title: i18n.lang.findglyf,

    getTpl() {
        return tpl;
    },
    set(setting) {
        $('#setting-find-condition').on('click', 'input[type="radio"]', function () {
            $('#setting-find-value').focus();
        });
    },
    onDispose() {
        $('#setting-find-condition').off('click', 'input[type="radio"]');
    },
    validate() {
        let condition = $('#setting-find-condition').find('input[type="radio"]:checked').val();
        let value = $('#setting-find-value').val();

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

        let setting = {};
        setting[condition] = value;

        return setting;
    }

});
