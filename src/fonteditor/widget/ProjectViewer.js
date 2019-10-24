/**
 * @file 项目列表查看器
 * @author mengke01(kekee000@gmail.com)
 */
import observable from 'common/observable';
import i18n from '../i18n/i18n';
import string from 'common/string';

export default class ProjectViewer {

    /**
     * 项目列表查看器
     *
     * @constructor
     * @param {HTMLElement} main 主元素
     * @param {Object} options 参数
     */
    constructor(main, options) {
        this.options = options || {};
        this.main = $(main);

        let me = this;

        me.main.on('click', '[data-action]', function (e) {
            e.stopPropagation();
            let target = $(e.target);
            let action = target.attr('data-action');
            let id = target.parents('[data-id]').attr('data-id');
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
    select(id) {
        this.current && this.current.removeClass('selected');
        this.current = $('[data-id="' + id + '"]', this.main).addClass('selected');
    }


    /**
     * 取消项目选中状态
     */
    unSelect() {
        this.current && this.current.removeClass('selected');
        this.current = null;
    }

    /**
     * 显示项目组
     *
     * @param {Array} projects 项目组
     * @param {string} selectedId 选中的项目名称
     */
    show(projects, selectedId) {
        let str = '';
        (projects || []).forEach(function (proj) {
            str += '<dl data-id="' + string.encodeHTML(proj.id) + '">'
                +       '<dt>' + string.encodeHTML(proj.name) + '</dt>'
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
    }
}

observable.mixin(ProjectViewer.prototype);
