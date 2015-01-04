/**
 * @file setting-find-glyf.js
 * @author mengke01
 * @date
 * @description
 * 按unicode查找字形
 *
 */

define(
    function (require) {

        var unicodeREG = /^(?:\$[A-F0-9]+)$/gi;

        var tpl = ''
            + '<div class="form-inline">'
            +   '<div class="input-group input-group-sm">'
            +     '<span class="input-group-addon">unicode</span>'
            +     '<input value="$" data-field="unicode" data-type="unicode"'
            +       ' id="setting-glyf-unicode" class="form-control">'
            +   '</div>'
            +   '&nbsp;&nbsp;<span>例如："$21"</span>'
            + '</div>';


        return require('./setting').derive({

            title: '查找字形',

            getTpl: function () {
                return tpl;
            },

            validate: function () {

                var unicode = $('#setting-glyf-unicode').val();
                if (unicode && !unicode.match(unicodeREG)) {
                    alert('unicode不正确!');
                    return false;
                }

                return this.getFields();
            }

        });
    }
);
