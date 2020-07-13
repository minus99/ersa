/* 
    USAGE:
    new MinusSwiper({ ID: document.querySelectorAll('[data-swiper]') });
    new MinusSwiper({ ID: document.querySelectorAll('[data-swiper]'), options: { slideClass: '> .slide-items' } });
*/

function MinusSwiper(o, callback) {

    o = o || {};

    var defaults = {
        innerClass: '.swiper-inner',
        wrapperClass: '.swiper-wrapper',
        slideClass: '.swiper-slide',
        lazy: '.lazy, .lazy-load, .lazy-back-load, .lazyload, .lazy-swiper, .lazy-mobi-swiper, .lazy-desktop-swiper, .picture-lazy',
        videoStretching: 'fill'
    };

    this.ID = o['ID'] || '';
    this.opt = utils.extend(defaults, o['options'] || {});
    this.duration = this.ID.getAttribute('data-duration') || '';
    this.callback = callback;
    this.init();
}

MinusSwiper.prototype = {

    constructor: MinusSwiper,

    current: null,

    cls: {
        imageLoaded: 'image-loaded',
        imageLazy: 'lazy-load',
        active: 'slide-active',
        noResult: 'no-result',
        noControl: 'no-control',
        itemCount: 'item-',
        activeSlide: 'swiper-slide-active'
    },

    _dispatch: function (obj) {
        var _t = this;
        stage.dispatchEvent("CustomEvent", "SWIPER_ACTIVE_ELEMENT", utils.extend({ ID: _t.ID }, obj));
    },

    _callback: function (obj) {
        var _t = this;
        if (typeof _t.callback !== 'undefined')
            _t.callback(utils.extend({ ID: _t.ID }, obj));
    },



    _videos: {

        main: null,

        activeted: false,

        el: {
            video: 'video',
            activeVid: '.swiper-slide-active video'
        },
        cls: {
            active: 'video-active',
            isPause: 'isPause',
            isPlay: 'isPlay'
        },
        arr: {},
        disabled: function () {
            var _t = this;

            if (utils.detectEl(_t.main.ID.querySelector(_t.el.video)) && _t.activeted) {
                utils.forEach(_t.main.ID.querySelectorAll('.' + _t.cls['isPlay']), function (i, elm) {
                    elm.classList.remove(_t.cls['isPlay']);
                    elm.classList.remove(_t.cls['active']);
                    var vid = elm.querySelector(_t.el.video);
                    if (utils.detectEl(vid))
                        vid.pause();
                });

                // play video
                var vid = _t.main.ID.querySelector(_t.el.activeVid);
                if (utils.detectEl(vid))
                    _t.playVideo(vid);
            }

        },
        playVideo: function (vid) {
            var _t = this,
                prts = utils.getParents(vid, 'li');

            if (vid != '') {
                vid.play();
                prts.classList.add(_t.cls['isPlay']);
                prts.classList.add(_t.cls['active']);
                _t.main._autoPlay({ type: 'stop' });
            } else
                console.error('swiper video html kontrol et');
        },
        setVideo: function (o) {
            o = o || {};
            var _t = this,
                target = o['ID'];

            if (typeof MediaElementPlayer !== 'undefined')
                new MediaElementPlayer(target, {
                    stretching: _t.main.opt['videoStretching'] || 'fill',
                    success: function (player, node) {
                        player.addEventListener('ended', function (e) {
                            if (_t.main.current)
                                _t.main.current.slideNext();
                        });
                    }
                });
            else {
                target.addEventListener('ended', function (e) {
                    if (_t.main.current)
                        _t.main.current.slideNext();
                });
            }
        },
        initPlugin: function () {
            var _t = this,
                target = _t.main.ID.querySelectorAll(_t.el.video);

            if (utils.detectEl(target))
                utils.forEach(target, function (i, elm) {
                    _t.setVideo({ ID: elm, order: i });
                });
        },
        init: function () {
            var _t = this;
            if (utils.detectEl(_t.main.ID.querySelector(_t.el.video)) && !_t.activeted) {
                _t.activeted = true;
                _t.initPlugin();
            }
        }
    },


    _lazy: function (o) {
        o = o || {};
        var _t = this,
            opt = _t.opt,
            target = o['target'];

        utils.forEach(target, function (i, elm) {
            var k = elm.querySelectorAll(opt['lazy']);
            if (utils.detectEl(k))
                utils.forEach(k, function (i, ths) {
                    //console.log('lazyyyyyyy', ths);
                });
        });
    },

    _detectPosition: function (target) {

        var _t = this,

            b = false,

            padding = 50,

            ID = _t.ID,

            opt = _t.opt,

            con = utils.detectEl(ID.querySelector(opt['innerClass'])) ? ID.querySelector(opt['innerClass']) : ID,

            conBounding = con.getBoundingClientRect() || {},

            targetBounding = target.getBoundingClientRect() || {},

            o1 = { x: conBounding.left, y: conBounding.top, width: conBounding.width - padding, height: conBounding.height },

            o2 = { x: targetBounding.left, y: targetBounding.top, width: targetBounding.width, height: targetBounding.height };

        if (o1.x < o2.x + o2.width && o1.x + o1.width > o2.x && o1.y < o2.y + o2.height && o1.y + o1.height > o2.y)
            b = true;

        return b;
    },

    _checkArea: function () {
        var _t = this,
            ID = _t.ID,
            opt = _t.opt,
            wrp = ID.querySelector(opt['wrapperClass']),
            sld = wrp.querySelectorAll(opt['slideClass']);

        if (utils.detectEl(sld))
            setTimeout(function () {

                utils.forEach(sld, function (i, ths) {
                    ths.classList.remove(_t.cls['active']);
                    if (_t._detectPosition(ths))
                        ths.classList.add(_t.cls['active']);
                });

                var activeElem = wrp.querySelectorAll('.' + _t.cls['active']);

                _t._lazy({ target: activeElem });
                _t._dispatch({ type: 'active-elements', target: activeElem });
                _t._callback({ type: 'active-elements', value: activeElem });

            }, 50);
    },


    _autoPlay: function (o) {
        o = o || {};
        var _t = this,
            current = _t.current || '',
            duration = _t.duration || '',
            type = o['type'] || 'start';

        if (duration != 0 && duration != '' && current != '') {
            if (type == 'start')
                current.autoplay.start();
            else
                current.autoplay.stop();
        }
    },

    objAddEvent: function (obj) {
        obj = obj || {};
        var _t = this;

        if (_t.duration != '' && _t.duration != 0)
            obj['autoplay'] = {
                delay: _t.duration
            };

        obj['on'] = {
            init: function () {
                _t._checkArea();

                setTimeout(function () {
                    _t._videos.disabled();
                }, 333);

                _t._callback({ type: 'init' });
                _t._dispatch({ type: 'init' });
            },
            touchStart: function () {
                _t._autoPlay({ type: 'stop' });
                _t._callback({ type: 'touchStart' });
                _t._dispatch({ type: 'touchStart' });
            },
            touchEnd: function () {
                _t._autoPlay({ type: 'start' });
                _t._callback({ type: 'touchEnd' });
                _t._dispatch({ type: 'touchEnd' });
            },
            slideChangeTransitionStart: function (s) {
                _t._autoPlay({ type: 'stop' });

                _t._callback({ type: 'slideChangeTransitionStart', value: s });
                _t._dispatch({ type: 'slideChangeTransitionStart', value: s });
            },
            transitionEnd: function (s) {
                _t._checkArea();
                _t._autoPlay({ type: 'start' });

                _t._videos.disabled();

                _t._callback({ type: 'slideChangeTransitionEnd', value: s });
                _t._dispatch({ type: 'slideChangeTransitionEnd', value: s });
            }
        };
        return obj;
    },

    addOrder: function () {
        var _t = this,
            ID = _t.ID,
            opt = _t.opt,
            wrp = ID.querySelector(opt['wrapperClass']),
            sld = wrp.querySelectorAll(opt['slideClass']),
            n = sld.length;

        ID.classList.add(_t.cls['itemCount'] + n);

        utils.forEach(sld, function (i, ths) {
            ths.setAttribute('data-order', i);
        });

        if (n == 0)
            ID.classList.add(_t.cls['noResult']);

        return n;
    },

    init: function () {
        var _t = this,
            ID = _t.ID,
            opt = _t.opt,
            n = _t.addOrder();

        if (typeof Swiper !== 'undefined') {

            _t._videos.main = _t;

            if (n > 1) {

                var key = ID.getAttribute('data-swiper') || 'main',
                    prop = _t.objAddEvent((SITE_CONFIG['plugin']['swiper'] || {})[key] || SITE_CONFIG['plugin']['swiper']['main'] || {});

                _t.current = new Swiper(ID, prop);

                _t._videos.init();

            } else {
                ID.classList.add(_t.cls['noControl']);
                ID.querySelector(opt['slideClass']).classList.add(_t.cls['activeSlide']);
                _t._lazy({ target: ID.querySelector(opt['slideClass']) });

                _t._videos.init();
                setTimeout(function () {
                    _t._videos.disabled();
                }, 333);
            }

        } else
            console.error('swiper.min.js ekle')

    }
};