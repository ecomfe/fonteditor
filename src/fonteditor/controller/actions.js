/**
 * @file actions.js
 * @author mengke01
 * @date
 * @description
 * 命令接口
 */


define(
    function (require) {
        var settingSupport = require('../dialog/support');
        var program = require('../widget/program');
        var ajaxFile = require('common/ajaxFile');
        var string = require('common/string');
        var lang = require('common/lang');
        var glyfAdjust = require('ttf/util/glyfAdjust');
        var getEmptyttfObject = require('ttf/getEmptyttfObject');

        /**
         * 读取在线字体
         *
         * @param {string} type 类型 svg or binary
         * @param {string} url 文件地址
         */
        function readOnlineFont(type, url) {
            ajaxFile({
                type: type === 'svg' ? 'xml' : 'binary',
                url: url,
                onSuccess: function (buffer) {
                    program.loader.load(buffer, {
                        type: type || 'ttf',
                        success: function (imported) {
                            program.loading.hide();
                            if (program.ttfManager.get()) {
                                program.ttfManager.merge(imported, {
                                    scale: true,
                                    adjustGlyf: imported.from === 'svg' ? true : false
                                });
                            }
                            else {
                                program.ttfManager.set(imported);
                                program.data.projectId = null;
                            }

                        }
                    });
                },
                onError: function () {
                    alert('加载文件错误!');
                }
            });
        }

        // 延迟focus editor
        var editorDelayFocus = lang.debounce(function () {
            program.editor.focus();
        }, 20);

        // 延迟同步选项
        var fontDelaySync = lang.debounce(function (projectId, ttf, syncConfig) {
            program.loading.show('正在同步...', 4000);
            program.sync.addTask(projectId, ttf, syncConfig).then(function (reason) {
                program.loading.show('同步成功...', 400);
            }, function (reason) {
                program.loading.show('同步失败：' + reason.statusInfo + '...', 400);
            });
        }, 500);

        var actions = {

            'undo': function () {
                if (program.editor.isEditing()) {
                    program.editor.undo();
                    editorDelayFocus();
                }
                else {
                    program.ttfManager.undo();
                }
            },

            'redo': function () {
                if (program.editor.isEditing()) {
                    program.editor.redo();
                    editorDelayFocus();
                }
                else {
                    program.ttfManager.redo();
                }
            },

            'new': function () {
                if (program.ttfManager.isChanged() && !window.confirm('是否放弃保存当前编辑的项目?')) {
                    return;
                }
                program.ttfManager.set(getEmptyttfObject());
                program.data.projectId = null;
                // 建立项目 提示保存
                actions.save();
            },

            'open': function () {
                $('#font-import').click();
            },

            'import': function () {
                $('#font-import').click();
            },

            'export': function (e) {
                if (!e.target.getAttribute('download')) {
                    e.preventDefault();
                }
            },

            'export-file': function (e) {
                if (program.ttfManager.get()) {
                    var target = $(e.target);
                    program.exporter.export(program.ttfManager.get(), {
                        type: target.attr('data-type'),
                        target: target,
                        originEvent: e,
                        error: function () {
                            e.preventDefault();
                        }
                    });
                }
            },

            'sync': function (projectId, ttf, syncConfig) {
                syncConfig = syncConfig || program.project.getConfig(projectId).sync;
                if (syncConfig) {
                    fontDelaySync(program.data.projectId, ttf, syncConfig);
                }
            },

            'save': function () {
                if (program.ttfManager.get()) {
                    var projectId = program.data.projectId;
                    if (projectId) {
                        program.project.update(projectId, program.ttfManager.get())
                        .then(function () {
                            program.ttfManager.setState('saved');
                            program.loading.show('保存成功...', 400);
                            var syncConfig = program.project.getConfig(projectId).sync;
                            if (syncConfig && syncConfig.autoSync) {
                                actions.sync(projectId, program.ttfManager.get(), syncConfig);
                            }
                        }, function () {
                            program.loading.show('保存失败...', 1000);
                        });

                    }
                    else {
                        var name = program.ttfManager.get().name.fontFamily || '';
                        if ((name = window.prompt('请输入项目名称：', name))) {

                            name = string.encodeHTML(name);
                            program.project.add(name, program.ttfManager.get())
                            .then(function (id) {
                                program.data.projectId = id;
                                program.ttfManager.setState('new');
                                program.projectViewer.show(program.project.items(), id);
                                program.loading.show('保存成功...', 400);

                            }, function () {
                                program.loading.show('保存失败...', 400);
                            });
                        }
                    }
                }
            },

            'add-new': function () {
                if (program.ttfManager.get()) {
                    var selected = program.viewer.getSelected();
                    program.ttfManager.insertGlyf({}, selected[0]);
                }
                else {
                    // 没有项目 先建立一个项目
                    actions.new();
                }
            },

            'add-online': function () {
                var SettingOnline = settingSupport.online;
                !new SettingOnline({
                    onChange: function (url) {

                        program.loading.show('正在加载..', 1000);
                        // 此处延迟处理
                        setTimeout(function () {
                            var type = url.slice(url.lastIndexOf('.') + 1);
                            var fontUrl = url;

                            if (/^https?:\/\//i.test(url)) {
                                fontUrl = string.format(program.readOnline, ['font', encodeURIComponent(url)]);
                            }

                            readOnlineFont(type, fontUrl);

                        }, 20);
                    }
                }).show();
            },

            'add-url': function () {
                var SettingUrl = settingSupport.url;
                !new SettingUrl({
                    onChange: function (url) {
                        program.loading.show('正在加载..', 1000);
                        // 此处延迟处理
                        setTimeout(function () {
                            var fontUrl = string.format(program.readOnline, ['font', encodeURIComponent(url)]);
                            readOnlineFont(url.slice(url.lastIndexOf('.') + 1), fontUrl);
                        }, 20);
                    }
                }).show();
            },

            'preview': function (e) {
                var ttf = program.ttfManager.get();
                if (ttf) {
                    var format = e.target.getAttribute('data-format');
                    program.previewer.load(ttf, format);
                }
            },

            'setting-name': function () {
                var ttf = program.ttfManager.get();
                if (ttf) {
                    var SettingName = settingSupport.name;
                    !new SettingName({
                        onChange: function (setting) {
                            program.ttfManager.setInfo(setting);
                        }
                    }).show($.extend({}, ttf.head, ttf.name));
                }
            },

            'setting-metrics': function () {
                var ttf = program.ttfManager.get();
                if (ttf) {
                    var SettingMetrics = settingSupport.metrics;
                    !new SettingMetrics({
                        onChange: function (setting) {
                            program.ttfManager.setMetrics(setting);
                        }
                    }).show($.extend({}, ttf['OS/2'], ttf.hhea, ttf.post));
                }
            },

            'setting-glyf-name': function () {
                var ttf = program.ttfManager.get();
                if (ttf) {
                    if (window.confirm('生成的字形名称会覆盖原来的名称，确定生成？')) {
                        program.ttfManager.genGlyfName(program.viewer.getSelected());
                    }
                }
            },

            'setting-glyf-clearname': function () {
                var ttf = program.ttfManager.get();
                if (ttf) {
                    program.ttfManager.clearGlyfName(program.viewer.getSelected());
                }
            },

            'setting-editor': function () {
                var SettingEditor = settingSupport.editor;
                !new SettingEditor({
                    onChange: function (setting) {
                        program.setting.set('editor', setting, setting.saveSetting);
                        setTimeout(function () {
                            program.viewer.setSetting(setting.viewer);
                            program.editor.setSetting(setting.editor);
                        }, 20);
                    }
                }).show(program.setting.get('editor'));
            },

            'import-pic': function () {
                var SettingEditor = settingSupport['import-pic'];
                if (program.ttfManager.get()) {
                    !new SettingEditor({
                        onChange: function (setting) {
                            if (setting.contours) {

                                if (program.editor.isVisible()) {
                                    program.editor.execCommand('addcontours', setting.contours, {
                                        scale: 1,
                                        selected: true
                                    });
                                    editorDelayFocus();
                                }
                                else {
                                    var selected = program.viewer.getSelected();
                                    program.ttfManager.insertGlyf(glyfAdjust({
                                        contours: setting.contours
                                    }, 1, 1, 0, 0, false), selected[0]);
                                }
                            }
                        }
                    }).show();
                }
            },

            'setting-import-and-export': function () {
                var SettingEditor = settingSupport.ie;
                !new SettingEditor({
                    onChange: function (setting) {
                        program.setting.set('ie', setting, setting.saveSetting);
                    }
                }).show(program.setting.get('ie'));
            }
        };

        return actions;
    }
);
