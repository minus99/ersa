/*
    Minus Swiper
*/
(function ($) {
    $.fn.extend({
        minusSwiper: function (options, callback) {
            var defaults = {
                innerClass: '> .swiper-inner',
                wrapperClass: '.swiper-wrapper',
                slideClass: '> .swiper-slide',
                lazy: '.lazy, .lazy-load, .lazy-back-load, .lazyload, .lazy-swiper, .lazy-mobi-swiper, .lazy-desktop-swiper, .picture-lazy',
                videoStretching: 'fill'
            };

            var option = $.extend(defaults, options);

            return this.each(function (e) {
                var opt = option,
                    ID = $(this),
                    duration = ID.attr('data-duration') || '',
                    _dispatch = function (obj) {
                        stage.dispatchEvent("CustomEvent", "SWIPER_ACTIVE_ELEMENT", $.extend({ ID: ID }, obj));
                    },
                    _callback = function (obj) {
                        if (typeof callback !== 'undefined')
                            callback($.extend({ ID: ID }, obj));
                    },
                    _videos = {
                        el: {
                            con: '.slide-video',
                            button: '.slide-video-btn',
                            video: 'video',
                            activeVideo: '.swiper-slide-active .slide-video-btn'

                        },
                        cls: {
                            activeVideo: 'video-active',
                            isPause: 'isPause',
                            isPlay: 'isPlay'
                        },
                        arr: {},
                        activeted: function () {
                            var _t = this,
                                elm = ID.find(_t.el.activeVideo);

                            if (uty.detectEl(elm))
                                elm.get(0).click();
                        },
                        disabled: function () {
                            var _t = this;

                            ID
                                .find('.' + _t.cls['isPlay'])
                                .removeClass(_t.cls['isPlay'])
                                .removeClass(_t.cls['activeVideo']);

                            $.each(_t.arr, function (ind, item) {
                                item.pause();
                            });

                            _t.activeted();
                        },
                        playVideo: function (ths) {
                            var _t = this;
                            var order = ths.attr('data-order') || '',
                                prts = ths.parents('li').eq(0),
                                vid = _t.arr[order] || '';

                            if (vid != '') {
                                vid.play();
                                prts.addClass(_t.cls['isPlay']).addClass(_t.cls['activeVideo']);
                                _autoPlay({ type: 'stop' });
                            } else
                                console.error('swiper video html kontrol et');
                        },
                        addEvent: function () {
                            var _t = this;
                            ID
                                .find(_t.el.button)
                                .unbind('click')
                                .bind('click', function (evt) {
                                    evt.preventDefault();
                                    _t.playVideo($(this));
                                });
                        },
                        setVideo: function (o) {
                            o = o || {};
                            var _t = this,
                                k = o['ID'],
                                ind = o['order'],
                                vid = '';

                            if (typeof MediaElementPlayer !== 'undefined')
                                vid = new MediaElementPlayer(k, {
                                    stretching: opt['videoStretching'] || 'fill',
                                    success: function (player, node) {
                                        player.addEventListener('ended', function (e) {
                                            main.current.slideNext();
                                        });
                                    }
                                });
                            else{
                                vid = k;
                                vid.addEventListener('ended', function (e) {
                                    main.current.slideNext();
                                });
                            }

                            _t.arr[ind] = vid;
                        },
                        initPlugin: function () {
                            var _t = this;
                            ID
                                .find(_t.el.con)
                                .each(function (ind) {
                                    var ths = $(this),
                                        button = ths.siblings(_t.el.button);

                                    button.attr('data-order', ind);

                                    if (uty.detectEl(ths.find(_t.el.video)))
                                        _t.setVideo({ ID: ths.find(_t.el.video).get(0), order: ind });
                                });
                        },
                        init: function () {
                            var _t = this;
                            if (ID.find(_t.el.con).length > 0) {
                                _t.initPlugin();
                                _t.addEvent();
                            }

                        }
                    },

                    _autoPlay = function (o) {
                        o = o || {};
                        var current = main['current'] || '',
                            type = o['type'] || 'start';

                        if (duration != 0 && duration != '' && current != '') {
                            if (type == 'start')
                                current.autoplay.start();
                            else
                                current.autoplay.stop();
                        }
                    },

                    _lazy = function (o) {
                        o = o || {};

                        var target = (o['target'] || '');

                        if (uty.detectEl(target))
                            target
                                .each(function () {
                                    var ths = $(this),
                                        order = ths.attr('data-order') || 0,
                                        lazy = ths.add(ID.find('[data-order="' + order + '"]')).find(opt['lazy']);

                                    if (uty.detectEl(lazy))
                                        lazy
                                            .each(function () {
                                                var ths = $(this);
                                                ths.removeClass('lazy-swiper lazy-mobi-swiper lazy-desktop-swiper');
                                                uty.lazyLoad({ ID: ths });
                                            });
                                });
                    },

                    _detectPosition = {
                        get: function (k) {
                            var b = false,
                                padding = 50,
                                con = uty.detectEl(ID.find(opt['innerClass'])) ? ID.find(opt['innerClass']) : ID,
                                o1 = { x: con.offset().left, y: con.offset().top, width: con.width() - padding, height: con.height() },
                                o2 = { x: k.offset().left, y: k.offset().top, width: k.width(), height: k.height() };
                            if (o1.x < o2.x + o2.width && o1.x + o1.width > o2.x && o1.y < o2.y + o2.height && o1.y + o1.height > o2.y)
                                b = true;

                            return b;
                        },
                        set: function () {
                            var _t = this,
                                wrp = ID.find(opt['wrapperClass']),
                                sld = wrp.find(opt['slideClass']);

                            if (uty.detectEl(sld))
                                setTimeout(function () {
                                    sld
                                        .removeClass(main.cls['active'])
                                        .each(function () {
                                            var ths = $(this);
                                            if (_t.get(ths))
                                                ths.addClass(main.cls['active']);
                                        });

                                    var active = wrp.find(opt['slideClass'] + '.' + main.cls['active']);
                                    _lazy({ target: active });
                                    _dispatch({ target: active });
                                    _callback({ type: 'lazyload', value: active });

                                }, 222);
                        }
                    },

                    main = {
                        cls: {
                            imageLoaded: 'image-loaded',
                            imageLazy: 'lazy-load',
                            active: 'slide-active',
                            noResult: 'no-result',
                            itemCount: 'item-'
                        },
                        current: null,
                        objAddEvent: function (obj) {
                            obj = obj || {};
                            var _t = this;

                            if (duration != '' && duration != 0)
                                obj['autoplay'] = {
                                    delay: duration
                                };

                            obj['on'] = {
                                init: function () {
                                    _detectPosition.set();

                                    setTimeout(function () {
                                        _videos.disabled();
                                    }, 333);

                                    _callback({ type: 'init' });
                                    _dispatch({ type: 'init' });
                                },
                                touchStart: function () {
                                    _autoPlay({ type: 'stop' });
                                    _callback({ type: 'touchStart' });
                                    _dispatch({ type: 'touchStart' });
                                },
                                touchEnd: function () {
                                    _autoPlay({ type: 'start' });
                                    _callback({ type: 'touchEnd' });
                                    _dispatch({ type: 'touchEnd' });
                                },
                                slideChangeTransitionStart: function (s) {
                                    _autoPlay({ type: 'stop' });
                                    _callback({ type: 'slideChangeTransitionStart', value: s });
                                    _dispatch({ type: 'slideChangeTransitionStart', value: s });
                                },
                                transitionEnd: function (s) {
                                    _detectPosition.set();
                                    _autoPlay({ type: 'start' });
                                    _videos.disabled();
                                    _callback({ type: 'slideChangeTransitionEnd', value: s });
                                    _dispatch({ type: 'slideChangeTransitionEnd', value: s });
                                }
                            };
                            return obj;
                        },
                        addOrder: function () {
                            var _t = this,
                                wrp = ID.find(opt['wrapperClass']),
                                sld = wrp.find(opt['slideClass']),
                                n = sld.length;

                            ID
                                .addClass(_t.cls['itemCount'] + n)
                                .find(opt['wrapperClass'])
                                .find(opt['slideClass'])
                                .each(function (i, k) {
                                    $(this).attr('data-order', i);
                                });

                            if (n == 0)
                                ID.addClass(_t.cls['noResult']);

                            return n;
                        },
                        init: function () {
                            var _t = this,
                                n = _t.addOrder();


                            if( typeof Swiper !== 'undefined' ){
                                if (n > 1) {
                                    var key = ID.attr('data-swiper') || 'main',
                                        prop = _t.objAddEvent((SITE_CONFIG['plugin']['swiper'] || {})[key] || SITE_CONFIG['plugin']['swiper']['main'] || {});
                                    _t.current = new Swiper(ID, prop);
                                } else {
                                    ID.addClass('no-controls').find('.swiper-slide').addClass('swiper-slide-active');
                                    _lazy({ target: ID });
                                    setTimeout(function () {
                                        _videos.disabled();
                                    }, 333);
                                }
                            }else
                                console.error('swiper.min.js ekle')
                            
                        }
                    };
                main.init();
                _videos.init();



                this.getCurrent = function () {
                    if (main.current != null)
                        return main.current;
                };

                this.adjust = function () {
                    if (main.current != null)
                        _detectPosition.set();
                };

                this.update = function () {
                    if (main.current != null) {
                        var wrp = ID.find(opt['wrapperClass']),
                            sld = wrp.find(opt['slideClass']);
                        sld.css({ width: '' });
                        (function () { main.current.update(); }());
                    }
                };

                this.destroy = function () {
                    if (main.current != null)
                        main.current.destroy(false, true);
                };

                this.focused = function (index) {
                    if (main.current != null)
                        main.current.slideTo(index, 222);
                };

            });
        }
    });
})(jQuery);