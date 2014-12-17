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
        var glyfAdjust = require('ttf/util/glyfAdjust');
        var defaultProgram;

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

        // 显示editor
        function showEditor(glyfIndex) {

            // 重置editor缩放
            var ttf = defaultProgram.ttfManager.get();
            if (ttf) {
                $('.main').addClass('editing');
                $('.editor').addClass('editing');

                defaultProgram.viewer.setMode('editor');

                defaultProgram.viewer.blur();
                defaultProgram.editor.show();

                // 调整显示级别
                defaultProgram.editor.setAxis(getEditingOpt(ttf));

                var font = ttf.glyf[glyfIndex];
                if (font) {
                    if (font.compond) {
                        alert('暂不支持复合字形!');
                    }
                    else {
                        defaultProgram.editor.setFont(lang.clone(font));
                    }
                }
                defaultProgram.editor.focus();
            }
        }

        // 隐藏editor
        function hideEditor() {
            $('.main').removeClass('editing');
            $('.editor').removeClass('editing');

            defaultProgram.editor && defaultProgram.editor.hide();

            defaultProgram.viewer.clearEditing();
            defaultProgram.viewer.setMode('list');
            defaultProgram.viewer.focus();
        }

        // 显示ttf列表
        function showTTF(ttf, page, selected) {

            defaultProgram.viewer.setPage(page - 1);

            defaultProgram.viewer.show(ttf, selected || defaultProgram.viewer.getSelected());
            defaultProgram.viewer.focus();

            // 设置翻页
            var glyfTotal = ttf.glyf.length;
            var pageSize = defaultProgram.setting.get('editor').viewer.pageSize;

            if (glyfTotal > pageSize) {
                defaultProgram.viewerPager.show(page, pageSize, glyfTotal);
            }
            else {
                defaultProgram.viewerPager.hide();
            }
        }


        return {

            /**
             * 初始化控制器
             *
             * @param {Object} program 项目组件
             */
            init: function(program) {

                defaultProgram = program;

                program.viewer.on('del', function(e) {
                    if (e.list) {
                        program.ttfManager.removeGlyf(e.list);
                    }
                }).on('edit', function(e) {

                    if (program.editor.isChanged() && !confirm('是否放弃保存当前编辑的字形?')) {
                        return;
                    }

                    $('.main').addClass('editing');
                    $('.editor').addClass('editing');
                    showEditor(e.list[0]);

                }).on('copy', function(e) {

                    var list = program.ttfManager.getGlyf(e.list);
                    var clip = {
                        unitsPerEm: program.ttfManager.get().head.unitsPerEm,
                        glyf: list
                    };
                    clipboard.set(clip, 'glyf');

                }).on('cut', function(e) {
                    var list = program.ttfManager.getGlyf(e.list);
                    var clip = {
                        unitsPerEm: program.ttfManager.get().head.unitsPerEm,
                        glyf: list
                    };
                    clipboard.set(clip, 'glyf');
                    program.ttfManager.removeGlyf(e.list);

                }).on('paste', function(e) {
                    var clip = clipboard.get('glyf');
                    if (clip && clip.glyf.length) {
                        // 根据 unitsPerEm 调整形状
                        if (program.ttfManager.get().head.unitsPerEm !== clip.unitsPerEm) {
                            var scale = program.ttfManager.get().head.unitsPerEm / (clip.unitsPerEm || 1024);
                            clip.glyf.forEach(function(g) {
                                glyfAdjust(g, scale, scale);
                            });
                        }
                        program.ttfManager.appendGlyf(clip.glyf, program.viewer.getSelected());
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

                }).on('setting-font', function(e) {

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

                }).on('setting-unicode', function() {
                    var dlg = new setting.unicode({
                        onChange: function(unicode) {
                            // 此处延迟处理
                            setTimeout(function(){
                                if (program.ttfManager.get()) {
                                    var glyfList = program.viewer.getSelected();
                                    program.ttfManager.setUnicode(unicode, glyfList);
                                }
                            }, 20);
                        }
                    });

                    dlg.show();
                }).on('refresh', function() {
                    showTTF(program.ttfManager.get(), 1);
                });

                program.projectViewer.on('open', function(e) {
                    var imported = program.project.get(e.projectId);
                    if (imported) {

                        if (program.ttfManager.isChanged() && !window.confirm('是否放弃保存当前编辑项目?')) {
                            return;
                        }

                        program.ttfManager.set(imported);
                        program.data.projectId = e.projectId;
                        program.projectViewer.select(e.projectId);
                        program.viewer.focus();
                    }
                }).on('saveas', function(e) {
                    program.data.projectId = null;
                    actions.save();
                    program.viewer.focus();
                }).on('del', function(e) {
                    program.project.remove(e.projectId);
                    if (e.projectId === program.data.projectId) {
                        program.data.projectId = null;
                    }
                    program.viewer.focus();
                });

                program.viewerPager.on('change', function(e) {
                    showTTF(program.ttfManager.get(), e.page);
                });

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

                    showTTF(e.ttf, 1, []);

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
                        else {
                            actions.save();
                        }
                    }
                }).on('paste', function(e) {
                    var clip = clipboard.get('glyf');
                    if (clip && clip.glyf.length) {
                        if (!program.editor.isEditing()) {
                            program.viewer.fire('paste');
                        }
                        else {
                            program.editor.addContours(clip.glyf[0].contours);
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
                        return '是否放弃保存当前编辑的项目?';
                    }
                };
            }
        };
    }
);
