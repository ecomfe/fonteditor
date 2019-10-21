/**
 * @file FontEditor入口函数
 * @author mengke01(kekee000@gmail.com)
 */

import i18n from './i18n/i18n';
import program from './widget/program';
import controller from './controller/default';
import actions from './controller/actions';
import settingmanager from './widget/settingmanager';
import programConfig from './config';
import lang from 'common/lang';
import viewerCommandMenuConfig from './menu/viewer';
import editorCommandMenuConfig from './menu/editor';

import GLYFViewer from './widget/glyfviewer/GLYFViewer';
import Spliter from './widget/Spliter';
import Toolbar from './widget/Toolbar';
import ProjectViewer from './widget/ProjectViewer';
import TTFManager from './widget/TTFManager';
import GLYFEditor from './widget/GLYFEditor';
import Pager from './widget/Pager';
import loaderWidget from './widget/loader';
import exporterWidget from './widget/exporter';
import previewerWidget from './widget/previewer';
import syncWidget from './widget/sync';
import projectWidget from './widget/project';



function loadFiles(files) {
    let file = files[0];
    if (program.data.action === 'open' && program.loader.supportLoad(file.name)) {
        program.loader.load(file, {
            type: file.name.slice(file.name.lastIndexOf('.') + 1).toLowerCase(),
            success(imported) {
                program.viewer.clearSelected();
                program.ttfManager.set(imported);
                program.data.projectId = null;
            }
        });
    }
    else if (program.data.action === 'import' && program.loader.supportImport(file.name)) {
        if (program.ttfManager.get()) {
            let ext = file.name.slice(file.name.lastIndexOf('.') + 1).toLowerCase();
            let reg = new RegExp('\.' + ext + '$', 'i');
            let files = Array.prototype.slice.call(files).filter(function (f) {
                return reg.test(f.name);
            });

            files.forEach(function (f) {
                program.loader.load(f, {
                    type: ext,
                    success(imported) {
                        if (imported.glyf.length) {
                            program.ttfManager.merge(imported, {
                                scale: true,
                                adjustGlyf: imported.from === 'svg'
                            });
                        }
                    }
                });
            });
        }
    }
    else {
        alert(i18n.lang.msg_not_support_file_type);
    }
}

function onUpFile(e) {
    loadFiles(e.target.files);
    e.target.value = '';
}

function onDrop(e) {
    e.stopPropagation();
    e.preventDefault();
    let file = e.dataTransfer.files[0];
    let ext = file.name.slice(file.name.lastIndexOf('.') + 1).toLowerCase();
    program.data.action = ext === 'svg' ? 'import' : 'open';
    loadFiles(e.dataTransfer.files);
}

function bindEvent() {
    $('.action-groups').delegate('[data-action]', 'click', function (e) {
        let action = this.getAttribute('data-action');
        if ('1' !== this.getAttribute('data-disabled') && actions[action]) {
            program.data.action = action;
            actions[action].call(this, e);
        }
    });

    document.getElementById('font-import').addEventListener('change', onUpFile);
    // 阻止拖拽默认事件
    $(document).on('dragleave drop dragenter dragover', function (e) {
        e.preventDefault();
    });
    document.getElementById('glyf-list').addEventListener('drop', onDrop);
}

function loadProject(projectId) {
    if (!program.project.getConfig(projectId)) {
        return;
    }

    program.project.ready().then(function () {
        program.projectViewer.select(projectId);
        program.projectViewer.fire('open', {
            projectId: projectId
        });
    });
}

function getProjectId() {
    let projectId = null;
    // 从 url 中读取 id
    if (location.search) {
        let query = lang.parseQuery(location.search.slice(1));
        if (query.project) {
            projectId = query.project;
        }
    }
    // 上一次打开的项目
    if (!projectId) {
        projectId = window.localStorage.getItem('project-cur');
    }
    return projectId;
}

function main() {
    bindEvent();
    program.setting = settingmanager;
    program.config = programConfig;

    // 拖拽面板管理器
    program.spliter = new Spliter($('#glyf-list-spliter'));

    // glyf查看器命令组
    let viewerCommandMenu = new Toolbar($('#glyf-list-commandmenu'), {
        commands: viewerCommandMenuConfig
    });

    program.viewerPager = new Pager($('#glyf-list-pager'));

    // glyf查看器
    program.viewer = new GLYFViewer($('#glyf-list'), {
        commandMenu: viewerCommandMenu
    });

    // 字体查看器命令组
    let editorCommandMenu = new Toolbar($('#editor-commandmenu'), {
        commands: editorCommandMenuConfig
    });

    // 字体查看器
    program.editor = new GLYFEditor($('#glyf-editor'), {
        commandMenu: editorCommandMenu
    });

    // 项目管理
    program.project = projectWidget;
    program.projectViewer = new ProjectViewer($('#project-list'));

    // ttf管理
    program.ttfManager = new TTFManager();

    // 导入导出器
    program.loader = loaderWidget;
    program.exporter = exporterWidget;

    // 预览器
    program.previewer = previewerWidget;

    // 同步组件
    program.sync = syncWidget;

    controller.init(program);

    // 加载用户设置
    if (program.setting.isStored('editor')) {
        let setting = program.setting.get('editor');
        program.viewer.setSetting(setting.viewer);
        program.editor.setSetting(setting.editor);
    }

    // 加载项目
    program.projectViewer.show(program.project.items());
    let projectId = getProjectId();
    if (projectId) {
        loadProject(projectId);
    }
}

// entry
main();
