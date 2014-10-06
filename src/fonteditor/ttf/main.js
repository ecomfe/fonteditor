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
        var TTFManager = require('../widget/ttfmanager');
        var program = require('../program');
        var string = require('common/string');
        
        var setting = {
            'unicode': require('../dialog/setting-unicode')
        }

        var actions = {
            'new': function() {
                if (program.ttfmanager.get() && !window.confirm('是否放弃保存当前项目?')) {
                    return;
                }
                newEmpty();
            },
            'open': function() {
                $('#font-import').click();
            },

            'import': function() {
                $('#font-import').click();
            },

            'export': function() {
            },

            'save': function() {
                saveProj();
            },

            'add-new': function() {
                program.ttfmanager.addglyf({
                    name: '',
                    unicode:[]
                });
            },

            'setting-unicode': function(e) {
                var dlg = new setting.unicode();

                dlg.on('change', function(e) {
                    // 此处延迟处理
                    setTimeout(function(){
                        setUnicode(e.unicode);
                    }, 20);
                });

                dlg.show();
            }
        };

        // 设置unicode
        function setUnicode(unicode) {
            if (program.ttfmanager.get()) {
                var glyfList = program.viewer.getSelected();
                program.ttfmanager.setUnicode(unicode, glyfList);
            }

        }

        // 保存项目
        function saveProj() {
            if (program.ttfmanager.get()) {
                var name = '';
                if(name = window.prompt('请输入项目名称：')) {
                    var list = project.add(string.encodeHTML(name), program.ttfmanager.get());
                    program.projectViewer.show(list);
                }
            }
        }

        // 新建空白
        function newEmpty() {
            $.getJSON('./src/fonteditor/data/empty.json', function(imported) {
                program.ttfmanager.set(imported);
            })
        }

        // 打开文件
        function onUpFile(e) {
            var file = e.target.files[0];

            if (program.action == 'open' && file.name.match(/(\.ttf|\.woff)$/)) {
                loader.load(file, {
                    type: file.name.slice(file.name.lastIndexOf('.') + 1),
                    success: function(imported) {
                        program.ttfmanager.set(imported);
                    }
                });
            }
            else if (program.action == 'import' && file.name.match(/(\.ttf|\.woff|\.svg)$/)) {
                if (program.ttfmanager.get()) {
                    loader.load(file, {
                        type: file.name.slice(file.name.lastIndexOf('.') + 1),
                        success: function(imported) {
                            if (imported.glyf.length) {
                                program.ttfmanager.combine(imported, {scale: true});
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
            if (program.ttfmanager.get()) {
                var target = $(e.target);
                exporter.export(program.ttfmanager.get(), {
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

                // 查看器
                program.viewer = new GLYFViewer($('#glyf-list'));
                program.viewer.on('del', function(e) {
                    if (e.list) {
                        program.ttfmanager.delglyf(e.list);
                    }
                });


                // 项目管理
                program.projectViewer = new ProjectViewer($('#project-list'));
                program.projectViewer.on('open', function(e) {
                    var imported = project.get(e.projectName);
                    if (imported) {
                        if (program.ttfmanager.get() && !window.confirm('是否放弃保存当前项目?')) {
                            return;
                        }
                        program.ttfmanager.set(imported);
                    }
                });
                program.projectViewer.on('del', function(e) {
                    if (e.projectName && window.confirm('是否删除项目?')) {
                        program.projectViewer.show(project.remove(e.projectName));
                    }
                });
                program.projectViewer.show(project.items());

                // ttf管理
                program.ttfmanager = new TTFManager();
                program.ttfmanager.on('change', function(e) {
                    program.viewer.show(e.ttf);
                });

            }
        };

        entry.init();
        
        return entry;
    }
);