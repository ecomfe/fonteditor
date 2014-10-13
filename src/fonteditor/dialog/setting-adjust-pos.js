/**
 * @file setting-adjust-pos.js
 * @author mengke01
 * @date 
 * @description
 * 设置自动调整字形位置
 */

define(
    function(require) {

        var tpl = ''
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
            + '</div>'
            + '<div class="form-inline">'
            +   '<div class="input-group input-group-sm">'
            +     '<span class="input-group-addon">基线偏移</span>'
            +     '<input data-field="verticalAlign" type="number"'
            +       ' min="-16384" max="16384" step="1" class="form-control">'
            +   '</div>'
            + '</div>';


        return require('./setting').derive({
            
            title: '调整字形',

            getTpl: function() {
                return tpl;
            },

            set: function(setting) {
                this.setFields(setting || {});
            },
            
            validate: function() {
                var setting = this.getFields();

                if(setting.leftSideBearing === undefined
                    && setting.rightSideBearing === undefined 
                    && setting.verticalAlign === undefined
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
