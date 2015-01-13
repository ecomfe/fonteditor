/**
 * @file setting-editor.js
 * @author mengke01
 * @date
 * @description
 * 编辑器设置选项
 */


define(
    function (require) {
        var lang = require('common/lang');
        var program = require('../widget/program');

        var tpl = ''
            + '<div class="form-inline">'
            +   '<div class="form-group">'
            +       '<div class="input-group input-group-sm">'
            +         '<span class="input-group-addon">字体列表颜色</span>'
            +         '<input data-field="viewer.color" type="text" class="form-control">'
            +       '</div>'
            +   '</div>'
            +   '<div class="form-group">'
            +       '<div class="input-group input-group-sm">'
            +         '<span class="input-group-addon">字体列表大小</span>'
            +           '<select data-field="viewer.shapeSize" class="form-control">'
            +               '<option value="xlarge">特大</option>'
            +               '<option value="large">大</option>'
            +               '<option value="normal">中</option>'
            +               '<option value="small">小</option>'
            +           '</select>'
            +       '</div>'
            +   '</div>'
            +   '<div class="form-group">'
            +       '<div class="input-group input-group-sm">'
            +         '<span class="input-group-addon">分页个数</span>'
            +         '<input data-field="viewer.pageSize" type="number" class="form-control">'
            +       '</div>'
            +   '</div>'
            + '</div>'
            + '<hr>'

            + '<div class="form-inline">'
            +   '<div class="form-group">'
            +       '<div class="input-group input-group-sm">'
            +         '<span class="input-group-addon">吸附到网格线</span>'
            +         '<span class="form-control">'
            +           '<input data-field="editor.sorption.enableGrid" type="checkbox">'
            +         '</span>'
            +       '</div>'
            +   '</div>'
            +   '<div class="form-group">'
            +       '<div class="input-group input-group-sm">'
            +         '<span class="input-group-addon">吸附到轮廓</span>'
            +         '<span class="form-control">'
            +           '<input data-field="editor.sorption.enableShape" type="checkbox">'
            +         '</span>'
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
            +   '<div class="form-group">'
            +       '<div class="input-group input-group-sm">'
            +           '<span class="input-group-addon">填充轮廓</span>'
            +           '<span class="form-control"><input data-field="editor.fontLayer.fill" type="checkbox"></span>'
            +       '</div>'
            +   '</div>'
            +   '<div class="form-group">'
            +       '<div class="input-group input-group-sm">'
            +           '<span class="input-group-addon">轮廓颜色</span>'
            +           '<input data-field="editor.fontLayer.strokeColor" type="text" class="form-control">'
            +       '</div>'
            +   '</div>'
            +   '<div class="form-group">'
            +       '<div class="input-group input-group-sm">'
            +           '<span class="input-group-addon">轮廓填充颜色</span>'
            +           '<input data-field="editor.fontLayer.fillColor" type="text" class="form-control">'
            +       '</div>'
            +   '</div>'
            + '</div>'

            + '<div class="form-inline">'
            +   '<div class="form-group">'
            +       '<div class="input-group input-group-sm">'
            +         '<span class="input-group-addon">网格线颜色</span>'
            +         '<input data-field="editor.axis.gapColor" type="text" class="form-control">'
            +       '</div>'
            +   '</div>'
            +   '<div class="form-group">'
            +       '<div class="input-group input-group-sm">'
            +         '<span class="input-group-addon">网格线间距</span>'
            +         '<input data-field="editor.axis.graduation.gap" type="number" class="form-control">'
            +       '</div>'
            +   '</div>'
            + '</div>'

            + '<div class="form-inline">'
            +   '<div class="form-group">'
            +       '<div class="input-group input-group-sm">'
            +         '<span class="input-group-addon">度量线颜色</span>'
            +         '<input data-field="editor.axis.metricsColor" type="text" class="form-control">'
            +       '</div>'
            +   '</div>'
            + '</div>'
            + '<div class="form-inline">'
            +   '<div class="input-group input-group-sm">'
            +       '<span class="input-group-addon">保存设置</span>'
            +       '<span class="form-control"><input data-field="saveSetting" type="checkbox"></span>'
            +   '</div> <a href="#" id="setting-editor-default">重置为默认设置</a>'
            + '</div>';

        return require('./setting').derive({

            title: '编辑器设置',

            getTpl: function () {
                return tpl;
            },

            set: function (setting) {
                this.setting = lang.clone(setting);
                this.setFields(this.setting);
                var me = this;
                $('#setting-editor-default').on('click', function (e) {
                    e.preventDefault();
                    me.setting = program.setting.getDefault('editor');
                    me.setFields(me.setting);
                });
            },

            validate: function () {
                var setting = this.getFields(this.setting);
                return setting;
            }

        });
    }
);
