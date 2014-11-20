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
        var clipboard = require('editor/widget/clipboard');
        var string = require('common/string');

        // 获取ttf的编辑选项
        function getEditingOpt(ttf) {

            var opt = {
                unitsPerEm: ttf.head.unitsPerEm,
                metrics: {
                    ascent: ttf.hhea.ascent,
                    descent: ttf.hhea.descent,
                    capHeight: ttf['OS/2'].sCapHeight || ttf.hhea.ascent * 0.8,
                    xHeight: ttf['OS/2'].sxHeight || ttf.head.unitsPerEm * 0.4
                }
            };
            return opt;
        }


        return {

            /**
             * 初始化控制器
             *
             * @param {Object} program 项目组件
             */
            init: function(program) {

                // 显示editor
                var showEditor = function(glyfIndex) {

                    // 重置editor缩放
                    var ttf = program.ttfManager.get();
                    if (ttf) {
                        $('.main').addClass('editing');
                        $('.editor').addClass('editing');

                        program.viewer.blur();
                        program.editor.show();

                        // 调整显示级别
                        program.editor.setAxis(getEditingOpt(ttf));

                        var font = ttf.glyf[glyfIndex];
                        if (font) {
                            if (font.compond) {
                                alert('暂不支持复合字形!');
                            }
                            else {
                                program.data.editingIndex = glyfIndex;
                                program.editor.setFont(lang.clone(font));
                            }
                        }
                    }
                };

                // 隐藏editor
                var hideEditor = function() {
                    $('.main').removeClass('editing');
                    $('.editor').removeClass('editing');

                    program.data.editingIndex = -1;
                    program.editor && program.editor.hide();
                    program.viewer.focus();
                };


                program.viewer.on('del', function(e) {
                    if (e.list) {
                        program.ttfManager.removeGlyf(e.list);
                    }
                }).on('edit', function(e) {

                    if (program.editor.isChanged() && !confirm('是否放弃保存编辑的字形?')) {
                        return;
                    }

                    $('.main').addClass('editing');
                    $('.editor').addClass('editing');
                    showEditor(e.list[0]);

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
                    if (program.editor.isEditing() && program.data.editingIndex !== -1) {
                        program.viewer.refresh(e.ttf, [program.data.editingIndex]);
                    }
                    else {
                        program.viewer.show(e.ttf, program.viewer.getSelected());
                        program.viewer.focus();
                    }
                });


                program.on('save', function(e) {
                    // 保存项目
                    if (program.ttfManager.get()) {

                        if (program.editor.isEditing()) {
                            // 如果是正在编辑的
                            if (program.data.editingIndex !== -1) {
                                 program.ttfManager.replaceGlyf(program.editor.getFont(), program.data.editingIndex);
                            }
                            // 否则新建font
                            else {
                                program.ttfManager.insertGlyf(program.editor.getFont());
                            }
                        }

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
                        if (!program.editor.isEditing()) {
                            program.ttfManager.appendGlyf(glyfList, program.viewer.getSelected());
                        }
                        else {
                            program.editor.addContours(glyfList[0].contours);
                        }
                    }
                }).on('function', function(e) {
                    // F2
                    if (e.keyCode === 113) {
                        if (!program.editor.isVisible()) {
                            showEditor();
                        }
                        else {
                            hideEditor();
                        }
                    }
                });

                $('.close-editor').click(function(e) {
                    hideEditor();
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
