
/* 

    liste sort

*/
(function ($) {
    $.fn.extend({
        minusListSort: function (options, callback) {
            var defaults = {
                drp: '[id$="drpSRT_SPR_AD"]',
                btn: '[rel]',

                clearBtn: '.btn-sort-clear',
                mobiBtn: '.btn-sort-popup',
                mobiCloseBtn: '.btn-sort-popup-close',

                // cls
                selected: 'link_selected',
                ready: 'ems-sort-ready',
                animate: 'ems-sort-animate'
            };

            var option = $.extend(defaults, options);

            return this.each(function (e) {
                var opt = option,
                    ID = $(this),
                    _dispatch = function (obj) {
                        obj = obj || {};
                        stage.dispatchEvent("CustomEvent", 'SORT_LIST_CLICKED', $.extend({ ID: ID }, obj));
                    },
                    _callback = function (obj) {
                        obj = obj || {};
                        if (typeof callback !== 'undefined')
                            callback($.extend({ ID: ID }, obj));
                    },
                    main = {
                        param: 'srt',
                        cls: {
                            selected: opt['selected'],
                            ready: opt['ready'],
                            animate: opt['animate']
                        },
                        trigger: function (o) {
                            o = o || {};
                            _dispatch(o);
                            _callback(o);
                        },
                        popup: function (k) {
                            var _t = this;
                            if (k == 'show') {
                                bdy.addClass(opt['ready']);
                                setTimeout(function () {
                                    bdy.addClass(opt['animate']);
                                }, 100);
                            } else {
                                bdy.removeClass(opt['animate']);
                                setTimeout(function () {
                                    bdy.removeClass(opt['ready']);
                                }, 300);
                            }
                        },
                        set: function (o) {
                            var _t = this,
                                rel = o['rel'] || '',
                                typ = o['typ'] || 'add',
                                uri = '';

                            if (rel != '') {
                                var loc = window.location.search;

                                if (typ == 'add') {
                                    if (loc.indexOf(_t.param + '=' + rel) != -1)
                                        uri = minusLoc.remove('?', _t.param);
                                    else
                                        uri = minusLoc.put('?', rel, _t.param);
                                } else
                                    uri = minusLoc.remove('?', _t.param);


                                _t.trigger({ type: 'change_uri', uri: uri });
                            }else{
                                uri = minusLoc.remove('?', _t.param);
                                _t.trigger({ type: 'change_uri', uri: uri });
                            }

                        },
                        addEvent: function () {
                            var _t = this;

                            ID
                                .find(opt['btn'])
                                .unbind('click')
                                .bind('click', function () {
                                    _t.set({ rel: $(this).attr('rel') || '' });
                                });


                            $(opt['clearBtn'])
                                .unbind('click')
                                .bind('click', function () {
                                    _t.set({ rel: 'srt', typ: 'remove' });
                                });

                            $(opt['drp'])
                                .removeAttr('onchange')
                                .unbind('change')
                                .bind('change', function () {
                                    _t.set({ rel: $(this).val() || '' });
                                })

                            $(opt['mobiBtn'])
                                .unbind('click')
                                .bind('click', function () {
                                    _t.popup('show');
                                });

                            $(opt['mobiCloseBtn'])
                                .unbind('click')
                                .bind('click', function () {
                                    _t.popup('hide');
                                });
                        },
                        check: function () {
                            var _t = this,
                                k = minusLoc.get('?', _t.param) || '';
                            if (k != '') {
                                k = ID.find('[rel="' + k + '"]');
                                if (uty.detectEl(k))
                                    k.addClass(_t.cls['selected']);
                            }
                        },
                        init: function () {
                            var _t = this;
                            if (uty.detectEl(ID.find(opt['btn']))) {
                                _t.check();
                                _t.addEvent();
                            }
                        }
                    };
                main.init();
            });
        }
    });
})(jQuery);