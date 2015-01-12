/**
 * @file default.js
 * @author mengke01
 * @date
 * @description
 * 默认的页面控制器
 */


define(
    function (require) {
        var lang = require('common/lang');
        var settingSupport = require('../dialog/support');
        var clipboard = require('editor/widget/clipboard');
        var actions = require('./actions');
        var glyfAdjust = require('ttf/util/glyfAdjust');
        var currentProgram;

        /**
         * 获取ttf的编辑选项
         *
         * @param {Object} ttf ttf对象
         * @return {Object} 编辑项目
         */
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

        /**
         * 显示指定索引的字形
         *
         * @param {number} glyfIndex 字形索引
         */
        function showEditor(glyfIndex) {

            // 重置editor缩放
            var ttf = currentProgram.ttfManager.get();
            if (ttf) {
                $('.main').addClass('editing');
                $('.editor').addClass('editing');

                currentProgram.viewer.setMode('editor');

                currentProgram.viewer.blur();
                currentProgram.editor.show();

                // 调整显示级别
                currentProgram.editor.setAxis(getEditingOpt(ttf));

                var font = ttf.glyf[glyfIndex];
                if (font) {
                    if (font.compond) {
                        alert('暂不支持复合字形!');
                    }
                    else {
                        currentProgram.editor.setFont(lang.clone(font));
                    }
                }

                currentProgram.editor.focus();
            }
        }

        /**
         * 隐藏editor
         */
        function hideEditor() {
            $('.main').removeClass('editing');
            $('.editor').removeClass('editing');

            currentProgram.editor && currentProgram.editor.hide();

            currentProgram.viewer.clearEditing();
            currentProgram.viewer.setMode('list');
            currentProgram.viewer.focus();
        }

        /**
         * 显示ttf列表
         *
         * @param {Object} ttf ttf对象
         * @param {number} page 页码
         * @param {Array} selected 选中的字形
         */
        function showTTF(ttf, page, selected) {

            var glyfTotal = ttf.glyf.length;
            var pageSize = currentProgram.setting.get('editor').viewer.pageSize;
            var totalPage = Math.ceil(glyfTotal / pageSize);
            if (page > totalPage) {
                page = totalPage;
            }
            else if (page < 1) {
                page = 1;
            }

            currentProgram.viewer.setPage(page - 1);

            currentProgram.viewer.show(ttf, selected || currentProgram.viewer.getSelected());
            currentProgram.viewer.focus();

            // 设置翻页
            if (glyfTotal > pageSize) {
                currentProgram.viewerPager.show(page, pageSize, glyfTotal);
            }
            else {
                currentProgram.viewerPager.hide();
            }
        }

        /**
         * 绑定glyf列表
         *
         * @param {Object} program 全局对象
         */
        function bindViewer(program) {

            program.viewer.on('del', function (e) {
                if (e.list) {
                    program.ttfManager.removeGlyf(e.list);
                }
            })
            .on('edit', function (e) {

                if (program.editor.isChanged() && !confirm('是否放弃保存当前编辑的字形?')) {
                    return;
                }

                $('.main').addClass('editing');
                $('.editor').addClass('editing');
                showEditor(e.list[0]);

            })
            .on('copy', function (e) {

                var list = program.ttfManager.getGlyf(e.list);
                var clip = {
                    unitsPerEm: program.ttfManager.get().head.unitsPerEm,
                    glyf: list
                };
                clipboard.set(clip, 'glyf');

            })
            .on('cut', function (e) {
                var list = program.ttfManager.getGlyf(e.list);
                var clip = {
                    unitsPerEm: program.ttfManager.get().head.unitsPerEm,
                    glyf: list
                };
                clipboard.set(clip, 'glyf');
                program.ttfManager.removeGlyf(e.list);

            })
            .on('paste', function (e) {
                var clip = clipboard.get('glyf');
                if (clip && clip.glyf.length) {
                    // 根据 unitsPerEm 调整形状
                    if (program.ttfManager.get().head.unitsPerEm !== clip.unitsPerEm) {
                        var scale = program.ttfManager.get().head.unitsPerEm / (clip.unitsPerEm || 1024);
                        clip.glyf.forEach(function (g) {
                            glyfAdjust(g, scale, scale);
                        });
                    }
                    program.ttfManager.appendGlyf(clip.glyf, program.viewer.getSelected());
                }
            })
            .on('undo', function (e) {
                program.ttfManager.undo();
            })
            .on('redo', function (e) {
                program.ttfManager.redo();
            })
            .on('adjust-pos', function (e) {

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

                var SettingAdjustPos = settingSupport['adjust-pos'];
                !new SettingAdjustPos({
                    onChange: function (setting) {
                        setTimeout(function () {
                            program.ttfManager.adjustGlyfPos(selected, setting);
                        }, 20);
                    }
                }).show(opt);

            })
            .on('adjust-glyf', function (e) {

                var SettingAdjustGlyf = settingSupport['adjust-glyf'];
                !new SettingAdjustGlyf({
                    onChange: function (setting) {
                        setTimeout(function () {
                            program.ttfManager.adjustGlyf(program.viewer.getSelected(), setting);
                        }, 20);
                    }
                }).show();

            })
            .on('setting-font', function (e) {

                // 如果仅选择一个字形，则填充现有值
                var selected = program.viewer.getSelected();
                if (selected.length) {
                    var glyf = program.ttfManager.getGlyf(selected)[0];
                    var SettingGlyf = settingSupport.glyf;
                    !new SettingGlyf({
                        onChange: function (setting) {
                            program.ttfManager.updateGlyf(setting, selected[0]);
                        }
                    }).show({
                        unicode: glyf.unicode,
                        leftSideBearing: glyf.leftSideBearing,
                        rightSideBearing: glyf.advanceWidth - (glyf.xMax || 0),
                        name: glyf.name
                    });
                }

            })
            .on('find-glyf', function (e) {
                var SettingFindGlyf = settingSupport['find-glyf'];
                !new SettingFindGlyf({
                    onChange: function (setting) {
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
                }).show();

            })
            .on('setting-unicode', function (e) {
                var SettingUnicode = settingSupport.unicode;
                !new SettingUnicode({
                    onChange: function (unicode) {
                        // 此处延迟处理
                        setTimeout(function () {
                            if (program.ttfManager.get()) {
                                var glyfList = program.viewer.getSelected();
                                program.ttfManager.setUnicode(unicode, glyfList);
                            }
                        }, 20);
                    }
                }).show();
            })
            .on('refresh', function (e) {
                showTTF(program.ttfManager.get(), 1);
            })
            .on('moveleft', function (e) {
                var editingIndex = program.viewer.getEditing();
                if (program.editor.isVisible() && editingIndex > 0) {
                    program.viewer.setEditing(--editingIndex);
                    showEditor(editingIndex);
                }
            })
            .on('moveright', function (e) {
                var editingIndex = program.viewer.getEditing();
                if (program.editor.isVisible()
                    && editingIndex < program.ttfManager.get().glyf.length - 1
                ) {
                    program.viewer.setEditing(++editingIndex);
                    showEditor(editingIndex);
                }
            });

            program.viewerPager.on('change', function (e) {
                showTTF(program.ttfManager.get(), e.page);
            });
        }

        /**
         * 绑定项目列表
         *
         * @param {Object} program 全局对象
         */
        function bindProject(program) {
            program.projectViewer.on('open', function (e) {
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
            })
            .on('saveas', function () {
                program.data.projectId = null;
                actions.save();
                program.viewer.focus();
            })
            .on('del', function (e) {
                program.project.remove(e.projectId);
                if (e.projectId === program.data.projectId) {
                    program.data.projectId = null;
                }
                program.viewer.focus();
            });
        }

        /**
         * 绑定ttf管理器
         *
         * @param {Object} program 项目对象
         */
        function bindttfManager(program) {
            program.ttfManager.on('change', function (e) {
                // 保存正在编辑的字形
                var editingIndex = program.viewer.getEditing();
                if (e.changeType === 'update' && program.editor.isEditing() && editingIndex !== -1) {
                    program.viewer.refresh(e.ttf, [editingIndex]);
                }
                else {
                    showTTF(e.ttf, program.viewer.getPage() + 1);
                }

            })
            .on('set', function (e) {

                // 未初始化状态，命令栏是不显示的，需要设置下编辑模式
                if (!program.viewer.inited) {
                    program.viewer.setMode('list');
                    program.viewer.inited = true;
                }

                showTTF(e.ttf, 1, []);
            });
        }

        /**
         * 绑定项目对象
         *
         * @param {Object} program 项目对象
         */
        function bindProgram(program) {

            program.on('save', function (e) {
                // 保存项目
                if (program.ttfManager.get()) {
                    var type = e.type;
                    if (type === 'editor' || program.editor.isEditing()) {

                        // 如果是正在编辑的
                        var editingIndex = program.viewer.getEditing();
                        if (editingIndex !== -1) {
                            program.ttfManager.replaceGlyf(program.editor.getFont(), editingIndex);
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
            })
            .on('paste', function (e) {
                var clip = clipboard.get('glyf');
                if (clip && clip.glyf.length) {
                    if (!program.editor.isEditing()) {
                        program.viewer.fire('paste');
                    }
                    else {
                        program.editor.addContours(clip.glyf[0].contours);
                    }
                }
            })
            .on('function', function (e) {
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
        }


        return {

            /**
             * 初始化控制器
             *
             * @param {Object} program 项目组件
             */
            init: function (program) {

                // 设置当前的项目对象为指定的项目对象
                currentProgram = program;

                bindViewer(program);
                bindttfManager(program);
                bindProject(program);
                bindProgram(program);


                $('.close-editor').click(function () {
                    hideEditor();
                });

                program.init({
                    viewer: program.viewer.main.get(0),
                    editor: program.editor.main.get(0)
                });

                window.onbeforeunload = function () {
                    if (program.ttfManager.isChanged()) {
                        return '是否放弃保存当前编辑的项目?';
                    }
                };
            }
        };
    }
);
