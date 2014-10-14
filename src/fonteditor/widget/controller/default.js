/**
 * @file default.js
 * @author mengke01
 * @date 
 * @description
 * 默认的页面控制器
 */


define(
    function(require) {

        var clipboard = require('../clipboard');
        var string = require('common/string');
        
        return {

            /**
             * 初始化控制器
             * 
             * @param {Object} program 项目组件
             */
            init: function(program) {
                program.viewer.on('del', function(e) {
                    if (e.list) {
                        program.ttfManager.removeGlyf(e.list);
                    }
                }).on('copy', function(e) {
                    var list = program.ttfManager.getGlyf(e.list);
                    clipboard.set(list, 'glyf');
                }).on('cut', function(e) {
                    var list = program.ttfManager.getGlyf(e.list);
                    clipboard.set(list, 'glyf');
                    program.ttfManager.removeGlyf(e.list);
                }).on('paste', function(e) {
                    var glyfList = clipboard.get('glyf');
                    if (glyfList && glyfList.length) {
                        program.ttfManager.appendGlyf(glyfList, program.viewer.getSelected());
                    }
                }).on('undo', function(e) {
                    program.ttfManager.undo();
                }).on('redo', function(e) {
                    program.ttfManager.redo();
                }).on('save', function(e) {
                    // 保存项目
                    if (program.ttfManager.get()) {
                        if (program.data.projectName) {
                            program.project.add(program.data.projectName, program.ttfManager.get());
                            program.ttfManager.setState('new');
                            program.loading.show('保存成功..', 400);
                        }
                        else {
                            var name = '';
                            if ((name = window.prompt('请输入项目名称：'))) {
                                name = string.encodeHTML(name);
                                var list = program.project.add(name, program.ttfManager.get());
                                program.projectViewer.show(list);
                                program.data.projectName = name;
                                program.ttfManager.setState('new');
                                program.loading.show('保存成功..', 400);
                            }
                        }
                    }


                });

                program.projectViewer.on('open', function(e) {
                    var imported = program.project.get(e.projectName);
                    if (imported) {
                        if (program.ttfManager.isChanged() && !window.confirm('是否放弃保存当前项目?')) {
                            return;
                        }
                        program.ttfManager.set(imported);
                        program.data.projectName = e.projectName;
                        program.viewer.focus();
                    }
                }).on('del', function(e) {
                    if (e.projectName && window.confirm('是否删除项目?')) {
                        program.projectViewer.show(program.project.remove(e.projectName));
                    }
                    program.viewer.focus();
                });

                program.ttfManager.on('change', function(e) {
                    program.viewer.show(e.ttf, program.viewer.getSelected());
                    program.viewer.focus();
                });

                window.onbeforeunload = function() {
                    if (program.ttfManager.isChanged()) {
                            return '是否放弃保存当前项目?';
                    }
                };
            }
        };
    }
);
