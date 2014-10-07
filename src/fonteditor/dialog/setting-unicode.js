/**
 * @file setting-unicode.js
 * @author mengke01
 * @date 
 * @description
 * 设置代码点
 */

define(
    function(require) {

        var tpl = ''
            + '<div class="col-lg-6">'
            +   '<div class="input-group">'
            +     '<div class="input-group-btn">'
            +       '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">起始代码点 <span class="caret"></span></button>'
            +       '<ul class="dropdown-menu" role="menu">'
            +         '<li><a href="javascript:$(\'#setting-text-unicode\').val(\'$20\')">ascii</a></li>'
            +         '<li><a href="javascript:$(\'#setting-text-unicode\').val(\'$E001\')">unicode private data</a></li>'
            +       '</ul>'
            +     '</div>'
            +     '<input id="setting-text-unicode" type="text" class="form-control" value="$E001">'
            +   '</div>'
            + '</div>';

        return require('./setting').derive({
            
            title: '设置代码点',

            getTpl: function() {
                return tpl;
            },

            validate: function() {
                var unicode = $('#setting-text-unicode').val();
                if (unicode.match(/^\$[A-E0-9]+$/i)) {
                    return this.setting = unicode;
                }
                else {
                    alert('代码点设置不正确');
                    return false;
                }
            }
        });
    }
);
