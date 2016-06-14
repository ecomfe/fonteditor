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
                $.getJSON('./data/baiduHealth.json', function(ttf) {
                    ttfObject = ttf;
                    var str = '';

                    ttf.glyph.slice(0, 10).forEach(function(glyph, index) {
                        str +='<a href="#" data-index="'+index+'">'+ glyph.name +'</a>';
                    });

                    $('#glyph-list').html(str);


                });

                currentEditor = editor.create($('#render-view').get(0));

                currentEditor.on('save', function(e) {
                    var font = e.font;
                    console.log(font);
                    ttfObject.glyph[font.index] = font;
                });

                $('#glyph-list').delegate('[data-index]', 'click', function(e) {
                    e.preventDefault();
                    var index = +$(this).attr('data-index');
                    var font = lang.clone(ttfObject.glyph[index]);
                    font.index = index;
                    currentEditor.setFont(font);
                });

                $('#editor-unitsperem').on('change', function(){
                    var unitsPerEm = +$(this).val();
                    currentEditor.setAxis({
                        unitsPerEm: unitsPerEm
                    });
                });

                $('#editor-bearing').on('change', function(){
                    var opt = $(this).val();

                    var setting = {
                        1 : {
                            leftSideBearing: 10,
                            rightSideBearing: 10
                        },
                        2: {
                            leftSideBearing: 100,
                            rightSideBearing: 100 
                        }
                    };


                    currentEditor.adjustFont(setting[opt]);
                });

            }
        };

        entry.init();
        
        return entry;
    }
);