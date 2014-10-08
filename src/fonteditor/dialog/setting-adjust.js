/**
 * @file setting-adjust.js
 * @author mengke01
 * @date 
 * @description
 * 设置自动调整字形
 */

define(
    function(require) {

        var tpl = ''
            + '<div class="input-group input-group-sm">'
            +   '<span class="input-group-addon">左边轴</span>'
            +   '<input data-field="leftSideBearing" type="number" min="-16384" max="16384" step="1" class="form-control">'
            + '</div>'
            + '<div class="input-group input-group-sm">'
            +   '<span class="input-group-addon">右边轴</span>'
            +   '<input data-field="rightSideBearing" type="number" min="-16384" max="16384" step="1" class="form-control">'
            + '</div>'
            +  
            + '<div class="input-group input-group-sm">'
            +   '<span class="input-group-addon">缩放字形到em框</span>'
            +   '<span class="form-control">'
            +       '<input  data-field="ajdustToEmBox" type="checkbox">'
            +   '</span>'
            + '</div>'
            + '<div class="input-group input-group-sm">'
            +   '<span class="input-group-addon">缩放留白</span>'
            +   '<input data-field="ajdustToEmPadding" type="number" min="-16384" max="16384" step="1" class="form-control">'
            + '</div>';


        return require('./setting').derive({
            
            title: '调整字形',

            getTpl: function() {
                return tpl;
            },

            set: function(setting) {
                setting = setting || {};
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
