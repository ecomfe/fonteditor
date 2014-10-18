/**
 * @file editortest.js
 * @author mengke01
 * @date 
 * @description
 * 测试编辑器
 */

define(
    function(require) {

        var lang = require('common/lang');
        var editor = require('editor/main');

        var ttfObject = null;
        var currentEditor = null;
        var entry = {

            /**
             * 初始化
             */
            init: function () {
                $.getJSON('./js/baiduHealth.json', function(ttf) {
                    ttfObject = ttf;
                    var str = '';

                    ttf.glyf.slice(0, 10).forEach(function(glyf, index) {
                        str +='<a href="#" data-index="'+index+'">'+ glyf.name +'</a>';
                    });

                    $('#glyf-list').html(str);


                });

                currentEditor = editor.create($('#render-view').get(0));

                $('#glyf-list').delegate('[data-index]', 'click', function(e) {
                    e.preventDefault();
                    var index = +$(this).attr('data-index');
                    currentEditor.setFont(lang.clone(ttfObject.glyf[index]));
                });

                $('#editor-unitsperem').on('change', function(){
                    var unitsPerEm = +$(this).val();
                    currentEditor.setAxis({
                        unitsPerEm: unitsPerEm
                    });
                })

            }
        };

        entry.init();
        
        return entry;
    }
);