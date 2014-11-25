/**
 * @file setting-adjust-pos.js
 * @author mengke01
 * @date 
 * @description
 * 设置自动调整字形位置
 */

define(
    function(require) {

        var string = require('ttf/util/string');
        var unicodeREG = /^(?:\$[A-F0-9]+)(?:\,\$[A-F0-9]+)*$/gi;

        var tpl = ''
            + '<div class="form-inline">'
            +   '<div class="input-group input-group-sm">'
            +     '<span class="input-group-addon">unicode</span>'
            +     '<input data-field="unicode" data-type="unicode" id="setting-glyf-unicode" class="form-control">'
            +   '</div>'
            +   '&nbsp;&nbsp;<span>可以设置多个unicode，例如："$21,$22,$23"</span>'
            + '</div>'
            + '<div class="form-inline">'
            +   '<div class="input-group input-group-sm">'
            +     '<span class="input-group-addon">命名</span>'
            +     '<input data-field="name" id="setting-glyf-name" class="form-control">'
            +   '</div>'
            + '</div>'
            + '<div class="form-inline">'
            +   '<div class="input-group input-group-sm">'
            +     '<span class="input-group-addon">左边轴</span>'
            +     '<input data-field="leftSideBearing" type="number"'
            +       ' min="-16384" max="16384" step="1" class="form-control">'
            +   '</div>'
            + '</div>'
            + '<div class="form-inline">'
            +   '<div class="input-group input-group-sm">'
            +     '<span class="input-group-addon">右边轴</span>'
            +     '<input data-field="rightSideBearing" type="number"'
            +       ' min="-16384" max="16384" step="1" class="form-control">'
            +   '</div>'
            + '</div>';


        return require('./setting').derive({
            
            title: '调整字形',

            getTpl: function() {
                return tpl;
            },

            set: function(setting) {
                $('#setting-glyf-unicode').on('blur', function(e) {
                    var val = $(this).val();
                    var ctlGlyfName = $('#setting-glyf-name');
                    if (val.match(unicodeREG)) {
                        val = Number('0x' + val.split(',')[0].slice(1));
                        ctlGlyfName.val(string.getUnicodeName(val));
                    }
                });
                this.setFields(setting || {});
            },
            
            validate: function() {

                var unicode = $('#setting-glyf-unicode').val();
                if (unicode && !unicode.match(unicodeREG)) {
                    alert('unicode设置不正确!');
                    return false;
                }

                var setting = this.getFields();

                if(setting.leftSideBearing === undefined
                    && setting.rightSideBearing === undefined 
                    && setting.unicode === undefined
                    && setting.name === undefined
                ) {
                    alert('没有设置项目!');
                    return false;
                }
                else {
                    return setting;
                }
            }

        });
    }
);
