/* 
    MINUS CUSTOM SEARCH
*/
(function ($) {
    $.fn.extend({
        minusCustomSearch: function (options, callback) {
            var defaults = {
                btn: '.mini-search-info', // trigger button
                clearButton: '.mini-search-sub .sub-close',
                closeBtn: '.mini-search-overlay', // search close button
                input: '[id$="txtARM_KEYWORD"]', // search input

                // cls
                ajx: 'mini-search-ajx-loading',
                ready: 'mini-search-ready',
                animate: 'mini-search-animate',
                focused: 'mini-search-focused',
                keyup: 'mini-search-keyup',
                result: 'mini-search-result-found',
                noResult: 'mini-search-no-result',
            };

            var option = $.extend(defaults, options);

            return this.each(function (e) {
                var opt = option,
                    ID = $(this),
                    main = {
                        loading: function (k) {
                            var _t = this;
                            if (k == 'show')
                                bdy.addClass(opt['ajx']);
                            else
                                bdy.removeClass(opt['ajx']);
                        },
                        animate: function (k) {
                            var _t = this;
                            if (k == 'show')
                                uty.cssClass({ 'ID': 'body', 'delay': 100, 'type': 'add', 'cls': [opt['ready'], opt['animate']] });
                            else
                                uty.cssClass({ 'ID': 'body', 'delay': 444, 'type': 'remove', 'cls': [opt['animate'], opt['ready']] });
                        },
                        destroy: function () {
                            var _t = this,
                                input = $(opt['input']);

                            bdy.removeClass(opt['ready']).removeClass(opt['animate']).removeClass(opt['focused']).removeClass(opt['keyup']).removeClass(opt['noResult']).removeClass(opt['result']);
                            input.val('').blur();
                            if (typeof HideSuggestionsDiv !== 'undefined')
                                HideSuggestionsDiv();
                        },
                        addEvent: function () {
                            var _t = this,
                                input = $(opt['input']),
                                btn = $(opt['btn']),
                                closeBtn = $(opt['closeBtn']),
                                clearButton = $(opt['clearButton']);

                            if (uty.detectEl(btn))
                                btn
                                    .unbind('click')
                                    .bind('click', function () {
                                        var ths = $(this);
                                        if (bdy.hasClass(opt['ready'])) {
                                            _t.animate('hide');
                                            input.blur();
                                        } else {
                                            _t.animate('show');
                                            input.focus();
                                        }
                                    });

                            if (uty.detectEl(clearButton))
                                clearButton
                                    .unbind('click')
                                    .bind('click', function () {
                                        input.val('').focus();
                                        bdy.removeClass(opt['result']).removeClass(opt['noResult']);
                                        HideSuggestionsDiv();
                                    });

                            if (uty.detectEl(closeBtn))
                                closeBtn
                                    .unbind('click')
                                    .bind('click', function () {
                                        _t.animate('hide');
                                        setTimeout(function () {
                                            _t.destroy();
                                        }, 555);
                                    });

                            if (uty.detectEl(input))
                                input
                                    .bind('focus', function () {
                                        bdy.addClass(opt['focused']);
                                    })
                                    .bind('blur', function () {
                                        var ths = $(this),
                                            msg = uty.cleanText($('[id$="lbfARM_MESAJ"]').text() || ''),
                                            val = uty.cleanText(ths.val() || '').replace(msg, '');
                                        if (val.length == 0)
                                            bdy.removeClass(opt['focused']);
                                    })
                                    .bind('keyup', function () {
                                        var ths = $(this),
                                            val = uty.cleanText(ths.val() || '');
                                        if (val.length > 0)
                                            bdy.addClass(opt['keyup']);
                                        else
                                            bdy.removeClass(opt['keyup']);

                                        if (val.length < 3)
                                            bdy.removeClass(opt['result']).removeClass(opt['noResult']);
                                    });
                        },
                        set: function () {
                            var _t = this,
                                input = $(opt['input']);
                            /* sistem arama kutusunu ezmek */
                            if (uty.detectEl(input))
                                input.get(0).removeEventListener("blur", onFocusLost);
                        },
                        searchResult: function () {
                            var _t = this,
                                elm = $('.searchSuggestDivHolder'),
                                prd = (elm.find('.prd .sHolder').html() || '').trim(),
                                cat = (elm.find('.cat .sHolder').html() || '').trim();
                            if (prd != '' || prd != '')
                                bdy.addClass(opt['result']).removeClass(opt['noResult']);
                            else
                                bdy.addClass(opt['noResult']).removeClass(opt['result']);
                        },
                        init: function () {
                            var _t = this;
                            if (uty.detectEl($(opt['input']))) {
                                _t.set();
                                _t.addEvent();
                            }

                        }
                    };
                main.init();

                this.searchReady = function () {
                    main.loading('show');
                };
                this.searchComplete = function () {
                    main.loading('hide');
                    main.searchResult();
                };

            });
        }
    });
})(jQuery);