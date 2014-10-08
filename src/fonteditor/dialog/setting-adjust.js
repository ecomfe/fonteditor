/**
 * @file setting-adjust.js
 * @author mengke01
 * @date 
 * @description
 * 设置自动调整字形
 */

define(
    function(require) {

        var lang = require('common/lang');

        var tpl = ''
            + '<div class="input-group input-group-sm">'
            +   '<span class="input-group-addon">左边轴</span>'
            +   '<input data-field="leftSideBearing" type="number" min="-16384" max="16384" step="1" class="form-control">'
            + '</div>'
            + '<div class="input-group input-group-sm">'
            +   '<span class="input-group-addon">右边轴</span>'
            +   '<input data-field="rightSideBearing" type="number" min="-16384" max="16384" step="1" class="form-control">'
            + '</div>'
            + '<div class="form-inline">'
            +   '<div class="form-group">'
            +     '<div class="input-group input-group-sm">'
            +       '<span class="input-group-addon">缩放字形到em框</span>'
            +       '<span class="form-control">'
            +           '<input data-field="ajdustToEmBox" type="checkbox" onclick="$(\'#setting-ajdustToEmPadding\')[this.checked ? \'removeClass\' : \'addClass\'](\'hide\')">'
            +       '</span>'
            +     '</div>'
            +   '</div>'
            +   ' '
            +   '<div id="setting-ajdustToEmPadding" class="form-group hide">'
            +     '<div class="input-group input-group-sm">'
            +       '<span class="input-group-addon">顶部和底部留白</span>'
            +       '<input data-field="ajdustToEmPadding" type="number" min="-16384" max="16384" step="1" class="form-control">'
            +     '</div>'
            +   '</div>'
            + '</div>'
            + '<div class="input-group input-group-sm">'
            +   '<span class="input-group-addon">基线偏移</span>'
            +   '<input data-field="verticalAlign" type="number" min="-16384" max="16384" step="1" class="form-control">'
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
                var setting = {};
                this.getDialog().find('[data-field]').each(function(i, item) {

                    if (item.type == 'checkbox') {
                        if (item.checked) {
                            setting[$(item).attr('data-field')] = true;
                        }
                    }
                    else {
                        item = $(item);
                        var val = item.val().trim();
                        if (val) {
                            setting[item.attr('data-field')] = Math.floor(+val);
                        }
                    }
                });

                if(setting.leftSideBearing == undefined
                    && setting.rightSideBearing == undefined 
                    && setting.ajdustToEmBox == undefined
                    && setting.verticalAlign == undefined
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
