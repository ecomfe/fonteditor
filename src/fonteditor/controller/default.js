/**
 * @file 默认的页面控制器
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {
        var i18n = require('../i18n/i18n');
        var lang = require('common/lang');
        var settingSupport = require('../dialog/support');
        var clipboard = require('editor/widget/clipboard');
        var actions = require('./actions');
        var program;

        /**
         * 通知错误信息
         *
         * @param  {Object} options 参数
         * @param  {number} options.number 错误号
         * @param  {Object} options.data 错误数据
         */
        function notifyError(options) {
            // 重复的代码点
            if (options.number === 10200 && options.data) {
                var glyphList = Array.isArray(options.data) ? options.data : [options.data];
                var pageSize = program.setting.get('editor').viewer.pageSize;
                var page = Math.ceil(glyphList[0] / pageSize);
                showTTF(program.ttfManager.get(), page, glyphList);
            }
        }


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
         * @param {number} glyphIndex 字形索引
         */
        function showEditor(glyphIndex) {
            var isEditorVisible = program.editor.isVisible();

            // 重置editor缩放
            var ttf = program.ttfManager.get();
            if (ttf) {
                $('.main').addClass('editing');
                $('.editor').addClass('editing');

                program.viewer.setMode('editor');

                if (!isEditorVisible) {
                    program.editor.show();
                    program.fire('editor-show');
                }

                // 调整显示级别
                program.editor.setAxis(getEditingOpt(ttf));

                if (null == glyphIndex) {
                    return;
                }
                glyphIndex = +glyphIndex;
                var font = ttf.glyph[glyphIndex];
                if (font) {
                    var clonedFont = lang.clone(font);
                    if (clonedFont.compound) {
                        if (!confirm(i18n.lang.msg_transform_compound_glyph)) {
                            return;
                        }

                        // 转换复合字形为简单字形，原始字形不变
                        var transformglyphContours = require('fonteditor-core/ttf/util/transformglyphContours');
                        var compound2simple = require('fonteditor-core/ttf/util/compound2simple');
                        clonedFont = compound2simple(clonedFont, transformglyphContours(font, ttf));
                    }

                    program.editor.setFont(clonedFont);
                }
            }
        }

        /**
         * 隐藏editor
         */
        function hideEditor() {
            $('.main').removeClass('editing');
            $('.editor').removeClass('editing');

            program.editor && program.editor.hide();
            program.fire('editor-hide');
            program.viewer.clearEditing();
            program.viewer.setMode('list');
            program.viewer.focus();
        }

        /**
         * 显示ttf列表
         *
         * @param {Object} ttf ttf对象
         * @param {number} page 页码
         * @param {Array} selected 选中的字形
         */
        function showTTF(ttf, page, selected) {

            var glyphTotal = ttf.glyph.length;
            var pageSize = program.setting.get('editor').viewer.pageSize;
            var totalPage = Math.ceil(glyphTotal / pageSize);
            if (page > totalPage) {
                page = totalPage;
            }
            else if (page < 1) {
                page = 1;
            }

            program.viewer.setPage(page - 1);

            program.viewer.show(ttf, selected || program.viewer.getSelected());
            program.viewer.focus();

            // 设置翻页
            if (glyphTotal > pageSize) {
                program.viewerPager.show(page, pageSize, glyphTotal);
            }
            else {
                program.viewerPager.hide();
            }
        }

        /**
         * 移动选中的glyph到指定位置
         *
         * @param {Array} selected 选中的列表
         * @param {number} isLeft 是否左移
         */
        function moveSelectedglyph(selected, isLeft) {
            var ttf = program.ttfManager.get();
            var glyph = ttf.glyph;
            var glyphCount = glyph.length;
            var selectedCount = selected.length;
            var step = isLeft ? -1 : 1;
            var index;

            if (selectedCount === 1) {
                index = selected[0];
                var targetIndex = index + step;
                if (targetIndex >= 0 && targetIndex < glyphCount) {
                    var tmp = glyph[index];
                    glyph[index] = glyph[targetIndex];
                    glyph[targetIndex] = tmp;
                    program.viewer.setSelected([targetIndex]);
                    program.viewer.refresh(ttf, [index, targetIndex]);
                }
            }
            // 移动多个项目
            else if (selectedCount) {

                selected = selected.sort(function (a, b) {
                    return a - b;
                });

                // 判读头部和尾部是否能移动，不能移动则整体不变
                if (isLeft && selected[0] > 0 || !isLeft && selected[selectedCount - 1] < glyphCount - 1) {

                    var i;
                    // 左移
                    if (isLeft) {
                        index = selected[0] - 1;
                        for (i = 1; i < selectedCount; i++) {
                            if (selected[i - 1] + 1 !== selected[i]) {
                                glyph.splice(selected[i - 1] + 1, 0, glyph[index]);
                                glyph.splice(index, 1);

                                index = selected[i] - 1;
                            }
                        }
                        glyph.splice(selected[selectedCount - 1] + 1, 0, glyph[index]);
                        glyph.splice(index, 1);
                    }
                    // 右移
                    else {
                        index = selected[selectedCount - 1] + 1;
                        for (i = selectedCount - 2; i >= 0; i--) {
                            if (selected[i + 1] - 1 !== selected[i]) {
                                glyph.splice(selected[i + 1], 0, glyph[index]);
                                glyph.splice(index + 1, 1);

                                index = selected[i] + 1;
                            }
                        }

                        glyph.splice(selected[0], 0, glyph[index]);
                        glyph.splice(index + 1, 1);
                    }

                    program.viewer.setSelected(selected.map(function (u) {
                        return u + step;
                    }));

                    program.viewer.refresh(ttf);
                }
            }
        }

        /**
         * 绑定glyph列表
         *
         * @param {Object} program 全局对象
         */
        function bindViewer(program) {

            // 由于可能存在连续保存的情况，这里debounce一下
            var pushHistory = lang.debounce(function () {
                program.ttfManager.pushHistory();
            }, 200);

            program.viewer.on('del', function (e) {
                if (e.list) {
                    program.ttfManager.removeglyph(e.list);
                }
            })
            .on('edit', function (e) {

                if (e.lastEditing === e.list[0]) {
                    showEditor();
                    return;
                }

                if (program.editor.isChanged() && !confirm(i18n.lang.msg_confirm_save_glyph)) {
                    return;
                }

                $('.main').addClass('editing');
                $('.editor').addClass('editing');
                program.viewer.setEditing(e.list[0]);
                showEditor(e.list[0]);
            })
            .on('copy', function (e) {

                var list = program.ttfManager.getCopiedglyph(e.list);
                var clip = {
                    unitsPerEm: program.ttfManager.get().head.unitsPerEm,
                    glyph: list
                };
                clipboard.set(clip, 'glyph');

            })
            .on('cut', function (e) {
                var list = program.ttfManager.getglyph(e.list);
                var clip = {
                    unitsPerEm: program.ttfManager.get().head.unitsPerEm,
                    glyph: list
                };
                clipboard.set(clip, 'glyph');
                program.ttfManager.removeglyph(e.list);

            })
            .on('paste', function (e) {
                var clip = clipboard.get('glyph');
                if (clip && clip.glyph.length) {
                    // 根据 unitsPerEm 调整形状
                    if (program.ttfManager.get().head.unitsPerEm !== clip.unitsPerEm) {
                        var scale = program.ttfManager.get().head.unitsPerEm / (clip.unitsPerEm || 1024);
                        var glyphAdjust = require('fonteditor-core/ttf/util/glyphAdjust');
                        clip.glyph.forEach(function (g) {
                            glyphAdjust(g, scale, scale);
                        });
                    }
                    program.ttfManager.appendglyph(clip.glyph, program.viewer.getSelected());
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
                    var glyph = program.ttfManager.getglyph(selected)[0];
                    opt = {
                        unicode: glyph.unicode,
                        leftSideBearing: glyph.leftSideBearing,
                        rightSideBearing: glyph.advanceWidth - glyph.xMax
                    };
                }

                var SettingAdjustPos = settingSupport['adjust-pos'];
                !new SettingAdjustPos({
                    onChange: function (setting) {
                        setTimeout(function () {
                            program.ttfManager.adjustglyphPos(selected, setting);
                        }, 20);
                    }
                }).show(opt);

            })
            .on('adjust-glyph', function (e) {

                var SettingAdjustglyph = settingSupport['adjust-glyph'];
                !new SettingAdjustglyph({
                    onChange: function (setting) {
                        setTimeout(function () {
                            program.ttfManager.adjustglyph(program.viewer.getSelected(), setting);
                        }, 20);
                    }
                }).show();

            })
            .on('setting-font', function (e) {

                // 如果仅选择一个字形，则填充现有值
                var selected = program.viewer.getSelected();
                if (selected.length) {
                    var glyph = program.ttfManager.getglyph(selected)[0];
                    var Settingglyph = settingSupport.glyph;
                    !new Settingglyph({
                        onChange: function (setting) {
                            program.ttfManager.updateglyph(setting, selected[0]);
                        }
                    }).show({
                        unicode: glyph.unicode,
                        leftSideBearing: glyph.leftSideBearing,
                        rightSideBearing: glyph.advanceWidth - (glyph.xMax || 0),
                        name: glyph.name
                    });
                }

            })
            .on('find-glyph', function (e) {
                var SettingFindglyph = settingSupport['find-glyph'];
                !new SettingFindglyph({
                    onChange: function (setting) {
                        var glyphList = program.ttfManager.findglyph(setting);

                        if (glyphList.length) {
                            var pageSize = program.setting.get('editor').viewer.pageSize;
                            var page = Math.ceil(glyphList[0] / pageSize);

                            showTTF(program.ttfManager.get(), page, glyphList);
                        }
                        else {
                            program.loading.warn(i18n.lang.msg_no_related_glhph, 1000);
                        }
                    }
                }).show();

            })
            .on('download-glyph', function (e) {
                var SettingglyphDownload = settingSupport['glyph-download'];
                // 获取需要下载的图标，转换成简单字形
                var list = program.ttfManager.getCopiedglyph(e.list);
                !new SettingglyphDownload().show({
                    ttf: program.ttfManager.get(),
                    glyph: list[0]
                });

            })
            .on('setting-unicode', function (e) {
                var SettingUnicode = settingSupport.unicode;
                !new SettingUnicode({
                    onChange: function (setting) {
                        // 此处延迟处理
                        setTimeout(function () {
                            if (program.ttfManager.get()) {
                                var glyphList = program.viewer.getSelected();
                                program.ttfManager.setUnicode(setting.unicode, glyphList, setting.isGenerateName);
                            }
                        }, 20);
                    }
                }).show();
            })
            .on('setting-sync', function (e) {
                if (program.data.projectId) {

                    var syncConfig = program.project.getConfig(program.data.projectId).sync;
                    if (!syncConfig) {
                        syncConfig = {
                            name: program.ttfManager.get().name.fontFamily
                        };
                    }

                    var SettingSync = settingSupport.sync;
                    !new SettingSync({
                        onChange: function (setting) {
                            program.project.updateConfig(program.data.projectId, {
                                sync: setting ? $.extend(syncConfig, setting) : null
                            });
                            program.projectViewer.show(program.project.items(), program.data.projectId);
                        }
                    }).show(syncConfig);
                }
            })
            .on('refresh', function (e) {
                if (program.ttfManager.get()) {
                    showTTF(program.ttfManager.get(), 1);
                }
            })
            .on('moveleft', function (e) {
                var editingIndex = program.viewer.getEditing();
                if (program.editor.isVisible()) {
                    if (editingIndex <= 0) {
                        editingIndex = program.ttfManager.get().glyph.length;
                    }

                    if (program.editor.isChanged() && !confirm(i18n.lang.msg_confirm_save_glyph)) {
                        return;
                    }
                    program.viewer.setEditing(--editingIndex);
                    showEditor(editingIndex);
                }
                else {
                    var selected = program.viewer.getSelected();
                    if (selected.length) {
                        moveSelectedglyph(selected, true);
                        pushHistory();
                    }
                }

            })
            .on('moveright', function (e) {
                var editingIndex = program.viewer.getEditing();
                if (program.editor.isVisible()) {
                    if (editingIndex >= program.ttfManager.get().glyph.length - 1) {
                        editingIndex = -1;
                    }

                    if (program.editor.isChanged() && !confirm(i18n.lang.msg_confirm_save_glyph)) {
                        return;
                    }
                    program.viewer.setEditing(++editingIndex);
                    showEditor(editingIndex);
                }
                else {
                    var selected = program.viewer.getSelected();
                    if (selected.length) {
                        moveSelectedglyph(selected, false);
                        pushHistory();
                    }
                }
            });

            program.viewerPager.on('change', function (e) {
                showTTF(program.ttfManager.get(), e.page);
            });
        }

        function bindSpliter(program) {
            var adjustEditor = function () {
                var width = $('.editor').css('width');
                if (width) {
                    $('.main').css('margin-left', width);
                }
            };

            program
                .on('editor-show', function () {
                    // 为了防止多次绑定导致bug，这里先释放一下
                    program.editor.editor.render.resizeCapture.un('resize', adjustEditor);
                    program.editor.editor.render.resizeCapture.on('resize', adjustEditor);
                    adjustEditor();
                    program.spliter.enable();
                })
                .on('editor-hide', function () {
                    program.editor.editor.render.resizeCapture.un('resize', adjustEditor);
                    $('.main').css('margin-left', '');
                    program.spliter.disable();
                });

            program.spliter.disable()
                .on('change', function (e) {
                    var editor = $('.editor');
                    var width = editor.width();
                    if (e.delta + width > 400) {
                        editor.width(width + e.delta);
                        program.editor.editor.render.resizeCapture.fire('resize', e);
                    }
                });
        }

        /**
         * 绑定项目列表
         *
         * @param {Object} program 全局对象
         */
        function bindProject(program) {
            program.projectViewer.on('open', function (e) {
                var oldProjectId = program.data.projectId;
                program.project.get(e.projectId).then(function (imported) {
                    if (imported) {
                        if (program.ttfManager.isChanged() && !window.confirm(i18n.lang.msg_confirm_save_proj)) {
                            return;
                        }
                        program.ttfManager.set(imported);
                        program.data.projectId = e.projectId;
                        program.projectViewer.select(e.projectId);
                        program.viewer.focus();
                        window.localStorage.setItem('project-cur', e.projectId);
                    }
                }, function () {
                    if (window.confirm(i18n.lang.msg_error_open_proj)) {
                        var fnRemoveProject = function () {
                            program.projectViewer.show(program.project.items(), oldProjectId);
                        };
                        program.project.remove(e.projectId, true).then(fnRemoveProject, fnRemoveProject);
                    }
                });

            })
            .on('saveas', function () {
                program.data.projectId = null;
                actions.save();
                program.viewer.focus();
            })
            .on('sync', function (e) {
                actions['dosync'](e.projectId);
            })
            .on('del', function (e) {
                program.project.remove(e.projectId).then(function () {
                    if (e.projectId === program.data.projectId) {
                        program.data.projectId = null;
                    }
                }, function () {
                    program.loading.warn(i18n.lang.msg_error_del_proj, 1000);
                });

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

                // 初始化之后，启用菜单
                if (!program.menuInited) {
                    $('.action-groups [data-disabled="1"]').removeAttr('data-disabled');
                    program.menuInited = true;
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

            // 保存正在编辑的glyph
            var saveEditingglyph = function () {
                // 如果是正在编辑的
                var editingIndex = program.viewer.getEditing();
                if (editingIndex !== -1) {
                    program.ttfManager.replaceglyph(program.editor.getFont(), editingIndex);
                }
                // 否则新建font
                else {
                    program.ttfManager.insertglyph(program.editor.getFont());
                }

                program.editor.setChanged(false);
            };

            program.on('save', function (e) {
                if (program.ttfManager.get()) {
                    var saveType = e.saveType;
                    // 如果是强制save则直接保存正在编辑的glyph和项目
                    if (saveType === 'force') {
                        if (program.editor.isEditing()) {
                            saveEditingglyph();
                        }
                        actions.save();
                    }
                    else if (saveType === 'editor' || program.editor.isEditing()) {
                        saveEditingglyph();
                        program.viewer.blur();
                        program.editor.focus();
                    }
                    else {
                        actions.save();
                        program.editor.blur();
                        program.viewer.focus();
                    }
                }
            })
            .on('paste', function (e) {
                var clip = clipboard.get('glyph');
                if (clip && clip.glyph.length) {
                    if (!program.editor.isEditing()) {
                        program.viewer.fire('paste');
                    }
                    else {
                        program.editor.execCommand('addcontours', clip.glyph[0].contours, {
                            selected: true
                        });
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
                // F3, F4
                else if (e.keyCode === 114 || e.keyCode === 115) {
                    var ttf = program.ttfManager.get();
                    if (ttf) {
                        program.previewer.load(ttf, e.keyCode === 114 ? 'ttf' : 'woff');
                    }
                }
            })
            .on('font-error', function (e) {
                notifyError(e);
            });
        }


        return {

            /**
             * 初始化控制器
             *
             * @param {Object} curProgram 项目组件
             */
            init: function (curProgram) {

                // 设置当前的项目对象为指定的项目对象
                program = curProgram;

                bindViewer(program);
                bindSpliter(program);
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
                        return i18n.lang.msg_confirm_save_proj;
                    }
                };
            }
        };
    }
);
