/*
    Minus Filter
*/

(function ($) {
    $.fn.extend({
        MinusCategoryFilter: function (options, callback) {
            var defaults = {
                target: '.ems-page-product-list', // ajx ile htmlin dolacağı kapsayici div
                btn: '.urunKiyaslamaOzellik_ozellik a, .menuKategori li > a, .urunPaging_pageNavigation a', // ajx button olacak tüm nesneler buraya tanımlanır


                mobiBtn: '.btn-filter-popup', // mobilde filtre popup açma
                mobiCloseBtn: '.btn-filter-popup-close', // mobilde filtre popup açma

                // cls
                loading: 'ajx-loading', // ajx yüklenirken body class
                popupReady: 'ems-filter-ready', // mobile filtre açılması
                popupAnimate: 'ems-filter-animate'
            };

            var option = $.extend(defaults, options);

            return this.each(function (e) {
                var opt = option,
                    ID = $(this),
                    _dispatch = function (obj) {
                        obj = obj || {};
                        stage.dispatchEvent("CustomEvent", 'LIST_LOADED', $.extend({ ID: ID, con: opt['target'] }, obj));
                    },
                    _callback = function (obj) {
                        obj = obj || {};
                        if (typeof callback !== 'undefined')
                            callback($.extend({ ID: ID, target: opt['target'] }, obj));
                    },
                    main = {
                        el: {
                            target: opt['target'],
                            btn: opt['btn'],
                            mobiBtn: opt['mobiBtn'],
                            mobiCloseBtn: opt['mobiCloseBtn']
                        },
                        cls: {
                            loading: opt['loading'],
                            popupReady: opt['popupReady'],
                            popupAnimate: opt['popupAnimate']
                        },
                        trigger: function (o) {
                            o = o || {};
                            _dispatch(o);
                            _callback(o);
                        },
                        loading: function (k) {
                            var _t = this;
                            if (k == 'add')
                                bdy.addClass(_t['cls']['loading']);
                            else
                                bdy.removeClass(_t['cls']['loading']);
                        },
                        popup: function (k) {
                            var _t = this;
                            if (k == 'show') {
                                bdy.addClass(opt['popupReady']);
                                setTimeout(function () {
                                    bdy.addClass(opt['popupAnimate']);
                                }, 100);
                            } else {
                                bdy.removeClass(opt['popupAnimate']);
                                setTimeout(function () {
                                    bdy.removeClass(opt['popupReady']);
                                }, 300);
                            }
                        },
                        ajx: function (o) {
                            var _t = this, uri = o['uri'];
                            _t.loading('add');
                            uty.ajx({ uri: uri }, function (k) {
                                if (k['type'] == 'success')
                                    _t.ajxResult({ val: k['val'] || '', uri: uri });
                                _t.loading('remove');
                            });
                        },
                        ajxResult: function (o) {
                            var _t = this,
                                target = $(_t.el.target),
                                ajxTargetCon = $('<div>' + o['val'] + '</div>'), // ajx yüklenen sayfa
                                ajxTarget = ajxTargetCon.find(_t.el.target), // ajx yüklenen sayfanın içerisindeki hedef alan
                                ttl = ajxTargetCon.find('title').text() || document.title || '', // ajx yüklenen sayfanın title
                                uri = o['uri'],
                                type = 'error';

                            if (uty.detectEl(target) && uty.detectEl(ajxTarget)) {
                                type = 'success';
                                $('title').text(ttl); // ajx ile yüklenen sayfanın title mevcut title ile değiştirir
                                target.html(uty.clearScriptTag(ajxTarget.html() || ''));
                                history.pushState({ Url: uri, Page: ttl }, ttl, uri);
                                _t.trigger({ type: type });
                                _t.init(); // domdaki nesneler silindiği için filter tekrardan tetiklenir.
                            } else
                                _t.trigger({ type: type });
                        },
                        addEvent: function () {
                            var _t = this;
                            $(_t.el.btn)
                                .unbind('click')
                                .bind('click', function (evt) {
                                    if (history.pushState) {
                                        evt.preventDefault();
                                        var ths = $(this), uri = ths.attr('href') || '';
                                        if (uri != '' && uri.indexOf('javascript') == -1)
                                            _t.ajx({ uri: uty.convertHttps(uri) });
                                    }
                                });


                            $(_t.el.mobiBtn)
                                .unbind('click')
                                .bind('click', function (evt) {
                                    if (bdy.hasClass(_t.cls['popupReady']))
                                        _t.popup('hide');
                                    else
                                        _t.popup('show');
                                });

                            $(_t.el.mobiCloseBtn)
                                .unbind('click')
                                .bind('click', function (evt) {
                                    _t.popup('hide');
                                });

                            if (history.pushState)
                                window.onpopstate = function (event) {
                                    setTimeout(function () {
                                        _t.ajx({ uri: uty.convertHttps(event.state ? event.state.Url : window.location.href) });
                                    }, 1);
                                };
                        },
                        init: function () {
                            var _t = this;
                            _t.addEvent();
                        }
                    };
                main.init();

                this.setURI = function (o) {
                    o = o || {};
                    var uri = o['uri'] || '';
                    main.ajx({ uri: uty.convertHttps(uri) });
                };
            });
        }
    });
})(jQuery);