/* 
    MINUS TAB MENU 
*/
(function ($) {
    $.fn.extend({
        minusTab: function (options, callback) {
            var defaults = {
                swiperWrapperClass: '.swiper-container',
                content: '> .ems-tab-content > [rel]', // content
                tabNav: '> .ems-tab-header > [rel]', // tab menu button
                accNav: '> .ems-tab-content > div > .ems-tab-inner-header', // accordion menu button
                begin: 0,
                target: '.emosInfinite',
                ajx: {
                    target: '.urnList .emosInfinite',
                    typ: 'append'
                }
            };

            var option = $.extend(defaults, options);

            return this.each(function (e) {
                var opt = option,
                    ID = $(this),
                    content = ID.find(opt['content']),
                    tabNav = ID.find(opt['tabNav']),
                    accNav = ID.find(opt['accNav']),
                    main = {
                        cls: {
                            selected: 'selected',
                            ajx: 'ajx-loading',
                            loaded: 'ajx-loaded',
                            scrollerTrigger: 'scroller-trigger'
                        },
                        clicklable: true,
                        loading: function (k) {
                            var _t = this;
                            if (k == 'show')
                                ID.addClass(_t.cls['ajx']);
                            else
                                ID.removeClass(_t.cls['ajx']);
                        },
                        getUri: function (o) {
                            /* 
                               ex: /usercontrols/urunDetay/ajxIlgiliUrun.aspx?lang={{lang}}&urn={{prdCode}}&kat={{prdCat}}&ps=100&rp=1 
                            */
                            var _t = this,
                                elm = o['ID'],
                                uri = uty.cleanText(elm.attr('data-ajx') || ''),
                                code = uty.cleanText(elm.attr('data-code') || ''),
                                cat = uty.cleanText(elm.attr('data-cat') || '');
                            return uri.replace(/{{lang}}/g, lang).replace(/{{prdCode}}/g, code).replace(/{{prdCat}}/g, cat);
                        },
                        ajx: function (o) {
                            var _t = this,
                                target = o['ID'],
                                uri = o['uri'] || '';

                            if (uty.detectEl(target) && !target.hasClass(_t.cls['loaded'])) {
                                _t.clicklable = false;
                                _t.loading('show');
                                uty.ajx({ uri: uri }, function (d) {
                                    var responseType = 'error';
                                    if (d['type'] == 'success') {
                                        responseType = 'success';
                                        target.addClass(_t.cls['loaded']);
                                        d = uty.clearScriptTag(d['val'] || '');
                                        d = $('<div>' + d + '</div>').find(opt.ajx.target).html() || '';
                                        if (opt.target !== '')
                                            target = target.find(opt.target);

                                        if (uty.detectEl(target)) {
                                            var typ = opt.ajx['typ'] || '';
                                            if (typ == 'append') target.append(d);
                                            else if (typ == 'prepend') target.append(d);
                                            else if (typ == 'before') target.before(d);
                                            else if (typ == 'after') target.after(d);
                                            else target.html(d);
                                        }
                                    }
                                    stage.dispatchEvent("CustomEvent", "AJX_TAB_LOADED", { ID: ID, target: target, type: responseType });
                                    _t.loading('hide');
                                    _t.clicklable = true;
                                });
                            }
                        },
                        updateSwiper: function (target) {
                            var _t = this,
                                elm = target.find(opt['swiperWrapperClass']);
                            if (uty.detectEl(elm)) {
                                elm = elm.get(0);
                                if (typeof elm.update !== 'undefined')
                                    elm.update();
                            }
                        },
                        addEvent: function () {
                            var _t = this;

                            tabNav
                                .unbind('click')
                                .bind('click', function () {
                                    var ths = $(this),
                                        rel = ths.attr('rel') || '';

                                    if (rel != '' && _t.clicklable) {
                                        var target = ID.find(opt['content'] + '[rel="' + rel + '"]'),
                                            uri = _t.getUri({ ID: ths });

                                        target.add(ths).addClass(_t.cls['selected']).siblings().removeClass(_t.cls['selected']);

                                        if (uri != '')
                                            _t.ajx({ ID: target, uri: uri });

                                        _t.updateSwiper(target);
                                    }
                                });


                            accNav
                                .unbind('click')
                                .bind('click', function () {
                                    var ths = $(this),
                                        rel = ths.parent().attr('rel') || '';

                                    if (rel != '' && _t.clicklable) {
                                        var target = ID.find(opt['content'] + '[rel="' + rel + '"]'),
                                            uri = _t.getUri({ ID: ths });

                                        if (target.hasClass(_t.cls['selected']))
                                            target.add(target.siblings()).removeClass(_t.cls['selected']);
                                        else
                                            target.add(ths).addClass(_t.cls['selected']).siblings().removeClass(_t.cls['selected']);

                                        if (uri != '')
                                            _t.ajx({ ID: target, uri: uri });

                                        _t.updateSwiper(target);
                                    }
                                });

                            if (!ID.hasClass(_t.cls['scrollerTrigger']))
                                _t.trigger();
                        },
                        trigger: function () {
                            var _t = this;

                            var elm = ID.find(opt['tabNav'] + '.' + _t.cls['selected']);
                            if (!uty.detectEl(elm))
                                elm = ID.find(opt['tabNav']).eq(0);
                            elm.click();

                        },
                        adjust: function () {
                            var _t = this;
                            if (ID.hasClass(_t.cls['scrollerTrigger'])) {
                                if (uty.detectPosition({ ID: ID })) {
                                    ID.removeClass(_t.cls['scrollerTrigger']);
                                    _t.trigger();
                                }
                            }
                        },
                        init: function () {
                            var _t = this;
                            if (uty.detectEl(content) && (uty.detectEl(tabNav) || uty.detectEl(accNav)))
                                _t.addEvent();
                        }
                    };
                main.init();

                // public fonk
                this.adjust = function () {
                    main.adjust();
                };
            });
        }
    });
})(jQuery);