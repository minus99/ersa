/* 
    MINUS SYSTEM WIDGET 
*/
(function ($) {
    $.fn.extend({
        minusSystemWidget: function (options, callback) {
            var defaults = {
                target: '.emosInfinite',
                ajx: {
                    target: '.ajxList .emosInfinite',
                    itemTarget: '> li',
                    typ: 'append'
                }
            };

            var option = $.extend(defaults, options);

            return this.each(function (e) {
                var opt = option,
                    ID = $(this),
                    main = {
                        cls: {
                            loading: 'ajx-loading',
                            noResult: 'no-result',
                            found: 'results-found',
                            active: 'widget-active',
                            items: 'items-',
                            scrollerTrigger: 'scroller-trigger',
                            slideClass: 'swiper-slide',
                            cartPrdCode: '.ems-grid-cart [data-prd-code]'
                        },
                        loading: function (k) {
                            var _t = this;
                            if (k == 'show')
                                ID.addClass(_t.cls['loading']);
                            else
                                ID.removeClass(_t.cls['loading']);
                        },
                        getPrdCode: function () {
                            return uty.cleanText(ID.attr('data-code') || $('[id$="hdnURN_KOD"]').val() || $(opt['cartPrdCode']).map(function () { return $(this).attr('data-prd-code') || '' }).get().join(',') || '');
                        },
                        getCatCode: function () {
                            return uty.cleanText(ID.attr('data-cat') || uty.trimText(minusLoc.get('?', 'kat', urlString)) || '');
                        },
                        getUri: function () {
                            /* 
                               ex: /usercontrols/urunDetay/ajxIlgiliUrun.aspx?lang={{lang}}&urn={{prdCode}}&kat={{prdCat}}&ps=100&rp=1 
                            */
                            var _t = this,
                                uri = uty.cleanText(ID.attr('data-uri') || ''),
                                code = _t.getPrdCode(),
                                cat = _t.getCatCode();
                            return uri.replace(/{{lang}}/g, lang).replace(/{{prdCode}}/g, code).replace(/{{prdCat}}/g, cat);
                        },
                        set: function () {
                            var _t = this,
                                uri = _t.getUri();

                            _t.loading('show');
                            uty.ajx({ uri: uri }, function (d) {
                                var responseType = 'error';
                                if (d['type'] == 'success') {
                                    responseType = 'success';
                                    d = uty.clearScriptTag(d['val'] || '');

                                    var ajxTargetWrp = $('<div>' + d + '</div>'),
                                        ajxTarget = ajxTargetWrp.find(opt.ajx.target).html() || '',
                                        ajxTargetItem = ajxTargetWrp.find(opt.ajx.target).find(opt.ajx.itemTarget),
                                        target = ID.find(opt.target);

                                    if (uty.detectEl(target) && uty.detectEl(ajxTargetItem)) {
                                        var typ = opt.ajx['typ'] || '';
                                        if (typ == 'append') target.append(ajxTarget);
                                        else if (typ == 'prepend') target.append(ajxTarget);
                                        else if (typ == 'before') target.before(ajxTarget);
                                        else if (typ == 'after') target.after(ajxTarget);
                                        else target.html(ajxTarget);

                                        ID
                                            .addClass(_t.cls['items'] + ajxTargetItem.length)
                                            .addClass(_t.cls['found'])
                                            .addClass(_t.cls['active']);
                                    } else
                                        ID
                                            .addClass(_t.cls['noResult']);
                                }
                                stage.dispatchEvent("CustomEvent", "SYSTEM_WIDGET_LOADED", { ID: ID, type: responseType });
                                _t.loading('hide');
                            });
                        },
                        adjust: function () {
                            var _t = this;
                            if (ID.hasClass(_t.cls['scrollerTrigger'])) {
                                if (uty.detectPosition({ ID: ID })) {
                                    ID.removeClass(_t.cls['scrollerTrigger']);
                                    _t.set();
                                }
                            }
                        },
                        init: function () {
                            var _t = this;
                            if (!ID.hasClass(_t.cls['scrollerTrigger']))
                                _t.set();
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