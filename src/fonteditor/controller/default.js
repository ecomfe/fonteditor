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
        var setting = require('../widget/setting');
        var actions = require('./actions');

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

                        program.viewer.setMode('editor');

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
                                program.editor.setFont(lang.clone(font));
                            }
                        }
                        program.editor.focus();
                    }
                };

                // 隐藏editor
                var hideEditor = function() {
                    $('.main').removeClass('editing');
                    $('.editor').removeClass('editing');

                    program.editor && program.editor.hide();

                    program.viewer.clearEditing();
                    program.viewer.setMode('list');
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
                }).on('paste', function(e) {
                    var glyfList = clipboard.get('glyf');
                    if (glyfList) {
                        program.ttfManager.appendGlyf(glyfList, program.viewer.getSelected());
                    }
                })
                .on('undo', function(e) {
                    program.ttfManager.undo();
                }).on('redo', function(e) {
                    program.ttfManager.redo();
                }).on('adjust-pos', function(e) {

                    var ttf = program.ttfManager.get();
                    // 如果仅选择一个字形，则填充现有值
                    var selected = program.viewer.getSelected();
                    var opt = {};

                    if (selected.length === 1) {
                        var glyf = program.ttfManager.getGlyf(selected)[0];
                        opt = {
                            unicode: glyf.unicode,
                            leftSideBearing: glyf.leftSideBearing,
                            rightSideBearing: glyf.advanceWidth - glyf.xMax
                        };
                    }

                    !new setting['adjust-pos']({
                        onChange: function(setting) {
                            setTimeout(function() {
                                program.ttfManager.adjustGlyfPos(setting, selected);
                            }, 20);
                        }
                    }).show(opt);

                }).on('adjust-glyf', function(e) {

                    var ttf = program.ttfManager.get();
                    var dlg = new setting['adjust-glyf']({
                        onChange: function(setting) {
                            setTimeout(function() {
                                program.ttfManager.adjustGlyf(setting, program.viewer.getSelected());
                            }, 20);
                        }
                    });
                    
                    dlg.show();

                }).on('fontsetting', function(e) {

                    var ttf = program.ttfManager.get();
                    // 如果仅选择一个字形，则填充现有值
                    var selected = program.viewer.getSelected();
                    if (selected.length) {
                        var glyf = program.ttfManager.getGlyf(selected)[0];

                        !new setting['glyf']({
                            onChange: function(setting) {
                                program.ttfManager.updateGlyf(setting, selected[0]);
                            }
                        }).show({
                            unicode: glyf.unicode,
                            leftSideBearing: glyf.leftSideBearing,
                            rightSideBearing: glyf.advanceWidth - (glyf.xMax || 0),
                            name: glyf.name
                        });
                    }

                }).on('find-glyf', function(e) {

                    var dlg = new setting['find-glyf']({
                        onChange: function(setting) {
                            var index = program.ttfManager.findGlyf(setting.unicode[0]);
                            if (-1 !== index) {
                                var pageSize = program.setting.get('editor').viewer.pageSize;
                                var page = Math.ceil(index / pageSize);
                                showTTF(program.ttfManager.get(), page, [index]);
                            }
                            else {
                                alert('未找到相关字形!');
                            }
                        }
                    });
                    dlg.show();

                }).on('refresh', function() {
                    showTTF(program.ttfManager.get(), 1);
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

                program.viewerPager.on('change', function(e) {
                    showTTF(program.ttfManager.get(), e.page);
                });

                // 显示ttf列表
                var showTTF = function(ttf, page, selected) {
                    
                    program.viewer.setPage(page - 1);

                    program.viewer.show(ttf, selected || program.viewer.getSelected());
                    program.viewer.focus();

                    // 设置翻页
                    var glyfTotal = ttf.glyf.length;
                    var pageSize = program.setting.get('editor').viewer.pageSize;

                    if (glyfTotal > pageSize) {
                        program.viewerPager.show(page, pageSize, glyfTotal);
                    }
                    else {
                        program.viewerPager.hide();
                    }
                }

                program.ttfManager.on('change', function(e) {
                    // 保存正在编辑的字形
                    var editing = program.viewer.getEditing();
                    if (e.changeType === 'update' && program.editor.isEditing() && editing !== -1) {
                        program.viewer.refresh(e.ttf, [editing]);
                    }
                    else {
                        showTTF(e.ttf, program.viewer.getPage() + 1);
                    }

                }).on('set', function(e) {

                    // 未初始化状态，命令栏是不显示的，需要设置下编辑模式
                    if (!program.viewer.inited) {
                        program.viewer.setMode('list');
                        program.viewer.inited = true;
                    }

                    showTTF(e.ttf, 1);

                });


                program.on('save', function(e) {
                    // 保存项目
                    if (program.ttfManager.get()) {

                        if (program.editor.isEditing()) {

                            // 如果是正在编辑的
                            var editing = program.viewer.getEditing();
                            if (editing !== -1) {
                                 program.ttfManager.replaceGlyf(program.editor.getFont(), editing);
                            }
                            // 否则新建font
                            else {
                                program.ttfManager.insertGlyf(program.editor.getFont());
                            }
                            program.editor.setChanged(false);
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
