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
            this.main.delegate('[data-name]', 'click', function(e) {
                me.fire('open', {
                    projectName: $(this).attr('data-name')
                });
            });
        }

        ProjectViewer.prototype.show = function(projects) {
            var str = '';
            (projects || []).forEach(function(proj) {
                str += '<div data-name="'+ proj.name +'" data-id="'+ proj.id +'"><a href="javascript:;">'+ proj.name +'</a></div>';
            });

            this.main.html(str);
        };

        require('common/observable').mixin(ProjectViewer.prototype);

        return ProjectViewer;
    }
);
