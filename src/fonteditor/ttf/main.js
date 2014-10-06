/**
 * @file main.js
 * @author mengke01
 * @date 
 * @description
 * ttf管理器
 */

define(
    function(require) {

        var GLYFViewer = require('../widget/glyfviewer');
        var loader = require('../widget/loader');
        var exporter = require('../widget/exporter');
        var project = require('../widget/project');
        var ProjectViewer = require('../widget/projectviewer');
        var ttfmanager = require('../widget/ttfmanager');
        var program = require('../program');
        var string = require('common/string');
        
        var actions = {
            new: function() {
                if (program.data.ttf && !window.confirm('是否放弃保存当前项目?')) {
                    return;
                }
                newEmpty();
            },            
            open: function() {
                $('#font-import').click();
            },
            import: function() {
                $('#font-import').click();
            },
            export: function() {
            },
            save: function() {
                saveProj();
            }
        };


        // 保存项目
        function saveProj() {
            if (program.data.ttf) {
                var name = '';
                if(name = window.prompt('请输入项目名称：')) {
                    var list = project.add(string.encodeHTML(name), program.data.ttf);
                    program.projectViewer.show(list);
                }
            }
        }

        // 新建空白
        function newEmpty() {
            $.getJSON('./src/fonteditor/data/empty.json', function(imported) {
                program.data.ttf = imported;
                program.viewer.show(imported);
            })
        }

        // 打开文件
        function onUpFile(e) {
            var file = e.target.files[0];

            if (program.action == 'open' && file.name.match(/(\.ttf|\.woff)$/)) {
                program.data.file = file.name;
                loader.load(file, {
                    type: file.name.slice(file.name.lastIndexOf('.') + 1),
                    success: function(imported) {
                        program.data.ttf = imported;
                        program.viewer.show(imported);
                    }
                });
            }
            else if (program.action == 'import' && file.name.match(/(\.ttf|\.woff|\.svg)$/)) {
                if (program.data.ttf) {
                    loader.load(file, {
                        type: file.name.slice(file.name.lastIndexOf('.') + 1),
                        success: function(imported) {
                            if (imported.glyf.length) {
                                ttfmanager.combine(program.data.ttf, imported, {scale: true});
                                program.viewer.show(program.data.ttf);
                            }
                        }
                    });
                }
            }
            else {
                alert('无法识别文件类型!');
            }

            e.target.value = '';
        }

        function exportFile(e) {
            var ttf = program.data.ttf;
            if (ttf) {
                var target = $(e.target);
                exporter.export(ttf, {
                    type: target.attr('data-type'),
                    target: target
                });
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

            $('#export-btn').on('mouseup', exportFile);
            $('#export-btn-woff').on('mouseup', exportFile);
            $('#export-btn-svg').on('mouseup', exportFile);

            document.getElementById('font-import').addEventListener('change', onUpFile);
        }

        var entry = {

            /**
             * 初始化
             */
            init: function () {
                bindEvent();

                program.viewer = new GLYFViewer($('#glyf-list'));

                program.projectViewer = new ProjectViewer($('#project-list'));
                program.projectViewer.on('open', function(e) {
                    var imported = project.get(e.projectName);
                    if (imported) {
                        if (program.data.ttf && !window.confirm('是否放弃保存当前项目?')) {
                            return;
                        }
                        program.data.ttf = imported;
                        program.viewer.show(imported);
                    }
                });
                program.projectViewer.show(project.items());

            }
        };

        entry.init();
        
        return entry;
    }
);