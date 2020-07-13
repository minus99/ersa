/* 
    KATEGORI SWIPER
*/
(function ($) {
    $.fn.extend({
        MinusCategorySwiper: function (options, callback) {
            var defaults = {
                target: '.categories-append',
                activeElem: '.act',
                otherTarget: '.kutuKategori_icerik', // aktif elemanı bulamadığı zaman kullanılacak
                appendType: 'append', // append, prepend, before, after
                temp: '<div class="swiper-container swiper-categories not-trigger"><div class="swiper-inner">{{htm}}</div></div>',
                swiperTrigger: true,
                addAllBtn: null, // oluşturulan kategori ağacında tümü seçeneği isteniyorsa buraya eklenecek olan lbf belirtilir. 
            };

            var option = $.extend(defaults, options);

            return this.each(function (e) {
                var opt = option,
                    ID = $(this),
                    main = {
                        getTemplate: function (o) {
                            var _t = this;
                            return opt['temp'].replace(/{{htm}}/g, o['htm'] || '');
                        },
                        add: function (o) {
                            var _t = this,
                                htm = o['htm'] || '',
                                typ = opt['appendType'] || '',
                                target = $(opt['target'] || '');

                            if (typ == 'append')
                                target.append(htm);
                            else if (typ == 'prepend')
                                target.append(htm);
                            else if (typ == 'before')
                                target.before(htm);
                            else if (typ == 'after')
                                target.after(htm);
                            else
                                target.html(htm);
                        },
                        getHtml: function (ID) {
                            var _t = this,
                                lbfAll = $(opt.addAllBtn),
                                btn = ID.find('> a');

                            /* tümü butonu eklenecek */
                            if (uty.detectEl(btn) && uty.detectEl(lbfAll)) {
                                btn.html(lbfAll.html());
                                btn = $('<li>' + (btn.get(0).outerHTML || '') + '</li>');
                                ID.find('ul').prepend(btn);
                            }

                            return ID.find('ul').get(0).outerHTML || '';
                        },
                        set: function () {
                            var _t = this,
                                act = uty.detectEl(ID.find(opt['activeElem'])) ? ID.find(opt['activeElem']) : $(opt['otherTarget']),
                                elm = uty.detectEl(act.find('> ul')) ? act : act.parents('li').eq(0);
                            if (uty.detectEl(elm.find('ul'))) {
                                _t.add({ htm: _t.getTemplate({ htm: _t.getHtml(elm.clone()) }) });
                                _t.initPlugins();
                            }

                        },
                        initPlugins: function () {
                            var _t = this;
                            if (opt['swiperTrigger']) {
                                var swiper = $(opt['target']).find('.swiper-container');
                                if (uty.detectEl(swiper)) {
                                    swiper
                                        .find('.swiper-inner > ul')
                                        .removeAttr('class')
                                        .removeAttr('style')
                                        .removeAttr('rel')
                                        .addClass('swiper-wrapper')
                                        .find('> li')
                                        .addClass('swiper-slide');

                                    var act = (swiper.find(opt['activeElem']).index() || 0) - 1;
                                    new Swiper(swiper, {
                                        initialSlide: act,
                                        slidesPerView: 'auto',
                                        slidesPerGroup: 1
                                    });
                                }
                            }
                        },
                        init: function () {
                            var _t = this;
                            _t.set();
                        }
                    };
                main.init();
            });
        }
    });
})(jQuery);
