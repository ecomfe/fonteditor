/**
 * @file FontEditor入口函数
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {
        var i18n = require('./i18n/i18n');
        var GLYFViewer = require('./widget/glyfviewer/GLYFViewer');
        var GLYFEditor = require('./widget/GLYFEditor');
        var ProjectViewer = require('./widget/ProjectViewer');
        var TTFManager = require('./widget/TTFManager');
        var Toolbar = require('./widget/Toolbar');
        var Pager = require('./widget/Pager');

        var program = require('./widget/program');

        var controller = require('./controller/default');
        var actions = require('./controller/actions');


        function onUpFile(e) {
            var file = e.target.files[0];
            if (program.data.action === 'open' && program.loader.supportLoad(file.name)) {
                program.loader.load(file, {
                    type: file.name.slice(file.name.lastIndexOf('.') + 1).toLowerCase(),
                    success: function (imported) {
                        program.viewer.clearSelected();
                        program.ttfManager.set(imported);
                        program.data.projectId = null;
                    }
                });
            }
            else if (program.data.action === 'import' && program.loader.supportImport(file.name)) {
                if (program.ttfManager.get()) {

                    var ext = file.name.slice(file.name.lastIndexOf('.') + 1).toLowerCase();
                    var reg = new RegExp('\.' + ext + '$', 'i');
                    var files = Array.prototype.slice.call(e.target.files).filter(function (f) {
                        return reg.test(f.name);
                    });

                    files.forEach(function (f) {
                        program.loader.load(f, {
                            type: ext,
                            success: function (imported) {
                                if (imported.glyf.length) {
                                    program.ttfManager.merge(imported, {
                                        scale: true,
                                        adjustGlyf: imported.from === 'svg' ? true : false
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

            e.target.value = '';
        }

        function bindEvent() {
            $('.action-groups').delegate('[data-action]', 'click',  function (e) {
                var action = this.getAttribute('data-action');
                if ('1' !== this.getAttribute('data-disabled') && actions[action]) {
                    program.data.action = action;
                    actions[action].call(this, e);
                }
            });

            $('#export-btn').on('mouseup', actions['export-file']);
            $('#export-btn-woff').on('mouseup', actions['export-file']);
            $('#export-btn-svg').on('mouseup', actions['export-file']);
            $('#export-btn-eot').on('mouseup', actions['export-file']);
            $('#export-btn-zip').on('mouseup', actions['export-file']);

            document.getElementById('font-import').addEventListener('change', onUpFile);
        }

        var entry = {

            /**
             * 初始化
             */
            init: function () {

                bindEvent();

                program.setting = require('./widget/settingmanager');

                // glyf查看器命令组
                var viewerCommandMenu = new Toolbar($('#glyf-list-commandmenu'), {
                    commands: require('./menu/viewer')
                });

                program.viewerPager = new Pager($('#glyf-list-pager'));

                // glyf查看器
                program.viewer = new GLYFViewer($('#glyf-list'), {
                    commandMenu: viewerCommandMenu
                });

                // 字体查看器命令组
                var editorCommandMenu = new Toolbar($('#editor-commandmenu'), {
                    commands: require('./menu/editor')
                });

                // 字体查看器
                program.editor = new GLYFEditor($('#glyf-editor'), {
                    commandMenu: editorCommandMenu
                });

                // 项目管理
                program.project = require('./widget/project');
                program.projectViewer = new ProjectViewer($('#project-list'));

                // ttf管理
                program.ttfManager = new TTFManager();

                // 导入导出器
                program.loader = require('./widget/loader');
                program.exporter = require('./widget/exporter');

                // 预览器
                program.previewer = require('./widget/previewer');

                // 同步组件
                program.sync = require('./widget/sync');

                controller.init(program);

                // 加载项目
                program.projectViewer.show(program.project.items());


                // 加载用户设置
                if (program.setting.isStored('editor')) {
                    var setting = program.setting.get('editor');
                    program.viewer.setSetting(setting.viewer);
                    program.editor.setSetting(setting.editor);
                }

            }
        };

        entry.init();

        return entry;
    }
);
