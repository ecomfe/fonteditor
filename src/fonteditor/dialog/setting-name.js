/**
 * @file setting-unicode.js
 * @author mengke01
 * @date 
 * @description
 * 设置字体命名信息
 */

define(
    function(require) {

        var tpl = ''
            + '<div class="input-group input-group-sm">'
            +   '<span class="input-group-addon">字体家族</span>'
            +   '<input data-field="fontFamily" type="text" class="form-control">'
            + '</div>'
            + '<div class="input-group input-group-sm">'
            +   '<span class="input-group-addon">字体子家族</span>'
            +   '<input data-field="fontSubFamily" type="text" class="form-control">'
            + '</div>'
            + '<div class="input-group input-group-sm">'
            +   '<span class="input-group-addon">完整字体名</span>'
            +   '<input data-field="fullName" type="text" class="form-control">'
            + '</div>'
            + '<div class="input-group input-group-sm">'
            +   '<span class="input-group-addon">版本</span>'
            +   '<input data-field="version" type="text" class="form-control">'
            + '</div>'
            + '<div class="input-group input-group-sm">'
            +   '<span class="input-group-addon">PostScript名称</span>'
            +   '<input data-field="postScriptName" type="text" class="form-control">'
            + '</div>';


        return require('./setting').derive({
            
            title: '命名信息',

            getTpl: function() {
                return tpl;
            },

            set: function(setting) {
                this.getDialog().find('[data-field]').each(function(i, item) {
                    item = $(item);
                    item.val(setting[item.attr('data-field')] || '');
                });
            },
            
            validate: function() {
                var name = {};
                this.getDialog().find('[data-field]').each(function(i, item) {
                    item = $(item);
                    var val = item.val().trim();
                    if (val) {
                        name[item.attr('data-field')] = val;
                    }
                });
                return name;
            }

        });
    }
);
