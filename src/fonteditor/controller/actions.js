/**
 * @file FontEditor 命令相关操作
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {
        var i18n = require('../i18n/i18n');
        var settingSupport = require('../dialog/support');
        var program = require('../widget/program');
        var ajaxFile = require('common/ajaxFile');
        var string = require('common/string');
        var lang = require('common/lang');
        var glyfAdjust = require('fonteditor-core/ttf/util/glyfAdjust');
        var getEmptyttfObject = require('fonteditor-core/ttf/getEmptyttfObject');

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
                            program.ttfManager.set(imported);
                            program.data.projectId = null;
                            program.projectViewer.unSelect();
                        }
                    });
                },
                onError: function () {
                    alert(i18n.lang.msg_read_file_error);
                }
            });
        }

        // 延迟focus editor
        var editorDelayFocus = lang.debounce(function () {
            program.editor.focus();
        }, 20);

        // 延迟同步函数
        var fontDelaySync = lang.debounce(function (options) {
            program.loading.show(i18n.lang.msg_syncing, 4000);

            program.sync.addTask(options).then(function (data) {
                if (options.newProject && data && data.newData) {
                    actions['new']({
                        ttf: data.newData,
                        config: {
                            sync: options.config
                        }
                    });
                }
                else if (options.type === 'push' && data && data.newData) {
                    program.ttfManager.ttf.set(data.newData);
                    program.ttfManager.fireChange(true);
                    program.project.update(options.projectId, data.newData).then(function () {
                        program.ttfManager.setState('saved');
                    });
                }
                program.loading.show(i18n.lang.msg_sync_success, 400);
            }, function (data) {
                if (options.newProject && data.status === 0x1) {
                    alert(i18n.lang.msg_error_sync_font);
                }

                data.reason && console.warn(data.reason);
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

            'new': function (options) {
                if (program.ttfManager.isChanged() && !window.confirm(i18n.lang.msg_confirm_save_proj)) {
                    return;
                }
                program.ttfManager.set((options && options.ttf) || getEmptyttfObject());
                program.data.projectId = null;

                // 建立项目 提示保存
                actions.save(options);
            },

            'open': function () {
                $('#font-import').click();
            },

            'import': function () {
                if (program.ttfManager.get()) {
                    $('#font-import').click();
                }
            },

            'export': function (e) {
                if (program.ttfManager.get()) {
                    var target = $(e.target);
                    program.exporter.export(program.ttfManager.get(), {
                        type: target.attr('data-type'),
                        error: function (ev) {
                            program.fire('font-error', ev);
                        }
                    });
                }
            },

            'sync-from-server': function () {
                var SettingSync = settingSupport.sync;
                // 从服务器同步字体
                !new SettingSync({
                    onChange: function (setting) {
                        setting.timestamp = -1; // 配置强制拉取
                        fontDelaySync({
                            type: 'pull',
                            newProject: 1,
                            config: setting
                        });
                    }
                }).show({
                    newProject: 1
                });
            },

            'sync': function (projectId, ttf, config) {
                // 推送字体
                fontDelaySync({
                    type: 'push',
                    projectId: projectId,
                    ttf: ttf,
                    config: config
                });
            },
            'dosync': function (projectId) {
                var syncConfig = program.project.getConfig(projectId).sync;
                if (syncConfig && syncConfig.autoSync) {
                    actions.sync(projectId, program.ttfManager.get(), syncConfig);
                }
            },
            'save': function (options) {
                if (program.ttfManager.get()) {
                    // 已经保存过的项目
                    var projectId = program.data.projectId;
                    if (projectId) {
                        program.project.update(projectId, program.ttfManager.get())
                        .then(function () {
                            program.ttfManager.setState('saved');
                            program.loading.show(i18n.lang.msg_save_success, 400);
                            actions['dosync'](projectId);
                        }, function () {
                            program.loading.show(i18n.lang.msg_save_failed, 1000);
                        });

                    }
                    // 未保存的项目
                    else {
                        var name = program.ttfManager.get().name.fontFamily || '';
                        if ((name = window.prompt(i18n.lang.msg_input_proj_name, name))) {
                            name = string.encodeHTML(name);
                            options = options || {};
                            program.project.add(
                                name,
                                options.ttf || program.ttfManager.get(),
                                options.config
                            ).then(function (id) {
                                program.data.projectId = id;
                                program.ttfManager.setState('new');
                                program.projectViewer.show(program.project.items(), id);
                                program.loading.show(i18n.lang.msg_save_success, 400);

                            }, function () {
                                program.loading.show(i18n.lang.msg_save_failed, 400);
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
                        if (program.ttfManager.isChanged() && !window.confirm(i18n.lang.msg_confirm_save_proj)) {
                            return;
                        }

                        program.loading.show(i18n.lang.msg_loading, 1000);
                        // 此处延迟处理
                        setTimeout(function () {
                            var type = url.slice(url.lastIndexOf('.') + 1);
                            var fontUrl = url;

                            if (/^https?:\/\//i.test(url)) {
                                fontUrl = string.format(program.config.readOnline, ['font', encodeURIComponent(url)]);
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
                        if (program.ttfManager.isChanged() && !window.confirm(i18n.lang.msg_confirm_save_proj)) {
                            return;
                        }

                        program.loading.show(i18n.lang.msg_loading, 1000);
                        // 此处延迟处理
                        setTimeout(function () {
                            var fontUrl = string.format(program.config.readOnline, ['font', encodeURIComponent(url)]);
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
                if (program.ttfManager.get()) {
                    if (window.confirm(i18n.lang.msg_confirm_gen_names)) {
                        program.ttfManager.genGlyfName(program.viewer.getSelected());
                    }
                }
            },

            'setting-glyf-clearname': function () {
                if (program.ttfManager.get()) {
                    program.ttfManager.clearGlyfName(program.viewer.getSelected());
                }
            },

            'setting-optimize': function () {
                if (program.ttfManager.get()) {
                    var result = program.ttfManager.optimize();
                    if (true !== result) {
                        if (result.repeat) {
                            program.fire('font-error', {
                                number: 10200,
                                data: result.repeat
                            });
                        }
                        alert(result.message);
                    }
                }
            },

            'setting-sort': function () {
                if (program.ttfManager.get()) {
                    var result = program.ttfManager.sortGlyf();
                    if (true !== result) {
                        alert(result.message);
                    }
                }
            },

            'setting-compound2simple': function () {
                if (program.ttfManager.get()) {
                    program.ttfManager.compound2simple(program.viewer.getSelected());
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
