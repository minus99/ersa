/* 
    liste görünüm
*/
(function ($) {
    $.fn.extend({
        minusViewer: function (options, callback) {
            var defaults = {
                btn: '[rel]',
                selected: 'selected',
                defaultSelected: {
                    mobi: 'view-2',
                    desktop: 'view-3'
                }
            };

            var option = $.extend(defaults, options);

            return this.each(function (e) {
                var opt = option,
                    ID = $(this),
                    _dispatch = function (obj) {
                        obj = obj || {};
                        stage.dispatchEvent("CustomEvent", 'VIEW_TYPE_CLICKED', $.extend({ ID: ID }, obj));
                    },
                    _callback = function (obj) {
                        obj = obj || {};
                        if (typeof callback !== 'undefined')
                            callback($.extend({ ID: ID }, obj));
                    },
                    main = {
                        el: {
                            btn: opt['btn']
                        },
                        cls: {
                            selected: opt['selected']
                        },
                        trigger: function (o) {
                            o = o || {};
                            _dispatch(o);
                            _callback(o);
                        },
                        cookie: function (o) {
                            var _t = this,
                                typ = o['typ'] || '';

                            if (typ == 'set')
                                uty.Cookies({ name: 'viewType', typ: 'set', minutes: 14400, value: o['val'] || '' });
                            else if (typ == 'get')
                                return uty.Cookies({ name: 'viewType', typ: 'get' });
                        },
                        addEvent: function () {
                            var _t = this,
                                btn = ID.find(_t.el.btn),
                                cls = btn
                                    .map(function () {
                                        return $(this).attr('rel') || '';
                                    })
                                    .get()
                                    .join(' ');

                            btn
                                .unbind('click')
                                .bind('click', function () {
                                    var ths = $(this),
                                        rel = ths.attr('rel') || '';

                                    btn
                                        .removeClass(_t.cls['selected']);

                                    ths.addClass(_t.cls['selected']);

                                    bdy.removeClass(cls).addClass(rel);

                                    _t.cookie({ typ: 'set', val: rel });

                                    setTimeout(function () {
                                        win.resize();
                                        _t.trigger({ type: 'clicked', target: ths });
                                    }, 10);
                                });
                        },
                        check: function () {
                            var _t = this,
                                btn = ID.find(_t.el.btn),
                                k = _t.cookie({ typ: 'get' }),
                                ds = opt['defaultSelected'] || {},
                                act = uty.visibleControl() ? ds['mobi'] : ds['desktop'] || '',
                                ind = uty.detectEl($(_t.el.btn + '[rel="' + act + '"]')) ? ($(_t.el.btn + '[rel="' + act + '"]').index() || 0) : ($(_t.el.btn + '.' + _t.cls['selected']).index() || 0);

                            if (k != '') {
                                k = $(_t.el.btn + '[rel="' + k + '"]');
                                if (uty.detectEl(k))
                                    ind = k.index();
                            }

                            btn
                                .eq(ind)
                                .click();
                        },
                        init: function () {
                            var _t = this;
                            if (uty.detectEl(ID.find(_t.el.btn))) {
                                _t.addEvent();
                                _t.check();
                            }
                        }
                    };
                main.init();
            });
        }
    });
})(jQuery);