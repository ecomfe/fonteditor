/**
 * @file editortest.js
 * @author mengke01
 * @date
 * @description
 * 测试编辑器
 */

import lang from 'common/lang';
import editor from 'editor/main';

let ttfObject = null;
let currentEditor = null;
let entry = {

    /**
     * 初始化
     */
    init() {
        $.getJSON('./data/baiduHealth.json', function (ttf) {
            ttfObject = ttf;
            let str = '';

            ttf.glyf.slice(0, 10).forEach(function (glyf, index) {
                str += '<a href="#" data-index="' + index + '">' + glyf.name + '</a>';
            });

            $('#glyf-list').html(str);


        });

        currentEditor = editor.create($('#render-view').get(0));

        currentEditor.on('save', function (e) {
            let font = e.font;
            console.log(font);
            ttfObject.glyf[font.index] = font;
        });

        $('#glyf-list').delegate('[data-index]', 'click', function (e) {
            e.preventDefault();
            let index = +$(this).attr('data-index');
            let font = lang.clone(ttfObject.glyf[index]);
            font.index = index;
            currentEditor.setFont(font);
        });

        $('#editor-unitsperem').on('change', function () {
            let unitsPerEm = +$(this).val();
            currentEditor.setAxis({
                unitsPerEm
            });
        });

        $('#editor-bearing').on('change', function () {
            let opt = $(this).val();

            let setting = {
                1: {
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
