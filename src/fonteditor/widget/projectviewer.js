/**
 * @file projectViewer.js
 * @author mengke01
 * @date 
 * @description
 * 项目浏览器
 */


define(
    function(require) {

        /**
         * 项目查看器
         * 
         * @constructor
         * @param {HTMLElement} main 主元素
         * @param {Object} options 参数
         */
        function ProjectViewer(main, options) {
            this.options = options || {};
            this.main = $(main);

            var me = this;

            me.main.on('click', '[data-action]', function(e) {
                e.stopPropagation();
                var target = $(e.target);
                var action = target.attr('data-action');
                var id = target.parents('[data-id]').attr('data-id');
                if ('del' === action) {

                    if (!window.confirm('是否删除项目?')) {
                        return;
                    }

                    me.current && me.current.remove();
                    me.current = null;
                }

                me.fire(action, {
                    projectId: id
                });
            });

            me.main.on('click', '[data-id]', function(e) {
                me.fire('open', {
                    projectId: $(this).attr('data-id')
                });
            });
        }

        ProjectViewer.prototype.select = function(id) {
            this.current && this.current.removeClass('selected');
            this.current = $('[data-id="'+ id +'"]').addClass('selected');
        };

        ProjectViewer.prototype.show = function(projects) {
            var str = '';
            (projects || []).forEach(function(proj) {
                str += '<dl data-id="'+ proj.id +'">'
                    +       '<dt>'+ proj.name +'</dt>'
                    +       '<dd>'
                    +           '<span data-action="saveas">另存为</span>'
                    +           '<span data-action="del">删除</span>'
                    +       '</dd>'
                    +   '</dl>';
            });

            this.main.html(str);
        };

        require('common/observable').mixin(ProjectViewer.prototype);

        return ProjectViewer;
    }
);
