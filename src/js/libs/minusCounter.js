/* 
    MINUS COUNTER
*/
(function ($) {
    $.fn.extend({
        minusCounter: function (options, callback) {
            var defaults = {
                btnBottom: '<a class="counter-btn bottom-btn" rel="dec" href="javascript:void(0);"><span><i class="icon-ico_minus"></i></span></a>',
                btnTop: '<a class="counter-btn top-btn" rel="inc" href="javascript:void(0);"><span><i class="icon-ico_plus"></i></span></a>'
            };
            var options = $.extend(defaults, options);
            return this.each(function () {
                var el = $(this),
                    _min = el.attr('min') || 1,
                    _max = el.attr('max') || 0,
                    opt = options,
                    uty = {
                        cleanText: function (k) { return k.replace(/\s+/g, ''); },
                        cleanChar: function (k) { return k.replace(/[^0-9]/g, ''); }
                    },
                    main = {
                        template: {
                            bottom: opt['btnBottom'] || '',
                            top: opt['btnTop'] || ''
                        },
                        check: function () {
                            var _t = main,
                                ths = $(this),
                                rel = ths.attr('rel') || '',
                                val = parseFloat(uty.cleanChar(uty.cleanText(el.val())));

                            if (isNaN(val)) val = _min;

                            if (rel == 'inc') val++;
                            else if (rel == 'dec') val--;

                            if (_max != 0)
                                if (val >= _max) val = _max;

                            if (val <= _min) val = _min;

                            el.val(val).change();
                        },
                        addEvent: function () {
                            var _t = this;
                            el
                                .siblings('.counter-btn')
                                .bind('click', _t.check);

                            el
                                .unbind('keypress')
                                .bind('keypress', function (evt) {
                                    var theEvent = evt || window.event,
                                        key = theEvent.keyCode || theEvent.which,
                                        regex = /[0-9]|\./;

                                    if (!regex.test(String.fromCharCode(key))) {
                                        theEvent.returnValue = false;
                                        if (theEvent.preventDefault) theEvent.preventDefault();
                                    }
                                })
                                .bind('blur', _t.check);

                        },
                        add: function () {
                            var _t = this;
                            el
                                .before(_t.template.bottom)
                                .after(_t.template.top);
                        },
                        init: function () {
                            var _t = this;
                            _t.add();
                            _t.addEvent();
                        }
                    };

                main.init();
            })
        }
    })
})(jQuery, window);