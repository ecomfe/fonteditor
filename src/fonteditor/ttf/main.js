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
        var program = require('../widget/program');
        var controller = require('../widget/controller/default');
        var ajaxBinaryFile = require('common/ajaxBinaryFile');

        var string = require('common/string');


        var setting = {
            'unicode': require('../dialog/setting-unicode'),
            'name': require('../dialog/setting-name'),
            'adjust': require('../dialog/setting-adjust'),
            'online': require('../dialog/font-online')
        }

        var actions = {

            // 新建
            'new': function() {
                if (program.ttfmanager.isChanged() && !window.confirm('是否放弃保存当前项目?')) {
                    return;
                }
                $.getJSON('./src/fonteditor/data/empty.json', function(imported) {
                    program.ttfmanager.set(imported);
                });
            },

            // 打开
            'open': function() {
                $('#font-import').click();
            },

            // 导入
            'import': function() {
                $('#font-import').click();
            },

            // 导出
            'export': function() {

            },

            // 导出文件
            'export-file': function(e) {
                if (program.ttfmanager.get()) {
                    var target = $(e.target);
                    exporter.export(program.ttfmanager.get(), {
                        type: target.attr('data-type'),
                        target: target
                    });
                }
            },

            // 保存项目
            'save': function() {
                if (program.ttfmanager.get()) {
                    var name = '';
                    if(name = window.prompt('请输入项目名称：')) {
                        name = string.encodeHTML(name);
                        var list = project.add(name, program.ttfmanager.get());
                        program.projectViewer.show(list);
                        program.data.projectName = name;
                        program.ttfmanager.setState('new');
                    }
                }
            },

            // 添加新字形
            'add-new': function() {
                program.ttfmanager.addGlyf({
                    name: '',
                    unicode:[]
                });
            },

            // 添加在线字形
            'add-online': function() {
                var dlg = new setting.online({
                    onChange: function(url) {
                        // 此处延迟处理
                        setTimeout(function(){
                            ajaxBinaryFile({
                                url: url,
                                onSuccess: function(buffer) {
                                    loader.load(buffer, {
                                        type: 'ttf',
                                        success: function(imported) {
                                            if (program.ttfmanager.get()) {
                                                program.ttfmanager.merge(imported, {
                                                    scale: true
                                                });
                                            }
                                            else {
                                                program.ttfmanager.set(imported);
                                            }

                                        }
                                    });
                                },
                                onError: function() {
                                    alert('加载文件错误!');
                                }
                            });
                        }, 20);
                    }
                });

                dlg.show();
            },

            // 设置unicode
            'setting-unicode': function() {
                var dlg = new setting.unicode({
                    onChange: function(unicode) {
                        // 此处延迟处理
                        setTimeout(function(){
                            if (program.ttfmanager.get()) {
                                var glyfList = program.viewer.getSelected();
                                program.ttfmanager.setUnicode(unicode, glyfList);
                            }
                        }, 20);
                    }
                });

                dlg.show();
            },

            // 设置字体名称
            'setting-name': function() {
                var ttf = program.ttfmanager.get();
                if (ttf) {
                    var dlg = new setting.name({
                        onChange: function(setting) {
                            program.ttfmanager.setName(setting);
                        }
                    });
                    dlg.show(ttf.name);
                }
            },

            // 调整字形
            'setting-adjust': function() {
                var ttf = program.ttfmanager.get();
                if (ttf) {
                    var dlg = new setting.adjust({
                        onChange: function(setting) {
                            setTimeout(function() {
                                program.ttfmanager.adjustGlyf(setting, selected);
                            }, 20);
                        }
                    });

                    // 如果仅选择一个字形，则填充现有值
                    var selected = program.viewer.getSelected();
                    if (selected.length === 1) {
                        var glyf = program.ttfmanager.getGlyf(selected)[0];
                        dlg.show({
                            leftSideBearing: glyf.leftSideBearing || '',
                            rightSideBearing: glyf.advanceWidth - glyf.xMax || ''
                        });
                    }
                    else {
                        dlg.show();
                    }
                }
            }
        };

        // 打开文件
        function onUpFile(e) {
            var file = e.target.files[0];

            if (program.action == 'open' && file.name.match(/(\.ttf|\.woff)$/i)) {
                loader.load(file, {
                    type: file.name.slice(file.name.lastIndexOf('.') + 1).toLowerCase(),
                    success: function(imported) {
                        program.ttfmanager.set(imported);
                    }
                });
            }
            else if (program.action == 'import' && file.name.match(/(\.ttf|\.woff|\.svg)$/i)) {
                if (program.ttfmanager.get()) {
                    loader.load(file, {
                        type: file.name.slice(file.name.lastIndexOf('.') + 1).toLowerCase(),
                        success: function(imported) {
                            if (imported.glyf.length) {
                                program.ttfmanager.merge(imported, {scale: true});
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

        // 绑定组件
        function bindEvent() {
            $('.navbar').delegate('[data-action]', 'click',  function(e) {
                var action = $(this).attr('data-action');
                if (actions[action]) {
                    program.action = action;
                    actions[action].call(this, e);
                }
            });

            $('#export-btn').on('mouseup', actions['export-file']);
            $('#export-btn-woff').on('mouseup', actions['export-file']);
            $('#export-btn-svg').on('mouseup', actions['export-file']);

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

                // 项目管理
                program.project = project;
                program.projectViewer = new ProjectViewer($('#project-list'));

                // ttf管理
                program.ttfmanager = new TTFManager();

                controller.init(program);

                // 加载项目
                program.projectViewer.show(project.items());
            }
        };

        entry.init();
        
        return entry;
    }
);