/**
 * @file setting-name.js
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
            +   '<span class="input-group-addon">子字体家族</span>'
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
            + '</div>'
            + '<div class="input-group input-group-sm">'
            +   '<span class="input-group-addon">em框大小</span>'
            +   '<input data-field="unitsPerEm" type="number"'
            +       ' min="64" max="16384" class="form-control" placeholder="1024~16384">'
            + '</div>'
            + '<div class="input-group input-group-sm">'
            +   '<span class="input-group-addon">最小可读尺寸</span>'
            +   '<input data-field="lowestRecPPEM" type="number"'
            +       ' min="8" max="16384" class="form-control" placeholder="8~16384">'
            + '</div>'
            + '<div class="input-group input-group-sm">'
            +   '<span class="input-group-addon">创建日期</span>'
            +   '<input data-field="created" type="datetime-local" class="form-control">'
            + '</div>';


        return require('./setting').derive({
            
            title: '字体信息',

            getTpl: function() {
                return tpl;
            },

            set: function(setting) {
                this.setFields(setting);
            },
            
            validate: function() {
                var setting = this.getFields();
                return setting;          
            }

        });
    }
);
