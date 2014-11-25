/**
 * @file setting-editor.js
 * @author mengke01
 * @date 
 * @description
 * 编辑器设置选项
 */



define(
    function(require) {
        var lang = require('common/lang');

        var tpl = ''
            + '<div class="form-inline">'
            +   '<div class="form-group">'
            +       '<div class="input-group input-group-sm">'
            +         '<span class="input-group-addon">字体列表颜色</span>'
            +         '<input data-field="viewer.color" type="text" class="form-control">'
            +       '</div>'
            +   '</div>'
            + '</div>'
            + '<hr>'

            + '<div class="form-inline">'
            +   '<div class="form-group">'
            +       '<div class="input-group input-group-sm">'
            +         '<span class="input-group-addon">吸附到网格线</span>'
            +         '<span class="form-control"><input data-field="editor.sorption.enableGrid" type="checkbox"></span>'
            +       '</div>'
            +   '</div>'
            +   '<div class="form-group">'
            +       '<div class="input-group input-group-sm">'
            +         '<span class="input-group-addon">吸附到轮廓</span>'
            +         '<span class="form-control"><input data-field="editor.sorption.enableShape" type="checkbox"></span>'
            +       '</div>'
            +   '</div>'
            + '</div>'
            + '<div class="form-inline">'
            +     '<div class="input-group input-group-sm">'
            +       '<span class="input-group-addon">显示网格</span>'
            +       '<span class="form-control"><input data-field="editor.axis.showGrid" type="checkbox"></span>'
            +     '</div>'
            + '</div>'
            + '<div class="form-inline">'
            +   '<div class="input-group input-group-sm">'
            +       '<span class="input-group-addon">轮廓颜色</span>'
            +       '<input data-field="editor.fontLayer.fillColor" type="text" class="form-control">'
            +   '</div>'
            +  '</div>'
            + '</div>'

            + '<div class="form-inline">'
            +   '<div class="input-group input-group-sm">'
            +     '<span class="input-group-addon">网格线颜色</span>'
            +     '<input data-field="editor.axis.gapColor" type="text" class="form-control">'
            +   '</div>'
            + '</div>'

            + '<div class="form-inline">'
            +   '<div class="input-group input-group-sm">'
            +     '<span class="input-group-addon">网格线间距</span>'
            +     '<input data-field="editor.axis.graduation.gap" type="text" class="form-control">'
            +   '</div>'
            + '</div>';

        return require('./setting').derive({
            
            title: '设置',

            getTpl: function() {
                return tpl;
            },

            set: function(setting) {
                this.setFields(setting);
                this.setting = lang.clone(setting);
            },
            
            validate: function() {
                var setting = this.getFields(this.setting);
                return setting;
            }

        });
    }
);