/**
 * @file 项目列表查看器
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function (require) {
        var i18n = require('../i18n/i18n');

        /**
         * 项目列表查看器
         *
         * @constructor
         * @param {HTMLElement} main 主元素
         * @param {Object} options 参数
         */
        function ProjectViewer(main, options) {
            this.options = options || {};
            this.main = $(main);

            var me = this;

            me.main.on('click', '[data-action]', function (e) {
                e.stopPropagation();
                var target = $(e.target);
                var action = target.attr('data-action');
                var id = target.parents('[data-id]').attr('data-id');
                if ('del' === action) {
                    if (!window.confirm(i18n.lang.msg_confirm_del_proj)) {
                        return;
                    }
                    me.current && me.current.remove();
                    me.current = null;
                }

                me.fire(action, {
                    projectId: id
                });
            });

            me.main.on('click', '[data-id]', function (e) {
                me.fire('open', {
                    projectId: $(this).attr('data-id')
                });
            });
        }

        /**
         * 选中一个项目
         *
         * @param {string} id 项目编号
         */
        ProjectViewer.prototype.select = function (id) {
            this.current && this.current.removeClass('selected');
            this.current = $('[data-id="' + id + '"]').addClass('selected');
        };

        /**
         * 显示项目组
         *
         * @param {Array} projects 项目组
         * @param {string} selectedId 选中的项目名称
         */
        ProjectViewer.prototype.show = function (projects, selectedId) {
            var str = '';
            (projects || []).forEach(function (proj) {
                str += '<dl data-id="' + proj.id + '">'
                    +       '<dt>' + proj.name + '</dt>'
                    +       '<dd>'
                    +           (proj.config && proj.config.sync
                                  ? ('<span data-action="sync" title="'
                                    + i18n.lang.syncfont + '">'
                                    + i18n.lang.sync + '</span>')
                                  : ''
                                )
                    +           '<span data-action="saveas">' + i18n.lang.saveas + '</span>'
                    +           '<span data-action="del">' + i18n.lang.del + '</span>'
                    +       '</dd>'
                    +   '</dl>';
            });

            this.main.html(str);
            if (undefined !== selectedId) {
                this.select(selectedId);
            }
        };

        require('common/observable').mixin(ProjectViewer.prototype);

        return ProjectViewer;
    }
);
