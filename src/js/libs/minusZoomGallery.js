/* 
    Minus Zoom
*/
(function ($) {
    $.fn.extend({
        minusZoomGallery: function (options, callback) {
            var defaults = {
                title: '',
                closeButton: '<i class="icon-close"></i>',
                largeButtonPrev: '<i class="icon-ico_arrow-left"></i>',
                largeButtonNext: '<i class="icon-ico_arrow-right"></i>',
                thumbButtonPrev: '<i class="icon-ico_arrow-left"></i>',
                thumbButtonNext: '<i class="icon-ico_arrow-right"></i>',
                largeConfig: {
                    zoom: true,
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                    preloadImages: false,
                    lazy: true,
                    keyboardControl: true,
                    navigation: {
                        nextEl: '.zoom-swiper-large-button-next',
                        prevEl: '.zoom-swiper-large-button-prev',
                    },
                    pagination: {
                        el: '.swiper-pagination',
                        type: 'bullets',
                    },
                    /*thumbs: {
                        swiper: {
                            el: '.zoom-gallery .thumbs-wrapper',
                            slidesPerView: 4
                        }
                    }*/
                },
                thumbConfig: {
                    slideToClickedSlide: true,
                    slidesPerView: 4,
                    slidesPerGroup: 1,
                    onlyExternal: true,
                    spaceBetween: 20,
                    navigation: {
                        nextEl: '.zoom-swiper-thumb-button-next',
                        prevEl: '.zoom-swiper-thumb-button-prev',
                    },
                },

                ready: 'zoom-gallery-ready',
                animate: 'zoom-gallery-animate',


                /* 
                    template
                */
                template: {
                    wrp: '<div class="zoom-gallery"><div class="zoom-gallery-inner"><div class="zoom-gallery-header"><span class="title">{{title}}</span><a href="javascript:void(0);" class="close-btn">{{closeButton}}</a></div>{{large}}{{thumbs}}<div class="zoom-gallery-footer"></div></div></div>',
                    large: '<div class="large-wrapper swiper-container"><div class="swiper-inner"><ul class="swiper-wrapper">{{li}}</ul></div><div class="swiper-button-prev zoom-swiper-large-button-prev">{{largeButtonPrev}}</div><div class="swiper-button-next zoom-swiper-large-button-next">{{largeButtonNext}}</div><div class="swiper-pagination"></div></div>',
                    largeLi: '<li data-order="{{order}}" class="swiper-slide"><div class="swiper-zoom-container"><img data-src="{{src}}" class="swiper-lazy"></div><div class="swiper-lazy-preloader"></div></li>',
                    thumbs: '<div class="thumbs-wrapper swiper-container"><div class="swiper-inner"><ul class="swiper-wrapper">{{li}}</ul></div><div class="swiper-button-prev zoom-swiper-thumb-button-prev">{{thumbButtonPrev}}</div><div class="swiper-button-next zoom-swiper-thumb-button-next">{{thumbButtonNext}}</div></div>',
                    thumbsLi: '<li data-order="{{order}}" class="swiper-slide"><span><img src="{{src}}" border="0" /></span></li>'
                }
            };
            var options = $.extend(defaults, options);
            return this.each(function () {
                var opt = options,
                    ID = $(this),
                    main = {
                        el: {
                            con: '.zoom-gallery',
                            large: '.zoom-gallery .large-wrapper',
                            thumbs: '.zoom-gallery .thumbs-wrapper'
                        },
                        cls: {
                            active: 'active',
                            ready: opt['ready'],
                            animate: opt['animate'],
                            zoom: 'swiper-slide-zoomed'
                        },
                        gallery: null,
                        thumbs: null,
                        template: {
                            wrp: opt['template']['wrp'],
                            large: opt['template']['large'],
                            largeLi: opt['template']['largeLi'],
                            thumbs: opt['template']['thumbs'],
                            thumbsLi: opt['template']['thumbsLi']
                        },
                        getTemplate: function () {
                            var _t = this, htm = { large: '', thumbs: '' };

                            ID
                                .find('[data-large]')
                                .each(function (i) {
                                    var ths = $(this),
                                        large = ths.attr('data-large') || '',
                                        thumbs = ths.attr('data-thumb') || '';

                                    ths.attr('data-order', i);

                                    if (large != '')
                                        htm['large'] += _t.template['largeLi']
                                            .replace(/{{order}}/g, i)
                                            .replace(/{{src}}/g, large);

                                    if (thumbs != '')
                                        htm['thumbs'] += _t.template['thumbsLi']
                                            .replace(/{{order}}/g, i)
                                            .replace(/{{src}}/g, thumbs);
                                });

                            htm['large'] = _t.template['large']
                                .replace(/{{li}}/g, htm['large'])
                                .replace(/{{largeButtonPrev}}/g, opt['largeButtonPrev'])
                                .replace(/{{largeButtonNext}}/g, opt['largeButtonNext']);

                            htm['thumbs'] = _t.template['thumbs']
                                .replace(/{{li}}/g, htm['thumbs'])
                                .replace(/{{thumbButtonPrev}}/g, opt['thumbButtonPrev'])
                                .replace(/{{thumbButtonNext}}/g, opt['thumbButtonNext']);

                            return _t.template['wrp']
                                .replace(/{{closeButton}}/g, opt['closeButton'])
                                .replace(/{{large}}/g, htm['large'])
                                .replace(/{{thumbs}}/g, htm['thumbs'])
                                .replace(/{{title}}/g, opt['title'] || '');
                        },
                        add: function () {
                            var _t = this;
                            ID.after(_t.getTemplate());
                        },
                        initPlugins: function () {
                            var _t = this,
                                largeConfig = opt['largeConfig'] || {},
                                thumbConfig = opt['thumbConfig'] || {},
                                activeted = function () {
                                    /* 
                                        aktif olan thumb atanır
                                    */
                                    var bullet = $(_t.el.con).find('.swiper-pagination-bullet-active'),
                                        k = uty.detectEl(bullet) ? (bullet.index() || 0) : 0;

                                    $('.zoom-gallery .thumbs-wrapper li').eq(k).addClass(_t.cls['active']).siblings().removeClass(_t.cls['active']);
                                    k = k - 1;
                                    if (k <= 0) k = 0;
                                    _t.thumbs.slideTo(k, 333);
                                };

                            largeConfig['on'] = {
                                slideChangeTransitionStart: function () {
                                    activeted();
                                    $(_t.el.con).find('.' + _t.cls['zoom']).removeClass(_t.cls['zoom']);
                                }
                            };

                            _t.gallery = new Swiper(_t.el.large, largeConfig);
                            _t.thumbs = new Swiper(_t.el.thumbs, thumbConfig);

                            activeted();
                        },
                        addEvents: function () {
                            var _t = this, con = $(_t.el.con);

                            con
                                .find('.thumbs-wrapper li')
                                .bind('click', function () {
                                    var ths = $(this),
                                        n = ths.attr('data-order') || 0;
                                    _t.gallery.slideTo(n, 333);

                                });

                            ID
                                .find('[data-large]')
                                .bind('click', function () {
                                    var ths = $(this),
                                        n = ths.attr('data-order') || 0;

                                    _t.popup('show');

                                    setTimeout(function () {
                                        _t.gallery.update();
                                        _t.thumbs.update();
                                        _t.gallery.slideTo(n, 333);
                                    }, 100);
                                });

                            con
                                .find('.close-btn')
                                .bind('click', function () {
                                    _t.popup('hide');
                                });
                        },
                        popup: function (k) {
                            var _t = this;
                            if (k == 'show')
                                uty.cssClass({ 'ID': 'body', 'delay': 100, 'type': 'add', 'cls': [_t.cls['ready'], _t.cls['animate']] });
                            else
                                uty.cssClass({ 'ID': 'body', 'delay': 444, 'type': 'remove', 'cls': [_t.cls['animate'], _t.cls['ready']] });
                        },
                        init: function () {
                            var _t = this;
                            _t.add();
                            _t.initPlugins();
                            _t.addEvents();

                        }
                    };
                main.init();

                ///////// PUBLIC FUNC
                this.adjust = function (o) {

                };
            })
        }
    })
})(jQuery, window);