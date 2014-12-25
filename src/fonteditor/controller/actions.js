/**
 * @file actions.js
 * @author mengke01
 * @date
 * @description
 * 命令接口
 */


define(
    function(require) {
        var setting = require('../widget/setting');
        var program = require('../widget/program');
        var ajaxFile = require('common/ajaxFile');
        var string = require('common/string');
        var lang = require('common/lang');

        // 读取在线字体
        function readOnlineFont(type, url) {
            ajaxFile({
                type: type === 'svg' ? 'xml' : 'binary',
                url: url,
                onSuccess: function(buffer) {
                    program.loader.load(buffer, {
                        type: type || 'ttf',
                        success: function(imported) {
                            program.loading.hide();
                            if (program.ttfManager.get()) {
                                program.ttfManager.merge(imported, {
                                    scale: true
                                });
                            }
                            else {
                                program.ttfManager.set(imported);
                                program.data.projectId = null;
                            }

                        }
                    });
                },
                onError: function() {
                    alert('加载文件错误!');
                }
            });
        }

        var editorDelayFocus = setTimeout(function(){
            program.editor.focus();
        }, 20);

        var actions = {

            'undo': function() {
                if (program.editor.isEditing()) {
                    program.editor.undo();
                    editorDelayFocus();
                }
                else {
                    program.ttfManager.undo();
                }
            },

            'redo': function() {
                if (program.editor.isEditing()) {
                    program.editor.redo();
                    editorDelayFocus();
                }
                else {
                    program.ttfManager.redo();
                }
            },

            // 新建
            'new': function() {
                if (program.ttfManager.isChanged() && !window.confirm('是否放弃保存当前编辑的项目?')) {
                    return;
                }

                $.getJSON('./font/empty.json', function(imported) {
                    program.ttfManager.set(imported);
                    program.data.projectId = null;
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
            'export': function(e) {
                if (!e.target.getAttribute('download')) {
                    e.preventDefault();
                }
            },

            // 导出文件
            'export-file': function(e) {
                if (program.ttfManager.get()) {
                    var target = $(e.target);
                    program.exporter['export'](program.ttfManager.get(), {
                        type: target.attr('data-type'),
                        target: target,
                        originEvent: e,
                        error: function() {
                            e.preventDefault();
                        }
                    });
                }
            },

            // 保存项目
            'save': function() {
                if (program.ttfManager.get()) {
                    if (program.data.projectId) {

                        program.project.update(program.data.projectId, program.ttfManager.get());
                        program.ttfManager.setState('saved');
                        program.loading.show('保存成功..', 400);

                    }
                    else {
                        var name = program.ttfManager.get().name.fontFamily || '';
                        if ((name = window.prompt('请输入项目名称：', name))) {

                            name = string.encodeHTML(name);

                            var id = program.project.add(name, program.ttfManager.get());
                            program.data.projectId = id;

                            program.ttfManager.setState('new');

                            program.projectViewer.show(program.project.items());
                            program.projectViewer.select(id);
                            program.loading.show('保存成功..', 400);

                        }
                    }
                }
            },

            // 添加新字形
            'add-new': function() {
                if (program.ttfManager.get()) {
                    var selected = program.viewer.getSelected();
                    program.ttfManager.insertGlyf({}, selected[0]);
                }
            },

            // 添加在线字形
            'add-online': function() {
                var dlg = new setting.online({
                    onChange: function(url) {

                        // 此处延迟处理
                        setTimeout(function(){
                            program.loading.show('正在加载..', 1000);
                            var type = url.slice(url.lastIndexOf('.') + 1);
                            var fontUrl = url;

                            if (/^https?:\/\//i.test(url)) {
                                fontUrl = string.format(program.fontUrl, [encodeURIComponent(url)]);
                            }

                            readOnlineFont(type, fontUrl);

                        }, 20);
                    }
                });

                dlg.show();
            },

            // 线上地址
            'add-url': function() {
                    var dlg = new setting.url({
                        onChange: function(url) {

                            // 此处延迟处理
                            setTimeout(function(){
                                program.loading.show('正在加载..', 1000);
                                var fontUrl = string.format(program.fontUrl, [encodeURIComponent(url)]);
                                readOnlineFont(url.slice(url.lastIndexOf('.') + 1), fontUrl);
                            }, 20);
                        }
                    });

                    dlg.show();
            },

            // 预览
            'preview': function(e) {
                var ttf = program.ttfManager.get();
                if (ttf) {
                    var format = e.target.getAttribute('data-format');
                    program.previewer.load(ttf, format);
                }
            },

            // 设置字体名称
            'setting-name': function() {
                var ttf = program.ttfManager.get();
                if (ttf) {
                    var dlg = new setting.name({
                        onChange: function(setting) {
                            program.ttfManager.setInfo(setting);
                        }
                    });
                    dlg.show($.extend({}, ttf.head, ttf.name));
                }
            },

            // 调整规格
            'setting-metrics': function() {
                var ttf = program.ttfManager.get();
                if (ttf) {
                    var dlg = new setting['metrics']({
                        onChange: function(setting) {
                            program.ttfManager.setMetrics(setting);
                        }
                    });

                    dlg.show($.extend({}, ttf['OS/2'], ttf.hhea, ttf.post));
                }
            },

            // 设置字型名称
            'setting-glyf-name': function() {
                var ttf = program.ttfManager.get();
                if (ttf) {
                    if (window.confirm('生成的字形名称会覆盖原来的名称，确定生成？')) {
                        program.ttfManager.genGlyfName(program.viewer.getSelected());
                    }
                }
            },

            // 设置
            'setting-editor': function(e) {
                var dlg = new setting.editor({
                    onChange: function(setting) {
                        program.setting.set('editor', setting, setting.saveSetting);
                        setTimeout(function() {
                            program.viewer.setSetting(setting.viewer);
                            program.editor.setSetting(setting.editor);
                        }, 20);
                    }
                });
                dlg.show(program.setting.get('editor'));
            }
        };

        return actions;
    }
);
