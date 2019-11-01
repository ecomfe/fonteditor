/**
 * @file FontEditor 命令相关操作
 * @author mengke01(kekee000@gmail.com)
 */

import i18n from '../i18n/i18n';
import settingSupport from '../dialog/support';
import program from '../widget/program';
import ajaxFile from 'common/ajaxFile';
import string from 'common/string';
import lang from 'common/lang';
import glyfAdjust from 'fonteditor-core/ttf/util/glyfAdjust';
import getEmptyttfObject from 'fonteditor-core/ttf/getEmptyttfObject';

let actions = null;

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
        onSuccess(buffer) {
            program.loader.load(buffer, {
                type: type || 'ttf',
                success(imported) {
                    program.loading.hide();
                    program.ttfManager.set(imported);
                    program.data.projectId = null;
                    program.projectViewer.unSelect();
                }
            });
        },
        onError() {
            alert(i18n.lang.msg_read_file_error);
        }
    });
}

// 延迟focus editor
const editorDelayFocus = lang.debounce(function () {
    program.editor.focus();
}, 20);

// 延迟同步函数
const fontDelaySync = lang.debounce(function (options) {
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

actions = {

    'undo'() {
        if (program.editor.isEditing()) {
            program.editor.undo();
            editorDelayFocus();
        }
        else {
            program.ttfManager.undo();
        }
    },

    'redo'() {
        if (program.editor.isEditing()) {
            program.editor.redo();
            editorDelayFocus();
        }
        else {
            program.ttfManager.redo();
        }
    },

    'new'(options) {
        if (program.ttfManager.isChanged() && !window.confirm(i18n.lang.msg_confirm_save_proj)) {
            return;
        }
        program.ttfManager.set((options && options.ttf) || getEmptyttfObject());
        program.data.projectId = null;

        // 建立项目 提示保存
        actions.save(options);
    },

    'open'() {
        $('#font-import').click();
    },

    'import'() {
        if (program.ttfManager.get()) {
            $('#font-import').click();
        }
    },

    'export'(e) {
        if (program.ttfManager.get()) {
            let target = $(e.target);
            program.exporter.export(program.ttfManager.get(), {
                type: target.attr('data-type'),
                error(ev) {
                    program.fire('font-error', ev);
                }
            });
        }
    },

    'sync-from-server'() {
        let SettingSync = settingSupport.sync;
        // 从服务器同步字体
        !new SettingSync({
            onChange(setting) {
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

    'sync'(projectId, ttf, config) {
        // 推送字体
        fontDelaySync({
            type: 'push',
            projectId: projectId,
            ttf: ttf,
            config: config
        });
    },
    'dosync'(projectId) {
        let syncConfig = program.project.getConfig(projectId).sync;
        if (syncConfig && syncConfig.autoSync) {
            actions.sync(projectId, program.ttfManager.get(), syncConfig);
        }
    },
    'save'(options) {
        if (program.ttfManager.get()) {
            // 已经保存过的项目
            let projectId = program.data.projectId;
            if (projectId) {
                program.project.update(projectId, program.ttfManager.get())
                .then(function () {
                    program.ttfManager.setState('saved');
                    program.loading.show(i18n.lang.msg_save_success, 400);
                    actions.dosync(projectId);
                }, function () {
                    program.loading.show(i18n.lang.msg_save_failed, 1000);
                });

            }
            // 未保存的项目
            else {
                let name = program.ttfManager.get().name.fontFamily || '';
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

    'add-new'() {
        if (program.ttfManager.get()) {
            let selected = program.viewer.getSelected();
            program.ttfManager.insertGlyf({}, selected[0]);
        }
        else {
            // 没有项目 先建立一个项目
            actions.new();
        }
    },

    'add-online'() {
        let SettingOnline = settingSupport.online;
        !new SettingOnline({
            onChange(url) {
                if (program.ttfManager.isChanged() && !window.confirm(i18n.lang.msg_confirm_save_proj)) {
                    return;
                }

                program.loading.show(i18n.lang.msg_loading, 1000);
                // 此处延迟处理
                setTimeout(function () {
                    let type = url.slice(url.lastIndexOf('.') + 1);
                    let fontUrl = url;

                    if (/^https?:\/\//i.test(url)) {
                        fontUrl = string.format(program.config.readOnline, ['font', encodeURIComponent(url)]);
                    }
                    readOnlineFont(type, fontUrl);
                }, 20);
            }
        }).show();
    },

    'add-url'() {
        let SettingUrl = settingSupport.url;
        !new SettingUrl({
            onChange(url) {
                if (program.ttfManager.isChanged() && !window.confirm(i18n.lang.msg_confirm_save_proj)) {
                    return;
                }

                program.loading.show(i18n.lang.msg_loading, 1000);
                // 此处延迟处理
                setTimeout(function () {
                    let fontUrl = string.format(program.config.readOnline, ['font', encodeURIComponent(url)]);
                    readOnlineFont(url.slice(url.lastIndexOf('.') + 1), fontUrl);
                }, 20);
            }
        }).show();
    },

    'preview'(e) {
        let ttf = program.ttfManager.get();
        if (ttf) {
            let format = e.target.getAttribute('data-format');
            program.previewer.load(ttf, format);
        }
    },

    'setting-name'() {
        let ttf = program.ttfManager.get();
        if (ttf) {
            let SettingName = settingSupport.name;
            !new SettingName({
                onChange(setting) {
                    program.ttfManager.setInfo(setting);
                }
            }).show($.extend({}, ttf.head, ttf.name));
        }
    },

    'setting-metrics'() {
        let ttf = program.ttfManager.get();
        if (ttf) {
            let SettingMetrics = settingSupport.metrics;
            !new SettingMetrics({
                onChange(setting) {
                    program.ttfManager.setMetrics(setting);
                }
            }).show($.extend({}, ttf['OS/2'], ttf.hhea, ttf.post));
        }
    },

    'setting-glyf-name'() {
        if (program.ttfManager.get()) {
            if (window.confirm(i18n.lang.msg_confirm_gen_names)) {
                program.ttfManager.genGlyfName(program.viewer.getSelected());
            }
        }
    },

    'setting-glyf-clearname'() {
        if (program.ttfManager.get()) {
            program.ttfManager.clearGlyfName(program.viewer.getSelected());
        }
    },

    'setting-optimize'() {
        if (program.ttfManager.get()) {
            let result = program.ttfManager.optimize();
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

    'setting-sort'() {
        if (program.ttfManager.get()) {
            let result = program.ttfManager.sortGlyf();
            if (true !== result) {
                alert(result.message);
            }
        }
    },

    'setting-compound2simple'() {
        if (program.ttfManager.get()) {
            program.ttfManager.compound2simple(program.viewer.getSelected());
        }
    },

    'setting-editor'() {
        let SettingEditor = settingSupport.editor;
        !new SettingEditor({
            onChange(setting) {
                program.setting.set('editor', setting, setting.saveSetting);
                setTimeout(function () {
                    program.viewer.setSetting(setting.viewer);
                    program.editor.setSetting(setting.editor);
                }, 20);
            }
        }).show(program.setting.get('editor'));
    },

    'import-pic'() {
        let SettingEditor = settingSupport['import-pic'];
        if (program.ttfManager.get()) {
            !new SettingEditor({
                onChange(setting) {
                    if (setting.contours) {

                        if (program.editor.isVisible()) {
                            program.editor.execCommand('addcontours', setting.contours, {
                                scale: 1,
                                selected: true
                            });
                            editorDelayFocus();
                        }
                        else {
                            let selected = program.viewer.getSelected();
                            program.ttfManager.insertGlyf(glyfAdjust({
                                contours: setting.contours
                            }, 1, 1, 0, 0, false), selected[0]);
                        }
                    }
                }
            }).show();
        }
    },

    'setting-import-and-export'() {
        let SettingEditor = settingSupport.ie;
        !new SettingEditor({
            onChange(setting) {
                program.setting.set('ie', setting, setting.saveSetting);
            }
        }).show(program.setting.get('ie'));
    }
};

export default actions;
