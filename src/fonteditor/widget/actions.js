/**
 * @file actions.js
 * @author mengke01
 * @date 
 * @description
 * 命令接口
 */


define(
    function(require) {
        var setting = require('../widget/setting');
        var program = require('../widget/program');
        var ajaxBinaryFile = require('common/ajaxBinaryFile');
        var string = require('common/string');

        var actions = {

            // 新建
            'new': function() {
                if (program.ttfmanager.isChanged() && !window.confirm('是否放弃保存当前项目?')) {
                    return;
                }
                $.getJSON('./src/fonteditor/data/empty.json', function(imported) {
                    program.ttfmanager.set(imported);
                    program.data.projectName = null;
                });
            },

            // 打开
            'open': function() {
                $('#font-import').click();
            },

            // 导入
            'import': function() {
                $('#font-import').click();
            },

            // 导出
            'export': function() {

            },

            // 导出文件
            'export-file': function(e) {
                if (program.ttfmanager.get()) {
                    var target = $(e.target);
                    program.exporter.export(program.ttfmanager.get(), {
                        type: target.attr('data-type'),
                        target: target
                    });
                }
            },

            // 保存项目
            'save': function() {
                if (program.ttfmanager.get()) {
                    var name = '';
                    if(name = window.prompt('请输入项目名称：')) {
                        name = string.encodeHTML(name);
                        var list = program.project.add(name, program.ttfmanager.get());
                        program.projectViewer.show(list);
                        program.data.projectName = name;
                        program.ttfmanager.setState('new');
                    }
                }
            },

            // 添加新字形
            'add-new': function() {
                program.ttfmanager.addGlyf({
                    name: '',
                    unicode:[]
                });
            },

            // 添加在线字形
            'add-online': function() {
                var dlg = new setting.online({
                    onChange: function(url) {
                        // 此处延迟处理
                        setTimeout(function(){
                            program.loading.show('正在加载..', 1000);
                            ajaxBinaryFile({
                                url: url,
                                onSuccess: function(buffer) {
                                    program.loader.load(buffer, {
                                        type: 'ttf',
                                        success: function(imported) {
                                            program.loading.hide();
                                            if (program.ttfmanager.get()) {
                                                program.ttfmanager.merge(imported, {
                                                    scale: true
                                                });
                                            }
                                            else {
                                                program.ttfmanager.set(imported);
                                                program.data.projectName = null;
                                            }

                                        }
                                    });
                                },
                                onError: function() {
                                    alert('加载文件错误!');
                                }
                            });
                        }, 20);
                    }
                });

                dlg.show();
            },

            // 设置unicode
            'setting-unicode': function() {
                var dlg = new setting.unicode({
                    onChange: function(unicode) {
                        // 此处延迟处理
                        setTimeout(function(){
                            if (program.ttfmanager.get()) {
                                var glyfList = program.viewer.getSelected();
                                program.ttfmanager.setUnicode(unicode, glyfList);
                            }
                        }, 20);
                    }
                });

                dlg.show();
            },

            // 调整字形位置
            'setting-adjust-pos': function() {
                var ttf = program.ttfmanager.get();
                if (ttf) {
                    var dlg = new setting['adjust-pos']({
                        onChange: function(setting) {
                            setTimeout(function() {
                                program.ttfmanager.adjustGlyfPos(setting, selected);
                            }, 20);
                        }
                    });

                    // 如果仅选择一个字形，则填充现有值
                    var selected = program.viewer.getSelected();
                    if (selected.length === 1) {
                        var glyf = program.ttfmanager.getGlyf(selected)[0];
                        dlg.show({
                            leftSideBearing: glyf.leftSideBearing || '',
                            rightSideBearing: glyf.advanceWidth - glyf.xMax || ''
                        });
                    }
                    else {
                        dlg.show();
                    }
                }
            },

            // 调整字形
            'setting-adjust-glyf': function() {
                var ttf = program.ttfmanager.get();
                if (ttf) {
                    var dlg = new setting['adjust-glyf']({
                        onChange: function(setting) {
                            setTimeout(function() {
                                program.ttfmanager.adjustGlyf(setting, program.viewer.getSelected());
                            }, 20);
                        }
                    });
                    
                    dlg.show();
                }
            },

            // 设置字体名称
            'setting-name': function() {
                var ttf = program.ttfmanager.get();
                if (ttf) {
                    var dlg = new setting.name({
                        onChange: function(setting) {
                            program.ttfmanager.setInfo(setting);
                        }
                    });
                    dlg.show($.extend({}, ttf.head, ttf.name));
                }
            },

            // 调整规格
            'setting-metrics': function() {
                var ttf = program.ttfmanager.get();
                if (ttf) {
                    var dlg = new setting['metrics']({
                        onChange: function(setting) {
                            program.ttfmanager.setMetrics(setting);
                        }
                    });
                    
                    dlg.show($.extend({}, ttf['OS/2'], ttf.hhea, ttf.post));
                }
            }
        };

        return actions;
    }
);
