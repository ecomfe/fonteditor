/**
 * @file main.js
 * @author mengke01
 * @date 
 * @description
 * ttf管理器
 */

define(
    function(require) {

        var program = require('../program');
        var TTFReader = require('ttf/ttfreader');
        var contours2svg = require('ttf/util/contours2svg');
        var svg2ttfobject = require('ttf/svg2ttfobject');
        var string = require('common/string');
        var pathAdjust = require('graphics/pathAdjust');
        var TTFWriter = require('ttf/ttfwriter');
        var ttf2woff = require('ttf/ttf2woff');
        var ttf2base64 = require('ttf/ttf2base64');
        var woff2base64 = require('ttf/woff2base64');


        var GLYF_ITEM_TPL = ''
            + '<div class="glyf-item ${modify}">'
            +   '<svg class="glyf" viewbox="0 0 ${unitsPerEm} ${unitsPerEm}"><g transform="scale(1, -1) translate(0, -${descent}) scale(0.95, 0.95) "><path class="path" ${d}/></g></svg>'
            +   '<div class="unicode" title="${unicode}">${unicode}</div><div class="name" title="${name}">${name}</div>'
            + '</div>';

        var actions = {
            open: function() {
                $('#font-import').click();
            },
            svg: function() {
                $('#font-import').click();
            },
            export: function() {
                $(this).attr('href', '#');
            }
        };

        // 显示glyf
        function showGLYF(ttf) {
            var unitsPerEm = ttf.head.unitsPerEm;
            var descent = unitsPerEm + ttf.hhea.descent;
            var glyfStr = '';
            ttf.glyf.forEach(function(glyf) {
                var g = {
                    modify: glyf.modify,
                    unitsPerEm: unitsPerEm,
                    descent: descent,
                    unicode: (glyf.unicode || []).map(function(u) {
                        return '$' + u.toString(16).toUpperCase();
                    }).join(','),
                    name: glyf.name,
                    d: glyf.contours && glyf.contours.length ? 'd="'+ contours2svg(glyf.contours) +'"': ''
                };
                glyfStr += string.format(GLYF_ITEM_TPL, g);
            });

            $('#glyf-list').get(0).innerHTML = glyfStr;
        }

        // 加载ttf
        function loadTTF(file) {
            program.loading.show();
            var fileReader = new FileReader();
            fileReader.onload = function(e) {
                var buffer = e.target.result;
                var ttfReader = new TTFReader();
                program.data.ttf = ttfReader.read(buffer);
                showGLYF(program.data.ttf);
                ttfReader.dispose();
                fileReader = null;
                program.loading.hide();
            }

            fileReader.onerror = function(e) {
                program.loading.hide();
                alert('读取文件出错!');
                fileReader = null;
            };
            fileReader.readAsArrayBuffer(file);
        }

        // 加载svg
        function loadSVG(file) {
            program.loading.show();
            var fileReader = new FileReader();
            fileReader.onload = function(e) {
                var buffer = e.target.result;
                var imported = svg2ttfobject(buffer);
                var ttf = program.data.ttf;
                var scale = 1;

                // 对导入的轮廓进行缩放处理
                if (imported.head.unitsPerEm && imported.head.unitsPerEm != ttf.head.unitsPerEm) {
                    scale = ttf.head.unitsPerEm / imported.head.unitsPerEm;
                }

                imported.glyf.forEach(function(g) {
                    if (g.contours && g.contours.length) {
                        if (scale !== 1) {
                            g.contours.forEach(function(contour) {
                                pathAdjust(contour, scale, scale);
                            });
                        }
                        g.modify = 'new';
                        ttf.glyf.push(g);
                    }
                });

                showGLYF(program.data.ttf);
                fileReader = null;
                program.loading.hide();
            }

            fileReader.onerror = function(e) {
                program.loading.hide();
                alert('读取文件出错!');
                fileReader = null;
            };
            fileReader.readAsText(file);
        }

        // 打开文件
        function onUpFile(e) {
            var file = e.target.files[0];

            if (program.action == 'open' && file.name.match(/\.ttf$/)) {
                program.data.file = file.name;
                loadTTF(file);
            }
            else if (program.action == 'svg' && file.name.match(/\.svg$/)) {
                if (program.data.ttf) {
                    loadSVG(file);
                }
                else {
                    alert('没有要编辑的文件!');
                }
            }
            else {
                alert('无法识别文件类型!');
            }
            e.target.value = '';
        }

        function exportTTF(e) {
            var ttf = program.data.ttf;
            if (ttf) {
                var buffer = new TTFWriter().write(ttf);
                e.target.download = (ttf.name.fontFamily || 'export') + '.ttf';
                e.target.href = ttf2base64(buffer);
            }
        }

        function exportWOFF(e) {
            var ttf = program.data.ttf;
            if (ttf) {
                var buffer = ttf2woff(new TTFWriter().write(ttf));
                e.target.download = (ttf.name.fontFamily || 'export') + '.woff';
                e.target.href = ttf2base64(buffer);
            } 
        }

        // 绑定组件
        function bindEvent() {
            $('.navbar').delegate('[data-action]', 'click',  function(e) {
                var action = $(this).attr('data-action');
                if (actions[action]) {
                    program.action = action;
                    actions[action].call(this, e);
                }
            });

            $('#export-btn').on('mouseup', exportTTF);
            $('#export-btn-woff').on('mouseup', exportWOFF);

            document.getElementById('font-import').addEventListener('change', onUpFile);
        }

        var entry = {

            /**
             * 初始化
             */
            init: function () {
                bindEvent();
            }
        };

        entry.init();
        
        return entry;
    }
);