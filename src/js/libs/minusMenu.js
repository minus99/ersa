/* 
    MINUS MENU 
*/
(function ($) {
    $.fn.extend({
        minusMenu: function (options, callback) {
            var defaults = {
                closeElem: '',
                items: '> ul > li',
                siblings: 'li',
                controls: '> ul, > div',
                customClass: 'selected',
                openedDelay: 200,
                closedDelay: 555,
                eventType: 'hover',
                clickedElem: '> a',
                bdyClicked: false,
                isVisible: '',
                setPos: '', // menuyu kapsayan hedef alanının classı
                overlay: false,
                bdyCls: '',
                bdyCls2: '',
            };
            var options = $.extend(defaults, options);
            return this.each(function () {
                var o = options,
                    el = $(this),
                    items = el.find(o.items),
                    lazyImage = function (obj) {
                        obj = obj || {};
                        var typ = obj['typ'] || '';
                        if (typ == 'opened')
                            uty.lazyImage({ ID: el.find('> ul > li' + '.' + o.customClass) });
                    },
                    cllbck = function (o) {
                        o = o || {};
                        if (typeof callback !== 'undefined') {
                            o['ID'] = el;
                            callback(o);
                        }
                    },
                    main = {
                        stm: null,
                        clearTm: function () {
                            var _t = this;
                            if (_t.stm != null)
                                clearTimeout(_t.stm);
                        },
                        detectEl: function (ID) { return ID.length > 0 ? true : false; },
                        isVisible: function () { return uty.visibleControl(); },
                        overlayControls: function (k) {
                            var _t = this;
                            if (o.overlay) {
                                if (k == 'opened') {
                                    bdy.addClass(o.bdyCls);
                                    setTimeout(function () {
                                        bdy.addClass(o.bdyCls2);
                                    }, 100);
                                }
                                else {
                                    var e = el.find('> ul > li' + '.' + o.customClass);
                                    if (!_t.detectEl(e)) {
                                        bdy.removeClass(o.bdyCls2);
                                        setTimeout(function () {
                                            bdy.removeClass(o.bdyCls);
                                        }, 100);
                                    }

                                }
                            }
                            lazyImage({ typ: k });
                            setTimeout(function () { cllbck({ typ: k }); }, 100);
                        },
                        setPos: function (ID) {
                            if (o.setPos != '') {
                                var _t = this,
                                    k = $(o.controls, ID),
                                    e = $(o.setPos);
                                if (_t.detectEl(k) && _t.detectEl(e)) {
                                    var x1 = ID.offset().left + 810, x2 = e.width() + e.offset().left;
                                    if (x1 >= x2) k.css({ 'left': x2 - x1 });
                                }
                            }
                        },
                        closeElem: function () {
                            if (o.closeElem != '')
                                $(o.closeElem).each(function () {
                                    var ths = $(this).get(0);
                                    if (typeof ths.closed !== 'undefined')
                                        ths.closed();
                                });
                        },
                        events: {
                            onMouseEnter: function () {
                                var _t = main, ths = $(this);

                                if (_t.isVisible()) return false;

                                if (_t.detectEl($(o.controls, ths))) {
                                    _t.clearTm();
                                    _t.stm = setTimeout(function () {
                                        _t.closeElem();
                                        ths.addClass(o.customClass).siblings(o.siblings).removeClass(o.customClass);
                                        _t.setPos(ths);
                                        _t.overlayControls('opened');
                                    }, o.openedDelay);
                                }
                            },
                            onMouseLeave: function () {
                                var _t = main, ths = $(this);
                                if (_t.isVisible()) return false;
                                _t.clearTm();
                                _t.stm = setTimeout(function () {
                                    ths.add(ths.siblings(o.siblings)).removeClass(o.customClass);
                                    _t.overlayControls('closed');
                                }, o.closedDelay);
                            },
                            onClick: function (e) {
                                var _t = main, ths = $(this).parent(o.siblings);
                                if (_t.detectEl($(o.controls, ths)) && !_t.isVisible()) {
                                    e.preventDefault();
                                    if (ths.hasClass(o.customClass)) {
                                        ths.removeClass(o.customClass).siblings(o.siblings).removeClass(o.customClass);
                                        _t.overlayControls('closed');
                                    } else {
                                        ths.addClass(o.customClass).siblings(o.siblings).removeClass(o.customClass);
                                        _t.setPos(ths);
                                        _t.overlayControls('opened');
                                    }
                                }
                            },
                            bdyClicked: function (e) {
                                var _t = main;
                                if (!el.is(e.target) && el.has(e.target).length === 0 && !_t.isVisible()) {
                                    el.find('> ul > li').removeClass(o.customClass);
                                    _t.overlayControls('closed');
                                }
                            }
                        },
                        addEvent: function () {
                            var _t = this;

                            if (o.eventType == 'hover')
                                items.bind('mouseenter', _t.events.onMouseEnter).bind('mouseleave', _t.events.onMouseLeave);
                            else if (o.eventType == 'click')
                                $(o.clickedElem, items).bind('click', _t.events.onClick);

                            if (o.bdyClicked)
                                $('body, html').bind('click touchstart', _t.events.bdyClicked);
                        },
                        destroy: function () {
                            var _t = this;
                            $('.' + o.customClass, el).removeClass(o.customClass);
                            _t.overlayControls('closed');
                        },
                        init: function () {
                            var _t = this;
                            _t.addEvent();
                        }
                    };


                this.closed = function () {
                    if (main.stm != null) clearTimeout(main.stm);
                    main.destroy()
                };

                main.init();
            })
        }
    })
})(jQuery, window);