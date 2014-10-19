/**
 * @file default.js
 * @author mengke01
 * @date 
 * @description
 * 默认的页面控制器
 */


define(
    function(require) {
        var lang = require('common/lang');
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
                }).on('edit', function(e) {
                    $('.main').addClass('editing');
                    $('.editor').addClass('editing');
                    var list = program.ttfManager.getGlyf(e.list);
                    if (list[0].compound) {
                        alert('暂不支持复合字形!');
                    }
                    else {
                        program.editor.show(lang.clone(list[0]));
                    }

                }).on('copy', function(e) {
                    var list = program.ttfManager.getGlyf(e.list);
                    clipboard.set(list, 'glyf');
                }).on('cut', function(e) {
                    var list = program.ttfManager.getGlyf(e.list);
                    clipboard.set(list, 'glyf');
                    program.ttfManager.removeGlyf(e.list);
                }).on('undo', function(e) {
                    program.ttfManager.undo();
                }).on('redo', function(e) {
                    program.ttfManager.redo();
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


                program.on('save', function(e) {
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
                }).on('paste', function(e) {
                    var glyfList = clipboard.get('glyf');
                    if (glyfList && glyfList.length) {
                        program.ttfManager.appendGlyf(glyfList, program.viewer.getSelected());
                    }
                });

                program.init({
                    viewer: program.viewer.main.get(0),
                    editor: program.editor.main.get(0)
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
