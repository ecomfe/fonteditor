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

            me.main.delegate('[data-action]', 'click', function(e) {
                e.stopPropagation();
                var the = $(this);
                me.fire(the.attr('data-action'), {
                    projectName: the.parent().attr('data-name')
                });
            });

            me.main.delegate('[data-name]', 'click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                me.fire('open', {
                    projectName: $(this).attr('data-name')
                });
            });
        }

        ProjectViewer.prototype.show = function(projects) {
            var str = '';
            (projects || []).forEach(function(proj) {
                str += '<div data-name="'+ proj.name +'" data-id="'+ proj.id +'">'
                    +       '<i title="删除" data-action="del" class="ico i-del"></i>'
                    +       '<a href="#">'+ proj.name +'</a>'
                    +   '</div>';
            });

            this.main.html(str);
        };

        require('common/observable').mixin(ProjectViewer.prototype);

        return ProjectViewer;
    }
);
