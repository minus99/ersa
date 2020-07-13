/* 
    MINUS POPULAR WORLDS
*/
(function ($) {
    $.fn.extend({
        minusSearchPopularWorlds: function (options, callback) {
            var defaults = {
                input: '[id="txtARM_KEYWORD"]',
                btn: '[data-keyword]',
                attr: 'data-keyword'
            };

            var option = $.extend(defaults, options);

            return this.each(function (e) {
                var opt = option,
                    ID = $(this),
                    main = {
                        addEvent: function () {
                            var _t = this,
                                btn = ID.find(opt['btn']),
                                input = $(opt['input']);

                            if (uty.detectEl(btn))
                                btn
                                    .unbind('click')
                                    .bind('click', function (evt) {
                                        evt.preventDefault();
                                        var ths = $(this),
                                            keyword = uty.trimText(ths.attr(opt['attr']) || '');
                                        if (keyword != '') {
                                            input.val(keyword);
                                            generateSearchLink();
                                        }
                                    });
                        },
                        init: function () {
                            var _t = this;
                            _t.addEvent();
                        }
                    };
                main.init();
            });
        }
    });
})(jQuery);