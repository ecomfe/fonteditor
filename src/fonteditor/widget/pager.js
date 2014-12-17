/**
 * @file pager.js
 * @author mengke01
 * @date
 * @description
 * 分页组件
 */

define(
    function(require) {

        var lang = require('common/lang');
        var observable = require('common/observable');

        var PAGER_TPL = ''
            + '<button data-pager="prev" type="button" class="btn btn-flat btn-new btn-sm">上一页</button>'
            + '<input data-pager="text" type="text" class="form-control">'
            + '<span data-pager="info"></span>'
            + '<button data-pager="goto" type="button" class="btn btn-flat btn-new btn-sm">转到</button>'
            + '<button data-pager="next" type="button" class="btn btn-flat btn-new btn-sm">下一页</button>';


        /**
         * pager构造函数
         *
         * @constructor
         * @param {HTMLElement} main 主元素
         * @param {Object} options 参数
         */
        function Pager(main, options) {
            this.main = $(main);
            this.options = options || {};

            this.main.html(PAGER_TPL);
            this.textPage = this.main.find('input[data-pager="text"]');

            var me = this;
            me.main.on('click', 'button[data-pager]', function(e) {

                if (this.getAttribute('data-disabled')) {
                    return;
                }

                var action = this.getAttribute('data-pager');
                var page = me.page;
                if (action === 'prev') {
                    page = me.page > 1 ? me.page - 1 : 1;
                }
                else if (action === 'next') {
                    page = me.page < me.totalPage ? me.page + 1 : me.totalPage;
                }
                else if (action === 'goto') {
                    var p = +me.textPage.val();
                    if (p >= 1 && p <= me.totalPage) {
                        page = p;
                    }
                    else {
                        page = me.page;
                    }
                }

                me.textPage.val(page);

                if (page !== me.page) {
                    me.page = page;
                    me.fire('change', {
                        page: page
                    });
                }
            });

            me.textPage.on('keyup', function(e) {
                if (e.keyCode === 13) {
                    var page = +this.value.trim();
                    if (page >= 1 && page <= me.totalPage) {
                        me.page = page;
                        me.fire('change', {
                            page: page
                        });
                    }
                    else {
                        this.value = me.page;
                    }
                }
            });
        }

        /**
         * 显示pager
         *
         * @param {number} page 当前页码
         * @param {number} pageSize 分页大小
         * @param {number} total 总个数
         */
        Pager.prototype.show = function(page, pageSize, total) {
            if (total <= pageSize) {
                this.hide();
            }
            else {
                this.page = page;
                this.totalPage = Math.ceil(total / pageSize);
                this.main.find('[data-pager="text"]').val(page);
                this.main.find('[data-pager="info"]').html('/ ' + this.totalPage);
                this.main.find('[data-pager="prev"]')[page === 1 ? 'attr' : 'removeAttr']('data-disabled', 1);
                this.main.find('[data-pager="next"]')[page === this.totalPage ? 'attr' : 'removeAttr']('data-disabled', 1);
            }
            this.main.show();
        };

        /**
         * 隐藏
         */
        Pager.prototype.hide = function() {
            this.main.hide();
        };

        /**
         * 注销
         */
        Pager.prototype.dispose = function() {
            this.main.un('click', 'button[data-pager]');
            me.main.find('input[data-pager="text"]').un('keyup');
        };

        observable.mixin(Pager.prototype);

        return Pager;
    }
);
