/**
 * @file main.js
 * @author mengke01
 * @date 
 * @description
 * ttf管理器
 */

define(
    function(require) {

        var GLYFViewer = require('./widget/glyfviewer');
        var ProjectViewer = require('./widget/projectviewer');
        var TTFManager = require('./widget/ttfmanager');
        var program = require('./widget/program');
        var controller = require('./controller/ttf');
        var actions = require('./widget/actions');

        // 打开文件
        function onUpFile(e) {
            var file = e.target.files[0];

            if (program.data.action == 'open' && file.name.match(/(\.ttf|\.woff)$/i)) {
                program.loader.load(file, {
                    type: file.name.slice(file.name.lastIndexOf('.') + 1).toLowerCase(),
                    success: function(imported) {
                        program.viewer.clearSelected();
                        program.ttfManager.set(imported);
                        program.data.projectName = null;
                    }
                });
            }
            else if (program.data.action == 'import' && file.name.match(/(\.ttf|\.woff|\.svg)$/i)) {
                if (program.ttfManager.get()) {
                    program.loader.load(file, {
                        type: file.name.slice(file.name.lastIndexOf('.') + 1).toLowerCase(),
                        success: function(imported) {
                            if (imported.glyf.length) {
                                program.ttfManager.merge(imported, {scale: true});
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
                    program.data.action = action;
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
                program.project = require('./widget/project');
                program.projectViewer = new ProjectViewer($('#project-list'));

                // ttf管理
                program.ttfManager = new TTFManager();

                // 导入导出器
                program.loader = require('./widget/loader');
                program.exporter = require('./widget/exporter');

                // 预览器
                program.previewer = require('./widget/previewer');

                controller.init(program);

                // 加载项目
                program.projectViewer.show(program.project.items());
            }
        };

        entry.init();
        
        return entry;
    }
);