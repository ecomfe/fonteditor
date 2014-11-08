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
        var ajaxFile = require('common/ajaxFile');
        var string = require('common/string');

        // 读取在线字体
        function readOnlineFont(type, url) {
            ajaxFile({
                type: type === 'svg' ? 'xml' : 'binary',
                url: url,
                onSuccess: function(buffer) {
                    program.loader.load(buffer, {
                        type: type || 'ttf',
                        success: function(imported) {
                            program.loading.hide();
                            if (program.ttfManager.get()) {
                                program.ttfManager.merge(imported, {
                                    scale: true
                                });
                            }
                            else {
                                program.ttfManager.set(imported);
                                program.data.projectName = null;
                            }

                        }
                    });
                },
                onError: function() {
                    alert('加载文件错误!');
                }
            });
        }


        var actions = {

            // 新建
            'new': function() {
                if (program.ttfManager.isChanged() && !window.confirm('是否放弃保存当前项目?')) {
                    return;
                }
                $.getJSON('./font/empty.json', function(imported) {
                    program.ttfManager.set(imported);
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
            'export': function(e) {
                if (!e.target.getAttribute('download')) {
                    e.preventDefault();
                }
            },

            // 导出文件
            'export-file': function(e) {
                if (program.ttfManager.get()) {
                    var target = $(e.target);
                    program.exporter['export'](program.ttfManager.get(), {
                        type: target.attr('data-type'),
                        target: target,
                        originEvent: e,
                        error: function() {
                            e.preventDefault();
                        }
                    });
                }
            },

            // 保存项目
            'save': function() {
                if (program.ttfManager.get()) {
                    var name = '';
                    if ((name = window.prompt('请输入项目名称：'))) {
                        name = string.encodeHTML(name);
                        var list = program.project.add(name, program.ttfManager.get());
                        program.projectViewer.show(list);
                        program.data.projectName = name;
                        program.ttfManager.setState('new');
                    }
                }
            },

            // 添加新字形
            'add-new': function() {
                if (program.ttfManager.get()) {
                    var selected = program.viewer.getSelected();
                    program.ttfManager.insertGlyf({
                        name: '',
                        unicode:[]
                    }, selected[0]);
                }
            },

            // 添加在线字形
            'add-online': function() {
                var dlg = new setting.online({
                    onChange: function(url) {
                        // 此处延迟处理
                        setTimeout(function(){
                            program.loading.show('正在加载..', 1000);
                            readOnlineFont(url.slice(url.lastIndexOf('.') + 1), url);
                        }, 20);
                    }
                });

                dlg.show();
            },

            // 线上地址
            'add-url': function() {
                    var dlg = new setting.url({
                        onChange: function(url) {
                            // 此处延迟处理
                            setTimeout(function(){
                                program.loading.show('正在加载..', 1000);
                                var fontUrl = string.format(program.fontUrl, [encodeURIComponent(url)]);
                                readOnlineFont(url.slice(url.lastIndexOf('.') + 1), fontUrl);
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
                            if (program.ttfManager.get()) {
                                var glyfList = program.viewer.getSelected();
                                program.ttfManager.setUnicode(unicode, glyfList);
                            }
                        }, 20);
                    }
                });

                dlg.show();
            },

            // 调整字形信息
            'setting-glyf': function() {
                var ttf = program.ttfManager.get();
                if (ttf) {

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
                    else {
                        alert('请选中一个字形!');
                    }
                }
            },

            // 调整字形位置
            'setting-adjust-pos': function() {
                var ttf = program.ttfManager.get();
                if (ttf) {
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
                }
            },

            // 调整字形
            'setting-adjust-glyf': function() {
                var ttf = program.ttfManager.get();
                if (ttf) {
                    var dlg = new setting['adjust-glyf']({
                        onChange: function(setting) {
                            setTimeout(function() {
                                program.ttfManager.adjustGlyf(setting, program.viewer.getSelected());
                            }, 20);
                        }
                    });
                    
                    dlg.show();
                }
            },

            // 设置字体名称
            'setting-name': function() {
                var ttf = program.ttfManager.get();
                if (ttf) {
                    var dlg = new setting.name({
                        onChange: function(setting) {
                            program.ttfManager.setInfo(setting);
                        }
                    });
                    dlg.show($.extend({}, ttf.head, ttf.name));
                }
            },

            // 调整规格
            'setting-metrics': function() {
                var ttf = program.ttfManager.get();
                if (ttf) {
                    var dlg = new setting['metrics']({
                        onChange: function(setting) {
                            program.ttfManager.setMetrics(setting);
                        }
                    });
                    
                    dlg.show($.extend({}, ttf['OS/2'], ttf.hhea, ttf.post));
                }
            },

            // 预览
            'preview': function(e) {
                var ttf = program.ttfManager.get();
                if (ttf) {
                    var format = e.target.getAttribute('data-format');
                    program.previewer.load(ttf, format);
                }
            },

        };

        return actions;
    }
);
